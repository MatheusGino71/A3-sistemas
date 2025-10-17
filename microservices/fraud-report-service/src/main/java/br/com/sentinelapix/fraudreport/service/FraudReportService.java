package br.com.sentinelapix.fraudreport.service;

import br.com.sentinelapix.fraudreport.dto.FraudReportRequestDTO;
import br.com.sentinelapix.fraudreport.dto.FraudReportResponseDTO;
import br.com.sentinelapix.fraudreport.model.FraudPriority;
import br.com.sentinelapix.fraudreport.model.FraudReport;
import br.com.sentinelapix.fraudreport.model.FraudStatus;
import br.com.sentinelapix.fraudreport.repository.FraudReportRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Serviço principal para processamento de denúncias de fraude PIX
 * 
 * Responsável por:
 * - Validar e processar denúncias
 * - Calcular prioridade baseada no valor e histórico
 * - Persistir dados no banco PostgreSQL
 * - Publicar eventos para RabbitMQ
 */
@Service
@Transactional
public class FraudReportService {

    @Autowired
    private FraudReportRepository fraudReportRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private static final String FRAUD_REPORT_EXCHANGE = "sentinela.pix.exchange";
    private static final String NEW_REPORT_ROUTING_KEY = "fraud.report.new";

    /**
     * Criar nova denúncia de fraude PIX
     */
    public FraudReportResponseDTO createFraudReport(FraudReportRequestDTO request, String sourceIp, String userAgent) {
        
        // Verificar se já existe denúncia para esta transação
        Optional<FraudReport> existingReport = fraudReportRepository.findByTransactionId(request.getTransactionId());
        if (existingReport.isPresent()) {
            throw new IllegalArgumentException("Já existe uma denúncia registrada para esta transação");
        }

        // Converter DTO para Entity
        FraudReport fraudReport = new FraudReport();
        fraudReport.setPixKey(request.getPixKey());
        fraudReport.setAmount(request.getAmount());
        fraudReport.setTransactionTimestamp(request.getTransactionTimestamp());
        fraudReport.setTransactionId(request.getTransactionId());
        fraudReport.setVictimBank(request.getVictimBank());
        fraudReport.setReporterInfo(request.getReporterInfo());
        fraudReport.setObservations(request.getObservations());
        fraudReport.setSourceIp(sourceIp);
        fraudReport.setUserAgent(userAgent);

        // Calcular prioridade baseada no valor
        FraudPriority priority = FraudPriority.calculateByAmount(request.getAmount());
        
        // Ajustar prioridade baseada no histórico da chave PIX
        long previousReportsCount = fraudReportRepository.countByPixKeyAndStatus(
            request.getPixKey(), FraudStatus.CONFIRMED);
        priority = FraudPriority.adjustByReportHistory(priority, (int) previousReportsCount);
        
        fraudReport.setPriority(priority);
        fraudReport.setStatus(FraudStatus.PENDING);

        // Salvar no banco de dados
        FraudReport savedReport = fraudReportRepository.save(fraudReport);

        // Publicar evento para RabbitMQ
        publishNewReportEvent(savedReport);

        // Converter para DTO de resposta
        return convertToResponseDTO(savedReport);
    }

    /**
     * Buscar denúncia por ID
     */
    @Transactional(readOnly = true)
    public FraudReportResponseDTO getFraudReportById(Long id) {
        FraudReport report = fraudReportRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Denúncia não encontrada com ID: " + id));
        
        return convertToResponseDTO(report);
    }

    /**
     * Buscar denúncia por transaction ID
     */
    @Transactional(readOnly = true)
    public FraudReportResponseDTO getFraudReportByTransactionId(String transactionId) {
        FraudReport report = fraudReportRepository.findByTransactionId(transactionId)
            .orElseThrow(() -> new IllegalArgumentException("Denúncia não encontrada para transação: " + transactionId));
        
        return convertToResponseDTO(report);
    }

    /**
     * Listar denúncias com filtros e paginação
     */
    @Transactional(readOnly = true)
    public Page<FraudReportResponseDTO> listFraudReports(String pixKey, String victimBank, 
            String status, String priority, Pageable pageable) {
        
        FraudStatus fraudStatus = null;
        if (status != null) {
            try {
                fraudStatus = FraudStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Status inválido: " + status);
            }
        }

        FraudPriority fraudPriority = null;
        if (priority != null) {
            try {
                fraudPriority = FraudPriority.valueOf(priority.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Prioridade inválida: " + priority);
            }
        }

        Page<FraudReport> reportsPage = fraudReportRepository.findWithFilters(
            pixKey, victimBank, fraudStatus, fraudPriority, pageable);

        return reportsPage.map(this::convertToResponseDTO);
    }

    /**
     * Buscar denúncias por chave PIX
     */
    @Transactional(readOnly = true)
    public Page<FraudReportResponseDTO> getFraudReportsByPixKey(String pixKey, Pageable pageable) {
        Page<FraudReport> reportsPage = fraudReportRepository.findByPixKeyOrderByReportTimestampDesc(pixKey, pageable);
        return reportsPage.map(this::convertToResponseDTO);
    }

    /**
     * Atualizar status de uma denúncia
     */
    public FraudReportResponseDTO updateReportStatus(Long id, String newStatus, String observations) {
        FraudReport report = fraudReportRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Denúncia não encontrada com ID: " + id));

        FraudStatus status;
        try {
            status = FraudStatus.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Status inválido: " + newStatus);
        }

        report.setStatus(status);
        if (observations != null && !observations.trim().isEmpty()) {
            report.setObservations(observations);
        }
        report.setUpdatedAt(LocalDateTime.now());

        FraudReport updatedReport = fraudReportRepository.save(report);

        // Publicar evento de atualização
        publishReportUpdateEvent(updatedReport);

        return convertToResponseDTO(updatedReport);
    }

    /**
     * Obter estatísticas de uma chave PIX
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getPixKeyStatistics(String pixKey) {
        long totalReports = fraudReportRepository.countByPixKey(pixKey);
        long confirmedReports = fraudReportRepository.countByPixKeyAndStatus(pixKey, FraudStatus.CONFIRMED);
        long pendingReports = fraudReportRepository.countByPixKeyAndStatus(pixKey, FraudStatus.PENDING);
        
        // Buscar primeira e última denúncia
        Optional<FraudReport> firstReport = fraudReportRepository.findFirstByPixKeyOrderByReportTimestampAsc(pixKey);
        Optional<FraudReport> lastReport = fraudReportRepository.findFirstByPixKeyOrderByReportTimestampDesc(pixKey);

        Map<String, Object> statistics = new HashMap<>();
        statistics.put("pixKey", pixKey);
        statistics.put("totalReports", totalReports);
        statistics.put("confirmedReports", confirmedReports);
        statistics.put("pendingReports", pendingReports);
        statistics.put("firstReportDate", firstReport.map(FraudReport::getReportTimestamp).orElse(null));
        statistics.put("lastReportDate", lastReport.map(FraudReport::getReportTimestamp).orElse(null));
        
        // Calcular nível de risco
        String riskLevel = calculateRiskLevel(totalReports, confirmedReports);
        statistics.put("riskLevel", riskLevel);
        
        return statistics;
    }

    /**
     * Publicar evento de nova denúncia para RabbitMQ
     */
    private void publishNewReportEvent(FraudReport report) {
        try {
            Map<String, Object> eventData = createEventData(report);
            eventData.put("eventType", "NEW_FRAUD_REPORT");
            
            rabbitTemplate.convertAndSend(FRAUD_REPORT_EXCHANGE, NEW_REPORT_ROUTING_KEY, eventData);
            
            System.out.println("Evento publicado: Nova denúncia para PIX " + report.getPixKey());
        } catch (Exception e) {
            System.err.println("Erro ao publicar evento: " + e.getMessage());
            // Log do erro mas não falha a transação principal
        }
    }

    /**
     * Publicar evento de atualização de denúncia
     */
    private void publishReportUpdateEvent(FraudReport report) {
        try {
            Map<String, Object> eventData = createEventData(report);
            eventData.put("eventType", "FRAUD_REPORT_UPDATE");
            
            rabbitTemplate.convertAndSend(FRAUD_REPORT_EXCHANGE, "fraud.report.update", eventData);
            
            System.out.println("Evento publicado: Atualização de status para " + report.getStatus());
        } catch (Exception e) {
            System.err.println("Erro ao publicar evento de atualização: " + e.getMessage());
        }
    }

    /**
     * Criar dados do evento para RabbitMQ
     */
    private Map<String, Object> createEventData(FraudReport report) {
        Map<String, Object> eventData = new HashMap<>();
        eventData.put("reportId", report.getId());
        eventData.put("pixKey", report.getPixKey());
        eventData.put("amount", report.getAmount());
        eventData.put("transactionId", report.getTransactionId());
        eventData.put("victimBank", report.getVictimBank());
        eventData.put("status", report.getStatus().name());
        eventData.put("priority", report.getPriority().name());
        eventData.put("reportTimestamp", report.getReportTimestamp().toString());
        eventData.put("transactionTimestamp", report.getTransactionTimestamp().toString());
        
        return eventData;
    }

    /**
     * Converter entidade para DTO de resposta
     */
    private FraudReportResponseDTO convertToResponseDTO(FraudReport report) {
        FraudReportResponseDTO dto = new FraudReportResponseDTO();
        dto.setId(report.getId());
        dto.setPixKey(report.getPixKey());
        dto.setAmount(report.getAmount());
        dto.setTransactionTimestamp(report.getTransactionTimestamp());
        dto.setTransactionId(report.getTransactionId());
        dto.setVictimBank(report.getVictimBank());
        dto.setReporterInfo(report.getReporterInfo());
        dto.setStatus(report.getStatus());
        dto.setPriority(report.getPriority());
        dto.setReportTimestamp(report.getReportTimestamp());
        dto.setObservations(report.getObservations());
        dto.setUpdatedAt(report.getUpdatedAt());
        
        return dto;
    }

    /**
     * Calcular nível de risco baseado nas estatísticas
     */
    private String calculateRiskLevel(long totalReports, long confirmedReports) {
        if (confirmedReports >= 5) {
            return "CRITICAL";
        } else if (confirmedReports >= 3) {
            return "HIGH";
        } else if (totalReports >= 2) {
            return "MEDIUM";
        } else if (totalReports == 1) {
            return "LOW";
        } else {
            return "UNKNOWN";
        }
    }
}