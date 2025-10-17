package br.com.sentinelapix.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Controller para fallback quando serviços estão indisponíveis
 * Implementa circuit breaker patterns
 */
@RestController
@RequestMapping("/fallback")
public class FallbackController {

    /**
     * Fallback para o serviço de denúncias (fraud-report-service)
     */
    @GetMapping("/fraud-report")
    public Mono<ResponseEntity<Map<String, Object>>> fraudReportFallback() {
        Map<String, Object> response = Map.of(
            "status", "SERVICE_UNAVAILABLE",
            "message", "Serviço de denúncias temporariamente indisponível. Tente novamente em alguns instantes.",
            "service", "fraud-report-service",
            "timestamp", LocalDateTime.now(),
            "fallback", true
        );
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    /**
     * Fallback para o serviço de análise de risco (risk-analysis-service)
     */
    @GetMapping("/risk-analysis")
    public Mono<ResponseEntity<Map<String, Object>>> riskAnalysisFallback() {
        Map<String, Object> response = Map.of(
            "status", "SERVICE_UNAVAILABLE", 
            "message", "Serviço de análise de risco temporariamente indisponível. Assumindo risco MEDIUM por segurança.",
            "service", "risk-analysis-service",
            "timestamp", LocalDateTime.now(),
            "fallback", true,
            "defaultRiskLevel", "MEDIUM"
        );
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    /**
     * Fallback para o serviço de notificações (notification-service)
     */
    @GetMapping("/notification")
    public Mono<ResponseEntity<Map<String, Object>>> notificationFallback() {
        Map<String, Object> response = Map.of(
            "status", "SERVICE_UNAVAILABLE",
            "message", "Serviço de notificações temporariamente indisponível. As notificações serão processadas assim que o serviço for restaurado.",
            "service", "notification-service", 
            "timestamp", LocalDateTime.now(),
            "fallback", true
        );
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    /**
     * Health check geral do Gateway
     */
    @GetMapping("/health")
    public Mono<ResponseEntity<Map<String, Object>>> health() {
        Map<String, Object> response = Map.of(
            "status", "UP",
            "service", "api-gateway",
            "timestamp", LocalDateTime.now(),
            "version", "1.0.0"
        );
        
        return Mono.just(ResponseEntity.ok(response));
    }
}