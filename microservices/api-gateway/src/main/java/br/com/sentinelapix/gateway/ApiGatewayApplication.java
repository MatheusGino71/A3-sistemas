package br.com.sentinelapix.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.time.Duration;
import java.util.Arrays;

/**
 * Sentinela PIX - API Gateway
 * 
 * Ponto de entrada único para todas as requisições dos bancos.
 * Responsável por:
 * - Roteamento inteligente para microsserviços
 * - Autenticação e autorização
 * - Rate limiting 
 * - Circuit breaker
 * - CORS e segurança
 * 
 * @author Sentinela PIX Team
 * @version 1.0.0
 */
@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    /**
     * Configuração de rotas do Gateway
     * Define como as requisições são roteadas para os microsserviços
     */
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            
            // Rota para Fraud Report Service
            .route("fraud-report-service", r -> r
                .path("/api/v1/reports/**")
                .filters(f -> f
                    .stripPrefix(0)
                    .circuitBreaker(config -> config
                        .setName("fraud-report-cb")
                        .setFallbackUri("forward:/fallback/fraud-report"))
                    .retry(config -> config
                        .setRetries(3)
                        .setBackoff(Duration.ofSeconds(1), Duration.ofSeconds(5), 2, false))
                )
                .uri("http://localhost:8081"))
            
            // Rota para Risk Analysis Service  
            .route("risk-analysis-service", r -> r
                .path("/api/v1/keys/**", "/api/v1/analysis/**")
                .filters(f -> f
                    .stripPrefix(0)
                    .circuitBreaker(config -> config
                        .setName("risk-analysis-cb")
                        .setFallbackUri("forward:/fallback/risk-analysis"))
                    .requestRateLimiter(config -> config
                        .setRateLimiter(redisRateLimiter())
                        .setKeyResolver(hostAddressKeyResolver()))
                )
                .uri("http://localhost:8082"))
                
            // Rota para Notification Service
            .route("notification-service", r -> r
                .path("/api/v1/notifications/**")
                .filters(f -> f
                    .stripPrefix(0)
                    .circuitBreaker(config -> config
                        .setName("notification-cb")
                        .setFallbackUri("forward:/fallback/notification"))
                )
                .uri("http://localhost:8083"))
                
            // Rota para Health Checks
            .route("health-check", r -> r
                .path("/health/**", "/actuator/**")
                .filters(f -> f.stripPrefix(0))
                .uri("http://localhost:8080"))
                
            .build();
    }

    /**
     * Configuração de CORS para permitir requisições de diferentes origens
     */
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOriginPatterns(Arrays.asList("*"));
        corsConfig.setMaxAge(3600L);
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(Arrays.asList("*"));
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }

    /**
     * Configuração do Rate Limiter usando Redis
     */
    @Bean
    public org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter redisRateLimiter() {
        return new org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter(10, 20, 1);
    }

    /**
     * Key resolver para Rate Limiting baseado no endereço do host
     */
    @Bean
    public org.springframework.cloud.gateway.filter.ratelimit.KeyResolver hostAddressKeyResolver() {
        return exchange -> reactor.core.publisher.Mono.just(
            exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
        );
    }
}