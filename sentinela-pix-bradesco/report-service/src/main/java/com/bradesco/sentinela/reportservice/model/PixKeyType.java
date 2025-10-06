package com.bradesco.sentinela.reportservice.model;

public enum PixKeyType {
    EMAIL("E-mail"),
    PHONE("Telefone"),
    CPF("CPF"),
    RANDOM("Chave Aleatória");

    private final String description;

    PixKeyType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}