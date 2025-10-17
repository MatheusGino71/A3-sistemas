package com.bradesco.sentinela.queryservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Configuration
public class WebClientConfig {

    @Value("${report.service.url:http://localhost:8081}")
    private String reportServiceUrl;

    @Bean
    public WebClient reportServiceWebClient() {
        return WebClient.builder()
                .baseUrl(reportServiceUrl)
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(2 * 1024 * 1024)) // 2MB
                .build();
    }
}