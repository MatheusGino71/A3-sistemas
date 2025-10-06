package com.bradesco.sentinela.reportservice.service;

import com.bradesco.sentinela.reportservice.dto.ReportRequestDTO;
import com.bradesco.sentinela.reportservice.dto.ReportResponseDTO;
import com.bradesco.sentinela.reportservice.model.FraudReport;
import com.bradesco.sentinela.reportservice.model.PixKeyType;
import com.bradesco.sentinela.reportservice.repository.FraudReportRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ReportService Tests")
class ReportServiceTest {

    @Mock
    private FraudReportRepository fraudReportRepository;

    @InjectMocks
    private ReportService reportService;

    private ReportRequestDTO reportRequestDTO;
    private FraudReport fraudReport;

    @BeforeEach
    void setUp() {
        reportRequestDTO = new ReportRequestDTO(
            "test@email.com",
            PixKeyType.EMAIL,
            "Falso Perfil no WhatsApp",
            "Recebi mensagem de golpista se passando por familiar"
        );

        fraudReport = new FraudReport(
            "test@email.com",
            PixKeyType.EMAIL,
            "Falso Perfil no WhatsApp",
            "Recebi mensagem de golpista se passando por familiar"
        );
        fraudReport.setId(1L);
        fraudReport.setTimestamp(LocalDateTime.now());
    }

    @Test
    @DisplayName("Deve criar uma denúncia com sucesso")
    void shouldCreateReportSuccessfully() {
        // Given
        when(fraudReportRepository.save(any(FraudReport.class))).thenReturn(fraudReport);

        // When
        ReportResponseDTO result = reportService.createReport(reportRequestDTO);

        // Then
        assertNotNull(result);
        assertEquals(fraudReport.getId(), result.getId());
        assertEquals(fraudReport.getReportedPixKey(), result.getReportedPixKey());
        assertEquals(fraudReport.getPixKeyType(), result.getPixKeyType());
        assertEquals(fraudReport.getScamCategory(), result.getScamCategory());
        assertEquals(fraudReport.getDescription(), result.getDescription());
        assertEquals(fraudReport.getTimestamp(), result.getTimestamp());

        verify(fraudReportRepository, times(1)).save(any(FraudReport.class));
    }

    @Test
    @DisplayName("Deve buscar denúncias por chave PIX")
    void shouldGetReportsByPixKey() {
        // Given
        String pixKey = "test@email.com";
        List<FraudReport> fraudReports = Arrays.asList(fraudReport);
        
        when(fraudReportRepository.findByReportedPixKeyOrderByTimestampDesc(eq(pixKey)))
            .thenReturn(fraudReports);

        // When
        List<ReportResponseDTO> result = reportService.getReportsByPixKey(pixKey);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(fraudReport.getId(), result.get(0).getId());
        assertEquals(fraudReport.getReportedPixKey(), result.get(0).getReportedPixKey());

        verify(fraudReportRepository, times(1)).findByReportedPixKeyOrderByTimestampDesc(eq(pixKey));
    }

    @Test
    @DisplayName("Deve contar denúncias por chave PIX")
    void shouldCountReportsByPixKey() {
        // Given
        String pixKey = "test@email.com";
        long expectedCount = 3L;
        
        when(fraudReportRepository.countByReportedPixKey(eq(pixKey))).thenReturn(expectedCount);

        // When
        long result = reportService.countReportsByPixKey(pixKey);

        // Then
        assertEquals(expectedCount, result);
        verify(fraudReportRepository, times(1)).countByReportedPixKey(eq(pixKey));
    }

    @Test
    @DisplayName("Deve retornar lista vazia quando não há denúncias para uma chave PIX")
    void shouldReturnEmptyListWhenNoReportsFound() {
        // Given
        String pixKey = "nonexistent@email.com";
        
        when(fraudReportRepository.findByReportedPixKeyOrderByTimestampDesc(eq(pixKey)))
            .thenReturn(Arrays.asList());

        // When
        List<ReportResponseDTO> result = reportService.getReportsByPixKey(pixKey);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(fraudReportRepository, times(1)).findByReportedPixKeyOrderByTimestampDesc(eq(pixKey));
    }

    @Test
    @DisplayName("Deve retornar zero quando não há denúncias para contar")
    void shouldReturnZeroWhenNoReportsToCount() {
        // Given
        String pixKey = "nonexistent@email.com";
        
        when(fraudReportRepository.countByReportedPixKey(eq(pixKey))).thenReturn(0L);

        // When
        long result = reportService.countReportsByPixKey(pixKey);

        // Then
        assertEquals(0L, result);
        verify(fraudReportRepository, times(1)).countByReportedPixKey(eq(pixKey));
    }

    @Test
    @DisplayName("Deve buscar todas as denúncias")
    void shouldGetAllReports() {
        // Given
        FraudReport secondReport = new FraudReport(
            "another@email.com",
            PixKeyType.EMAIL,
            "Loja Online Falsa",
            "Comprei produto que nunca chegou"
        );
        secondReport.setId(2L);
        secondReport.setTimestamp(LocalDateTime.now());

        List<FraudReport> allReports = Arrays.asList(fraudReport, secondReport);
        
        when(fraudReportRepository.findAll()).thenReturn(allReports);

        // When
        List<ReportResponseDTO> result = reportService.getAllReports();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(fraudReport.getId(), result.get(0).getId());
        assertEquals(secondReport.getId(), result.get(1).getId());

        verify(fraudReportRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Deve criar denúncia com diferentes tipos de chave PIX")
    void shouldCreateReportWithDifferentPixKeyTypes() {
        // Given - Chave CPF
        ReportRequestDTO cpfRequest = new ReportRequestDTO(
            "12345678901",
            PixKeyType.CPF,
            "Transferência Falsa",
            "Golpista pediu transferência fingindo ser parente"
        );

        FraudReport cpfReport = new FraudReport(
            "12345678901",
            PixKeyType.CPF,
            "Transferência Falsa",
            "Golpista pediu transferência fingindo ser parente"
        );
        cpfReport.setId(2L);
        cpfReport.setTimestamp(LocalDateTime.now());

        when(fraudReportRepository.save(any(FraudReport.class))).thenReturn(cpfReport);

        // When
        ReportResponseDTO result = reportService.createReport(cpfRequest);

        // Then
        assertNotNull(result);
        assertEquals(PixKeyType.CPF, result.getPixKeyType());
        assertEquals("12345678901", result.getReportedPixKey());
        
        verify(fraudReportRepository, times(1)).save(any(FraudReport.class));
    }
}