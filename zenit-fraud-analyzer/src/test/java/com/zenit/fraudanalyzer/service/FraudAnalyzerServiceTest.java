package com.zenit.fraudanalyzer.service;

import com.zenit.fraudanalyzer.model.Suspeito;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Exemplo de teste unitário para a camada de serviço do analisador de fraude.
 */
class FraudAnalyzerServiceTest {
    @Test
    void testAnalyzeSuspeito() {
        FraudAnalyzerService service = new FraudAnalyzerService();
        Suspeito suspeito = new Suspeito();
        suspeito.setValor(6000.0);
        assertEquals("SUSPEITO", service.analyze(suspeito));
        suspeito.setValor(100.0);
        assertEquals("LIMPO", service.analyze(suspeito));
    }
}
