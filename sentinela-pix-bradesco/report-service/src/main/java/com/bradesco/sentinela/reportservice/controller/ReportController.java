package com.bradesco.sentinela.reportservice.controller;

import com.bradesco.sentinela.reportservice.dto.ReportRequestDTO;
import com.bradesco.sentinela.reportservice.dto.ReportResponseDTO;
import com.bradesco.sentinela.reportservice.service.ReportService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * Endpoint para criar uma nova denúncia
     */
    @PostMapping
    public ResponseEntity<ReportResponseDTO> createReport(@Valid @RequestBody ReportRequestDTO request) {
        logger.info("Recebida solicitação para criar nova denúncia");
        
        try {
            ReportResponseDTO response = reportService.createReport(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Erro ao criar denúncia: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Endpoint para buscar denúncias por chave PIX (usado pelo query-service)
     */
    @GetMapping("/key/{pixKey}")
    public ResponseEntity<List<ReportResponseDTO>> getReportsByPixKey(@PathVariable String pixKey) {
        logger.info("Recebida solicitação para buscar denúncias por chave PIX");
        
        try {
            List<ReportResponseDTO> reports = reportService.getReportsByPixKey(pixKey);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            logger.error("Erro ao buscar denúncias por chave PIX: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Endpoint para contar denúncias por chave PIX
     */
    @GetMapping("/key/{pixKey}/count")
    public ResponseEntity<Long> countReportsByPixKey(@PathVariable String pixKey) {
        logger.info("Recebida solicitação para contar denúncias por chave PIX");
        
        try {
            long count = reportService.countReportsByPixKey(pixKey);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            logger.error("Erro ao contar denúncias por chave PIX: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Endpoint para listar todas as denúncias (para administração)
     */
    @GetMapping
    public ResponseEntity<List<ReportResponseDTO>> getAllReports() {
        logger.info("Recebida solicitação para listar todas as denúncias");
        
        try {
            List<ReportResponseDTO> reports = reportService.getAllReports();
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            logger.error("Erro ao listar todas as denúncias: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Report Service is running");
    }
}