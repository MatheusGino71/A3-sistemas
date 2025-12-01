package com.zenit.core.repository;

import com.zenit.core.model.Ocorrencia;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository para acesso a dados da entidade Ocorrencia.
 */
public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {}
