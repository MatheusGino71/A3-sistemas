package com.bradesco.sentinela.queryservice.service;

import com.bradesco.sentinela.queryservice.dto.ReportDTO;
import com.bradesco.sentinela.queryservice.dto.RiskAssessmentDTO;
import com.bradesco.sentinela.queryservice.model.RiskLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("QueryService Tests")
class QueryServiceTest {

    @Mock
    private WebClient reportServiceWebClient;

    @Mock
    private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    @Mock
    private Mono<List<ReportDTO>> monoResponse;

    @InjectMocks
    private QueryService queryService;

    @BeforeEach
    void setUp() {
        // Setup the WebClient mock chain
        when(reportServiceWebClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(anyString(), any(Object.class))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(any(ParameterizedTypeReference.class))).thenReturn(monoResponse);
        when(monoResponse.timeout(any(Duration.class))).thenReturn(monoResponse);
        when(monoResponse.doOnSuccess(any())).thenReturn(monoResponse);
        when(monoResponse.doOnError(any())).thenReturn(monoResponse);
    }

    @Test
    @DisplayName("Deve retornar NO_RECORDS quando não há denúncias")
    void shouldReturnNoRecordsWhenNoReports() {
        // Given
        String pixKey = "test@email.com";
        List<ReportDTO> emptyReports = Collections.emptyList();
        
        when(monoResponse.block()).thenReturn(emptyReports);

        // When
        RiskAssessmentDTO result = queryService.assessPixKeyRisk(pixKey);

        // Then
        assertNotNull(result);
        assertEquals(pixKey, result.getPixKey());
        assertEquals(RiskLevel.NO_RECORDS, result.getRiskLevel());
        assertEquals(0L, result.getReportCount());
        assertTrue(result.getSummary().contains("não possui denúncias registradas"));
        assertNotNull(result.getAssessmentTime());
    }

    @Test
    @DisplayName("Deve retornar LOW quando há 1 denúncia")
    void shouldReturnLowRiskWithOneReport() {
        // Given
        String pixKey = "test@email.com";
        ReportDTO report = new ReportDTO(1L, pixKey, "EMAIL", "Golpe WhatsApp", 
                                       "Descrição do golpe", LocalDateTime.now());
        List<ReportDTO> reports = Arrays.asList(report);
        
        when(monoResponse.block()).thenReturn(reports);

        // When
        RiskAssessmentDTO result = queryService.assessPixKeyRisk(pixKey);

        // Then
        assertNotNull(result);
        assertEquals(pixKey, result.getPixKey());
        assertEquals(RiskLevel.LOW, result.getRiskLevel());
        assertEquals(1L, result.getReportCount());
        assertTrue(result.getSummary().contains("1 denúncia registrada"));
        assertTrue(result.getSummary().contains("Golpe WhatsApp"));
    }

    @Test
    @DisplayName("Deve retornar HIGH quando há 2-4 denúncias")
    void shouldReturnHighRiskWithMultipleReports() {
        // Given
        String pixKey = "test@email.com";
        List<ReportDTO> reports = Arrays.asList(
            new ReportDTO(1L, pixKey, "EMAIL", "Golpe WhatsApp", "Desc1", LocalDateTime.now()),
            new ReportDTO(2L, pixKey, "EMAIL", "Golpe WhatsApp", "Desc2", LocalDateTime.now()),
            new ReportDTO(3L, pixKey, "EMAIL", "Loja Falsa", "Desc3", LocalDateTime.now())
        );
        
        when(monoResponse.block()).thenReturn(reports);

        // When
        RiskAssessmentDTO result = queryService.assessPixKeyRisk(pixKey);

        // Then
        assertNotNull(result);
        assertEquals(pixKey, result.getPixKey());
        assertEquals(RiskLevel.HIGH, result.getRiskLevel());
        assertEquals(3L, result.getReportCount());
        assertTrue(result.getSummary().contains("3 denúncias registradas"));
        assertTrue(result.getSummary().contains("Golpe WhatsApp")); // Categoria mais comum
    }

    @Test
    @DisplayName("Deve retornar CRITICAL quando há 5+ denúncias")
    void shouldReturnCriticalRiskWithManyReports() {
        // Given
        String pixKey = "test@email.com";
        List<ReportDTO> reports = Arrays.asList(
            new ReportDTO(1L, pixKey, "EMAIL", "Golpe WhatsApp", "Desc1", LocalDateTime.now()),
            new ReportDTO(2L, pixKey, "EMAIL", "Golpe WhatsApp", "Desc2", LocalDateTime.now()),
            new ReportDTO(3L, pixKey, "EMAIL", "Loja Falsa", "Desc3", LocalDateTime.now()),
            new ReportDTO(4L, pixKey, "EMAIL", "Golpe WhatsApp", "Desc4", LocalDateTime.now()),
            new ReportDTO(5L, pixKey, "EMAIL", "Golpe PIX", "Desc5", LocalDateTime.now())
        );
        
        when(monoResponse.block()).thenReturn(reports);

        // When
        RiskAssessmentDTO result = queryService.assessPixKeyRisk(pixKey);

        // Then
        assertNotNull(result);
        assertEquals(pixKey, result.getPixKey());
        assertEquals(RiskLevel.CRITICAL, result.getRiskLevel());
        assertEquals(5L, result.getReportCount());
        assertTrue(result.getSummary().contains("5 denúncias registradas"));
        assertTrue(result.getSummary().contains("Risco crítico"));
    }

    @Test
    @DisplayName("Deve lançar exceção quando o WebClient falha")
    void shouldThrowExceptionWhenWebClientFails() {
        // Given
        String pixKey = "test@email.com";
        
        when(monoResponse.block()).thenThrow(new RuntimeException("Connection failed"));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> queryService.assessPixKeyRisk(pixKey));
        
        assertEquals("Erro interno na análise de risco", exception.getMessage());
    }

    @Test
    @DisplayName("Deve identificar categoria mais comum corretamente")
    void shouldIdentifyMostCommonCategoryCorrectly() {
        // Given
        String pixKey = "test@email.com";
        List<ReportDTO> reports = Arrays.asList(
            new ReportDTO(1L, pixKey, "EMAIL", "Golpe WhatsApp", "Desc1", LocalDateTime.now()),
            new ReportDTO(2L, pixKey, "EMAIL", "Loja Falsa", "Desc2", LocalDateTime.now()),
            new ReportDTO(3L, pixKey, "EMAIL", "Golpe WhatsApp", "Desc3", LocalDateTime.now()),
            new ReportDTO(4L, pixKey, "EMAIL", "Golpe WhatsApp", "Desc4", LocalDateTime.now())
        );
        
        when(monoResponse.block()).thenReturn(reports);

        // When
        RiskAssessmentDTO result = queryService.assessPixKeyRisk(pixKey);

        // Then
        assertNotNull(result);
        assertTrue(result.getSummary().contains("Golpe WhatsApp")); // Deve ser a categoria mais comum (3 ocorrências)
    }

    @Test
    @DisplayName("Deve funcionar com diferentes tipos de chave PIX")
    void shouldWorkWithDifferentPixKeyTypes() {
        // Given - Chave CPF
        String cpfPixKey = "12345678901";
        ReportDTO report = new ReportDTO(1L, cpfPixKey, "CPF", "Transferência Falsa", 
                                       "Descrição", LocalDateTime.now());
        List<ReportDTO> reports = Arrays.asList(report);
        
        when(monoResponse.block()).thenReturn(reports);

        // When
        RiskAssessmentDTO result = queryService.assessPixKeyRisk(cpfPixKey);

        // Then
        assertNotNull(result);
        assertEquals(cpfPixKey, result.getPixKey());
        assertEquals(RiskLevel.LOW, result.getRiskLevel());
        assertEquals(1L, result.getReportCount());
    }
}