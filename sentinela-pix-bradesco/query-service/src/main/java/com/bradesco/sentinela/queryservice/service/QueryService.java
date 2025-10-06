package com.bradesco.sentinela.queryservice.service;

import com.bradesco.sentinela.queryservice.dto.ReportDTO;
import com.bradesco.sentinela.queryservice.dto.RiskAssessmentDTO;
import com.bradesco.sentinela.queryservice.model.RiskLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.List;

@Service
public class QueryService {

    private static final Logger logger = LoggerFactory.getLogger(QueryService.class);
    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(10);

    private final WebClient reportServiceWebClient;

    public QueryService(WebClient reportServiceWebClient) {
        this.reportServiceWebClient = reportServiceWebClient;
    }

    /**
     * Analisa o risco de uma chave PIX consultando o report-service
     */
    public RiskAssessmentDTO assessPixKeyRisk(String pixKey) {
        logger.info("Iniciando análise de risco para chave PIX: {}", maskPixKey(pixKey));

        try {
            // Buscar denúncias do report-service
            List<ReportDTO> reports = fetchReportsFromService(pixKey);
            
            // Calcular o nível de risco
            long reportCount = reports.size();
            RiskLevel riskLevel = RiskLevel.fromReportCount(reportCount);
            
            // Gerar summary personalizado
            String summary = generateRiskSummary(riskLevel, reportCount, reports);
            
            logger.info("Análise concluída para chave PIX {}: {} denúncias encontradas, nível de risco: {}", 
                       maskPixKey(pixKey), reportCount, riskLevel);

            return new RiskAssessmentDTO(pixKey, riskLevel, reportCount, summary);

        } catch (WebClientResponseException e) {
            logger.error("Erro na comunicação com report-service para chave PIX {}: HTTP {} - {}", 
                        maskPixKey(pixKey), e.getStatusCode(), e.getMessage());
            throw new RuntimeException("Falha na comunicação com o serviço de denúncias", e);
        } catch (Exception e) {
            logger.error("Erro inesperado ao analisar risco da chave PIX {}: {}", 
                        maskPixKey(pixKey), e.getMessage(), e);
            throw new RuntimeException("Erro interno na análise de risco", e);
        }
    }

    /**
     * Busca denúncias do report-service via WebClient
     */
    private List<ReportDTO> fetchReportsFromService(String pixKey) {
        logger.debug("Buscando denúncias do report-service para chave PIX: {}", maskPixKey(pixKey));

        return reportServiceWebClient
                .get()
                .uri("/api/reports/key/{pixKey}", pixKey)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<ReportDTO>>() {})
                .timeout(REQUEST_TIMEOUT)
                .doOnSuccess(reports -> logger.debug("Recebidas {} denúncias do report-service", 
                                                   reports != null ? reports.size() : 0))
                .doOnError(error -> logger.error("Erro ao buscar denúncias: {}", error.getMessage()))
                .block(); // Bloqueia para operação síncrona - em produção considere uso reativo
    }

    /**
     * Gera um resumo personalizado baseado no nível de risco e denúncias
     */
    private String generateRiskSummary(RiskLevel riskLevel, long reportCount, List<ReportDTO> reports) {
        StringBuilder summary = new StringBuilder();
        
        if (reportCount == 0) {
            summary.append("Esta chave PIX não possui denúncias registradas em nossa base de dados. ");
            summary.append("Mesmo assim, mantenha sempre cautela em suas transações.");
        } else {
            summary.append("Esta chave PIX possui ").append(reportCount)
                   .append(reportCount == 1 ? " denúncia registrada" : " denúncias registradas")
                   .append(" em nossa base de dados. ");
            
            // Adicionar informações sobre as categorias mais comuns se houver denúncias
            if (!reports.isEmpty()) {
                String mostCommonCategory = findMostCommonCategory(reports);
                if (mostCommonCategory != null) {
                    summary.append("Categoria mais comum: ").append(mostCommonCategory).append(". ");
                }
            }
            
            summary.append(riskLevel.getMessage());
        }
        
        return summary.toString();
    }

    /**
     * Encontra a categoria de golpe mais comum nas denúncias
     */
    private String findMostCommonCategory(List<ReportDTO> reports) {
        return reports.stream()
                .map(ReportDTO::getScamCategory)
                .filter(category -> category != null && !category.trim().isEmpty())
                .collect(java.util.stream.Collectors.groupingBy(
                    java.util.function.Function.identity(),
                    java.util.stream.Collectors.counting()
                ))
                .entrySet()
                .stream()
                .max(java.util.Map.Entry.comparingByValue())
                .map(java.util.Map.Entry::getKey)
                .orElse(null);
    }

    /**
     * Mascara a chave PIX para logs (mostra apenas os primeiros e últimos caracteres)
     */
    private String maskPixKey(String pixKey) {
        if (pixKey == null || pixKey.length() <= 4) {
            return "****";
        }
        
        if (pixKey.length() <= 8) {
            return pixKey.substring(0, 2) + "****" + pixKey.substring(pixKey.length() - 2);
        }
        
        return pixKey.substring(0, 4) + "****" + pixKey.substring(pixKey.length() - 4);
    }
}