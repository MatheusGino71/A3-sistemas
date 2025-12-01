package com.zenit.core.service;

import com.zenit.core.model.Ocorrencia;
import com.zenit.core.repository.OcorrenciaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/**
 * Service com regra de negócio e comunicação distribuída (REST) com o analisador de fraude.
 */
@Service
public class OcorrenciaService {
    private final OcorrenciaRepository repository;
    private final RestTemplate restTemplate;
    private final String fraudAnalyzerUrl;

    // Construtor padrão para uso pelo Spring
    public OcorrenciaService(OcorrenciaRepository repository) {
        this(repository, new RestTemplate(), "http://zenit-fraud-analyzer:8081");
    }

    // Construtor para facilitar testes
    public OcorrenciaService(OcorrenciaRepository repository, RestTemplate restTemplate, String fraudAnalyzerUrl) {
        this.repository = repository;
        this.restTemplate = restTemplate;
        this.fraudAnalyzerUrl = fraudAnalyzerUrl;
    }

    public Ocorrencia registrarOcorrencia(Ocorrencia ocorrencia) {
        ocorrencia.setStatus("PENDENTE");
        ocorrencia.setDataOcorrencia(java.time.LocalDateTime.now());
        Ocorrencia saved = repository.save(ocorrencia);
        // Comunicação distribuída: envia para o microsserviço de análise
        String url = fraudAnalyzerUrl + "/analyze";
        String status = restTemplate.postForObject(url, saved, String.class);
        saved.setStatus(status);
        return repository.save(saved);
    }

    public Ocorrencia consultarOcorrencia(Long id) {
        return repository.findById(id).orElseThrow();
    }
    
    public List<Ocorrencia> listarTodas() {
        return repository.findAll();
    }
}
