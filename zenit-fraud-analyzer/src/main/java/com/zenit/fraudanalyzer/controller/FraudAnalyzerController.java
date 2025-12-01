package com.zenit.fraudanalyzer.controller;

import com.zenit.fraudanalyzer.model.Suspeito;
import com.zenit.fraudanalyzer.service.FraudAnalyzerService;
import org.springframework.web.bind.annotation.*;

/**
 * Controller REST para receber e analisar denúncias de fraude.
 */
@RestController
public class FraudAnalyzerController {
    private final FraudAnalyzerService service;
    public FraudAnalyzerController(FraudAnalyzerService service) {
        this.service = service;
    }
    // Endpoint REST para receber análise (POST /analyze)
    @PostMapping("/analyze")
    public String analyze(@RequestBody Suspeito suspeito) {
        // Retorna "SUSPEITO" se valor > 5000, senão "LIMPO"
        return service.analyze(suspeito);
    }
}
