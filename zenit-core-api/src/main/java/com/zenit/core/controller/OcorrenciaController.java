package com.zenit.core.controller;

import com.zenit.core.model.Ocorrencia;
import com.zenit.core.service.OcorrenciaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para endpoints de criação e consulta de ocorrências.
 * Demonstra conceito de API RESTful.
 */
@RestController
@RequestMapping("/ocorrencias")
@CrossOrigin(origins = "*")
public class OcorrenciaController {
    private final OcorrenciaService service;
    public OcorrenciaController(OcorrenciaService service) {
        this.service = service;
    }
    // Endpoint REST para criar uma nova ocorrência (POST /ocorrencias)
    @PostMapping
    public Ocorrencia criar(@RequestBody Ocorrencia ocorrencia) {
        return service.registrarOcorrencia(ocorrencia);
    }
    // Endpoint REST para consultar status (GET /ocorrencias/{id})
    @GetMapping("/{id}")
    public Ocorrencia consultar(@PathVariable Long id) {
        return service.consultarOcorrencia(id);
    }
    // Endpoint REST para listar todas as ocorrências (GET /ocorrencias)
    @GetMapping
    public List<Ocorrencia> listarTodas() {
        return service.listarTodas();
    }
}
