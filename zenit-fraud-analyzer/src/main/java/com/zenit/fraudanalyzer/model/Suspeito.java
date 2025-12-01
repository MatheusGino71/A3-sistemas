package com.zenit.fraudanalyzer.model;

/**
 * Entidade Suspeito representa os dados recebidos para análise de fraude.
 */
public class Suspeito {
    private String chavePixGolpista;
    private Double valor;

    // Getters e Setters
    public String getChavePixGolpista() { return chavePixGolpista; }
    public void setChavePixGolpista(String chavePixGolpista) { this.chavePixGolpista = chavePixGolpista; }
    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }
}
