package br.com.sentinelapix.fraudreport.controller;

import br.com.sentinelapix.fraudreport.dto.FraudReportRequestDTO;
import br.com.sentinelapix.fraudreport.dto.FraudReportResponseDTO;
import br.com.sentinelapix.fraudreport.service.FraudReportService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller REST para gerenciamento de denúncias de fraude PIX
 * 
 * Endpoints principais para que instituições financeiras registrem
 * e consultem denúncias de golpes PIX
 */
@RestController
@RequestMapping("/api/v1/reports")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FraudReportController {

    @Autowired
    private FraudReportService fraudReportService;

    /**
     * Registrar nova denúncia de fraude PIX
     * 
     * Endpoint principal usado pelas instituições financeiras para
     * reportar transações PIX fraudulentas
     */
    @PostMapping
    public ResponseEntity<FraudReportResponseDTO> createFraudReport(
            @Valid @RequestBody FraudReportRequestDTO request,
            HttpServletRequest httpRequest) {
        
        // Capturar informações da requisição para auditoria
        String sourceIp = getClientIpAddress(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        
        FraudReportResponseDTO response = fraudReportService.createFraudReport(request, sourceIp, userAgent);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Consultar denúncia específica por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<FraudReportResponseDTO> getFraudReport(@PathVariable Long id) {
        FraudReportResponseDTO report = fraudReportService.getFraudReportById(id);
        return ResponseEntity.ok(report);
    }

    /**
     * Listar denúncias com paginação e filtros
     */
    @GetMapping
    public ResponseEntity<Page<FraudReportResponseDTO>> listFraudReports(
            @RequestParam(required = false) String pixKey,
            @RequestParam(required = false) String victimBank,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            Pageable pageable) {
        
        Page<FraudReportResponseDTO> reports = fraudReportService.listFraudReports(
            pixKey, victimBank, status, priority, pageable);
        
        return ResponseEntity.ok(reports);
    }

    /**
     * Atualizar status de uma denúncia
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<FraudReportResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        
        String newStatus = statusUpdate.get("status");
        String observations = statusUpdate.get("observations");
        
        FraudReportResponseDTO updatedReport = fraudReportService.updateReportStatus(id, newStatus, observations);
        
        return ResponseEntity.ok(updatedReport);
    }

    /**
     * Obter estatísticas de denúncias por chave PIX
     */
    @GetMapping("/statistics/pix-key/{pixKey}")
    public ResponseEntity<Map<String, Object>> getPixKeyStatistics(@PathVariable String pixKey) {
        Map<String, Object> statistics = fraudReportService.getPixKeyStatistics(pixKey);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Health check do serviço
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = Map.of(
            "status", "UP",
            "service", "fraud-report-service",
            "timestamp", java.time.LocalDateTime.now(),
            "version", "1.0.0"
        );
        return ResponseEntity.ok(health);
    }

    /**
     * Buscar denúncias por transação ID
     */
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<FraudReportResponseDTO> getFraudReportByTransactionId(
            @PathVariable String transactionId) {
        
        FraudReportResponseDTO report = fraudReportService.getFraudReportByTransactionId(transactionId);
        return ResponseEntity.ok(report);
    }

    /**
     * Consultar denúncias por chave PIX
     */
    @GetMapping("/pix-key/{pixKey}")
    public ResponseEntity<Page<FraudReportResponseDTO>> getFraudReportsByPixKey(
            @PathVariable String pixKey,
            Pageable pageable) {
        
        Page<FraudReportResponseDTO> reports = fraudReportService.getFraudReportsByPixKey(pixKey, pageable);
        return ResponseEntity.ok(reports);
    }

    /**
     * Extrair IP real do cliente considerando proxies
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}