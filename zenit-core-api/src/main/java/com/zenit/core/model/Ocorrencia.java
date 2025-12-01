package com.zenit.core.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entidade Ocorrencia representa o registro de uma transacao PIX suspeita ou fraudulenta.
 * Sistema profissional de deteccao e prevencao de fraudes.
 */
@Entity
@Table(name = "ocorrencias")
public class Ocorrencia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "chave_pix_golpista", length = 255)
    private String chavePixGolpista;
    
    @Column(name = "tipo_chave", length = 50)
    private String tipoChave; // CPF, CNPJ, EMAIL, TELEFONE, ALEATORIA
    
    @Column(name = "valor", precision = 10, scale = 2)
    private Double valor;
    
    @Column(name = "status", length = 50, nullable = false)
    private String status; // PENDENTE, SUSPEITO, CONFIRMADO, LIMPO, RESOLVIDO
    
    @Column(name = "score_risco")
    private Integer scoreRisco; // 0-100, quanto menor mais suspeito
    
    @Column(name = "data_ocorrencia", nullable = false)
    private LocalDateTime dataOcorrencia;
    
    @Column(name = "descricao", length = 1000)
    private String descricao;
    
    @Column(name = "origem", length = 100)
    private String origem; // WEB, MOBILE, API, DENUNCIA
    
    @Column(name = "ip_origem", length = 45)
    private String ipOrigem;
    
    @Column(name = "protocolo", length = 100)
    private String protocolo;
    
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;
    
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
        if (dataOcorrencia == null) {
            dataOcorrencia = LocalDateTime.now();
        }
        if (status == null) {
            status = "PENDENTE";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getChavePixGolpista() { return chavePixGolpista; }
    public void setChavePixGolpista(String chavePixGolpista) { this.chavePixGolpista = chavePixGolpista; }
    
    public String getTipoChave() { return tipoChave; }
    public void setTipoChave(String tipoChave) { this.tipoChave = tipoChave; }
    
    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Integer getScoreRisco() { return scoreRisco; }
    public void setScoreRisco(Integer scoreRisco) { this.scoreRisco = scoreRisco; }
    
    public LocalDateTime getDataOcorrencia() { return dataOcorrencia; }
    public void setDataOcorrencia(LocalDateTime dataOcorrencia) { this.dataOcorrencia = dataOcorrencia; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public String getOrigem() { return origem; }
    public void setOrigem(String origem) { this.origem = origem; }
    
    public String getIpOrigem() { return ipOrigem; }
    public void setIpOrigem(String ipOrigem) { this.ipOrigem = ipOrigem; }
    
    public String getProtocolo() { return protocolo; }
    public void setProtocolo(String protocolo) { this.protocolo = protocolo; }
    
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
    
    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
}
