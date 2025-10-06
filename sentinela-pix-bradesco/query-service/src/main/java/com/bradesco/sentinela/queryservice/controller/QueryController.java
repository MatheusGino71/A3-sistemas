package com.bradesco.sentinela.queryservice.controller;

import com.bradesco.sentinela.queryservice.dto.PixKeyQueryDTO;
import com.bradesco.sentinela.queryservice.dto.RiskAssessmentDTO;
import com.bradesco.sentinela.queryservice.service.QueryService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/queries")
@CrossOrigin(origins = "*")
public class QueryController {

    private static final Logger logger = LoggerFactory.getLogger(QueryController.class);

    private final QueryService queryService;

    public QueryController(QueryService queryService) {
        this.queryService = queryService;
    }

    /**
     * Endpoint principal para verificar o risco de uma chave PIX
     */
    @PostMapping("/check-key")
    public ResponseEntity<RiskAssessmentDTO> checkPixKeyRisk(@Valid @RequestBody PixKeyQueryDTO request) {
        logger.info("Recebida solicitação de verificação de risco para chave PIX");
        
        try {
            RiskAssessmentDTO assessment = queryService.assessPixKeyRisk(request.getPixKey());
            return ResponseEntity.ok(assessment);
        } catch (RuntimeException e) {
            logger.error("Erro ao processar verificação de risco: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Erro inesperado ao processar verificação de risco: {}", e.getMessage(), e);
            throw new RuntimeException("Erro interno do servidor", e);
        }
    }

    /**
     * Endpoint alternativo via GET para verificação rápida
     */
    @GetMapping("/check-key/{pixKey}")
    public ResponseEntity<RiskAssessmentDTO> checkPixKeyRiskGet(@PathVariable String pixKey) {
        logger.info("Recebida solicitação GET de verificação de risco para chave PIX");
        
        try {
            RiskAssessmentDTO assessment = queryService.assessPixKeyRisk(pixKey);
            return ResponseEntity.ok(assessment);
        } catch (RuntimeException e) {
            logger.error("Erro ao processar verificação de risco via GET: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Erro inesperado ao processar verificação de risco via GET: {}", e.getMessage(), e);
            throw new RuntimeException("Erro interno do servidor", e);
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Query Service is running");
    }
}