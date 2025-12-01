package com.zenit.core.service;

import com.zenit.core.model.Ocorrencia;
import com.zenit.core.repository.OcorrenciaRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.client.RestTemplate;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Exemplo de teste unitário para a camada de serviço usando JUnit e Mockito.
 */
class OcorrenciaServiceTest {
    @Test
    void testRegistrarOcorrencia() {
        OcorrenciaRepository repo = Mockito.mock(OcorrenciaRepository.class);
        RestTemplate restTemplate = Mockito.mock(RestTemplate.class);
        String url = "http://localhost:8081";
        OcorrenciaService service = new OcorrenciaService(repo, restTemplate, url);

        Ocorrencia ocorrencia = new Ocorrencia();
        ocorrencia.setChavePixGolpista("chave-teste");
        ocorrencia.setValor(6000.0);

        Mockito.when(repo.save(Mockito.any())).thenReturn(ocorrencia);
        Mockito.when(restTemplate.postForObject(Mockito.anyString(), Mockito.any(), Mockito.eq(String.class))).thenReturn("SUSPEITO");

        Ocorrencia result = service.registrarOcorrencia(ocorrencia);
        assertEquals("SUSPEITO", result.getStatus());
        assertNotNull(result.getDataOcorrencia());
    }
}
