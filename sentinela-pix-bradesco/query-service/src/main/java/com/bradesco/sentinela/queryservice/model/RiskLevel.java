package com.bradesco.sentinela.queryservice.model;

public enum RiskLevel {
    NO_RECORDS("Sem Registros", "Não há denúncias registradas para esta chave PIX."),
    LOW("Baixo Risco", "Esta chave possui poucas denúncias. Risco baixo, mas mantenha atenção."),
    HIGH("Alto Risco", "Esta chave possui múltiplas denúncias. Alto risco de fraude."),
    CRITICAL("Risco Crítico", "Esta chave possui muitas denúncias. Risco crítico - evite transações.");

    private final String description;
    private final String message;

    RiskLevel(String description, String message) {
        this.description = description;
        this.message = message;
    }

    public String getDescription() {
        return description;
    }

    public String getMessage() {
        return message;
    }

    /**
     * Calcula o nível de risco baseado no número de denúncias
     */
    public static RiskLevel fromReportCount(long reportCount) {
        if (reportCount == 0) {
            return NO_RECORDS;
        } else if (reportCount == 1) {
            return LOW;
        } else if (reportCount <= 4) {
            return HIGH;
        } else {
            return CRITICAL;
        }
    }
}