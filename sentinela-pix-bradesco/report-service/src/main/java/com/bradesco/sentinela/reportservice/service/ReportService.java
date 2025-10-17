package com.bradesco.sentinela.reportservice.service;

import com.bradesco.sentinela.reportservice.dto.ReportRequestDTO;
import com.bradesco.sentinela.reportservice.dto.ReportResponseDTO;
import com.bradesco.sentinela.reportservice.model.FraudReport;
import com.bradesco.sentinela.reportservice.repository.FraudReportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReportService {

    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);

    private final FraudReportRepository fraudReportRepository;

    public ReportService(FraudReportRepository fraudReportRepository) {
        this.fraudReportRepository = fraudReportRepository;
    }

    /**
     * Cria uma nova denúncia de fraude
     */
    public ReportResponseDTO createReport(ReportRequestDTO request) {
        logger.info("Criando nova denúncia para a chave PIX: {}", maskPixKey(request.getReportedPixKey()));
        
        FraudReport fraudReport = new FraudReport(
            request.getReportedPixKey(),
            request.getPixKeyType(),
            request.getScamCategory(),
            request.getDescription()
        );

        FraudReport savedReport = fraudReportRepository.save(fraudReport);
        
        logger.info("Denúncia criada com sucesso. ID: {}", savedReport.getId());
        
        return mapToResponseDTO(savedReport);
    }

    /**
     * Busca todas as denúncias para uma chave PIX específica
     */
    @Transactional(readOnly = true)
    public List<ReportResponseDTO> getReportsByPixKey(String pixKey) {
        logger.info("Buscando denúncias para a chave PIX: {}", maskPixKey(pixKey));
        
        List<FraudReport> reports = fraudReportRepository.findByReportedPixKeyOrderByTimestampDesc(pixKey);
        
        logger.info("Encontradas {} denúncias para a chave PIX: {}", reports.size(), maskPixKey(pixKey));
        
        return reports.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Conta o número de denúncias para uma chave PIX específica
     */
    @Transactional(readOnly = true)
    public long countReportsByPixKey(String pixKey) {
        logger.debug("Contando denúncias para a chave PIX: {}", maskPixKey(pixKey));
        
        long count = fraudReportRepository.countByReportedPixKey(pixKey);
        
        logger.debug("Total de denúncias para a chave PIX {}: {}", maskPixKey(pixKey), count);
        
        return count;
    }

    /**
     * Busca todas as denúncias (para uso interno entre microsserviços)
     */
    @Transactional(readOnly = true)
    public List<ReportResponseDTO> getAllReports() {
        logger.info("Buscando todas as denúncias");
        
        List<FraudReport> reports = fraudReportRepository.findAll();
        
        logger.info("Total de denúncias encontradas: {}", reports.size());
        
        return reports.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Converte FraudReport para ReportResponseDTO
     */
    private ReportResponseDTO mapToResponseDTO(FraudReport fraudReport) {
        return new ReportResponseDTO(
            fraudReport.getId(),
            fraudReport.getReportedPixKey(),
            fraudReport.getPixKeyType(),
            fraudReport.getScamCategory(),
            fraudReport.getDescription(),
            fraudReport.getTimestamp()
        );
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