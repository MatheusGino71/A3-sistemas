package com.zenit.fraudanalyzer.service;

import com.zenit.fraudanalyzer.model.Suspeito;
import org.springframework.stereotype.Service;

/**
 * Service com lógica simples de análise de fraude.
 */
@Service
public class FraudAnalyzerService {
    public String analyze(Suspeito suspeito) {
        // Lógica: valor acima de 5000 é suspeito
        if (suspeito.getValor() != null && suspeito.getValor() > 5000) {
            return "SUSPEITO";
        }
        return "LIMPO";
    }
}
