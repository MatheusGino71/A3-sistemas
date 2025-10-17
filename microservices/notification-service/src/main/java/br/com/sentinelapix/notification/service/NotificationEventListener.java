package br.com.sentinelapix.notification.service;

import br.com.sentinelapix.notification.model.NotificationLog;
import br.com.sentinelapix.notification.model.NotificationStatus;
import br.com.sentinelapix.notification.repository.NotificationLogRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Serviço para escutar eventos de denúncias e enviar notificações
 * 
 * Responsável por:
 * - Escutar eventos do RabbitMQ
 * - Identificar instituição financeira do golpista
 * - Enviar notificação via webhook
 * - Implementar retry logic
 * - Registrar logs de auditoria
 */
@Service
public class NotificationEventListener {

    @Autowired
    private NotificationLogRepository notificationLogRepository;

    @Autowired
    private BankLookupService bankLookupService;

    @Autowired
    private WebClient.Builder webClientBuilder;

    /**
     * Escuta eventos de novas denúncias do RabbitMQ
     */
    @RabbitListener(queues = "fraud.report.notifications")
    public void handleNewFraudReport(Map<String, Object> eventData) {
        System.out.println("Evento recebido: " + eventData);
        
        try {
            // Extrair dados do evento
            String pixKey = (String) eventData.get("pixKey");
            String transactionId = (String) eventData.get("transactionId");
            Long reportId = ((Number) eventData.get("reportId")).longValue();
            
            // Identificar banco do golpista pela chave PIX
            String fraudsterBank = bankLookupService.identifyBankByPixKey(pixKey);
            
            if (fraudsterBank != null) {
                // Obter URL do webhook do banco
                String webhookUrl = bankLookupService.getBankWebhookUrl(fraudsterBank);
                
                if (webhookUrl != null) {
                    // Enviar notificação
                    sendFraudNotification(reportId, fraudsterBank, webhookUrl, eventData);
                } else {
                    logNotificationFailure(reportId, fraudsterBank, 
                        "URL de webhook não configurada para o banco", eventData);
                }
            } else {
                logNotificationFailure(reportId, "UNKNOWN", 
                    "Não foi possível identificar banco pela chave PIX: " + pixKey, eventData);
            }
            
        } catch (Exception e) {
            System.err.println("Erro ao processar evento de denúncia: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Enviar notificação de fraude para instituição financeira
     */
    @Retryable(
        value = {Exception.class},
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public void sendFraudNotification(Long reportId, String bankCode, String webhookUrl, 
                                    Map<String, Object> eventData) {
        
        NotificationLog log = new NotificationLog();
        log.setReportId(reportId);
        log.setTargetBank(bankCode);
        log.setWebhookUrl(webhookUrl);
        log.setAttemptCount(1);
        log.setStatus(NotificationStatus.SENDING);
        
        // Salvar log inicial
        log = notificationLogRepository.save(log);
        
        try {
            // Preparar payload da notificação
            Map<String, Object> notificationPayload = createNotificationPayload(eventData);
            
            // Enviar via WebClient
            WebClient webClient = webClientBuilder.build();
            
            Mono<String> response = webClient
                .post()
                .uri(webhookUrl)
                .header("Content-Type", "application/json")
                .header("X-Sentinela-PIX-Event", "fraud-report")
                .header("X-Sentinela-PIX-Version", "1.0")
                .bodyValue(notificationPayload)
                .retrieve()
                .bodyToMono(String.class);
            
            // Processar resposta
            String responseBody = response.block();
            
            // Atualizar log com sucesso
            log.setStatus(NotificationStatus.DELIVERED);
            log.setResponseStatus(200);
            log.setResponseBody(responseBody);
            log.setDeliveredAt(LocalDateTime.now());
            
            System.out.println("Notificação enviada com sucesso para banco: " + bankCode);
            
        } catch (Exception e) {
            // Atualizar log com erro
            log.setStatus(NotificationStatus.FAILED);
            log.setErrorMessage(e.getMessage());
            log.setAttemptCount(log.getAttemptCount() + 1);
            
            System.err.println("Erro ao enviar notificação: " + e.getMessage());
            throw e; // Re-lançar para trigger retry
            
        } finally {
            log.setUpdatedAt(LocalDateTime.now());
            notificationLogRepository.save(log);
        }
    }

    /**
     * Registrar falha na notificação
     */
    private void logNotificationFailure(Long reportId, String bankCode, String reason, 
                                      Map<String, Object> eventData) {
        
        NotificationLog log = new NotificationLog();
        log.setReportId(reportId);
        log.setTargetBank(bankCode);
        log.setStatus(NotificationStatus.FAILED);
        log.setErrorMessage(reason);
        log.setAttemptCount(0);
        
        notificationLogRepository.save(log);
        
        System.err.println("Falha na notificação - Banco: " + bankCode + ", Motivo: " + reason);
    }

    /**
     * Criar payload da notificação para o banco
     */
    private Map<String, Object> createNotificationPayload(Map<String, Object> eventData) {
        Map<String, Object> payload = new HashMap<>();
        
        // Cabeçalho da notificação
        Map<String, Object> header = new HashMap<>();
        header.put("eventType", "FRAUD_ALERT");
        header.put("version", "1.0");
        header.put("timestamp", LocalDateTime.now().toString());
        header.put("source", "sentinela-pix");
        
        // Dados da fraude
        Map<String, Object> fraudData = new HashMap<>();
        fraudData.put("reportId", eventData.get("reportId"));
        fraudData.put("pixKey", eventData.get("pixKey"));
        fraudData.put("transactionId", eventData.get("transactionId"));
        fraudData.put("amount", eventData.get("amount"));
        fraudData.put("victimBank", eventData.get("victimBank"));
        fraudData.put("priority", eventData.get("priority"));
        fraudData.put("reportTimestamp", eventData.get("reportTimestamp"));
        fraudData.put("transactionTimestamp", eventData.get("transactionTimestamp"));
        
        // Ações recomendadas
        Map<String, Object> recommendations = new HashMap<>();
        String priority = (String) eventData.get("priority");
        
        if ("CRITICAL".equals(priority) || "HIGH".equals(priority)) {
            recommendations.put("action", "IMMEDIATE_BLOCK");
            recommendations.put("description", "Bloqueio imediato da conta recomendado devido ao alto risco");
        } else {
            recommendations.put("action", "INVESTIGATE");
            recommendations.put("description", "Investigação da conta recomendada");
        }
        
        payload.put("header", header);
        payload.put("fraudAlert", fraudData);
        payload.put("recommendations", recommendations);
        
        return payload;
    }
}