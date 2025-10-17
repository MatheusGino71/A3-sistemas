package br.com.sentinelapix.fraudreport.model;

/**
 * Enumeration para os possíveis status de uma denúncia de fraude
 * 
 * Define o ciclo de vida de uma denúncia desde o recebimento até a resolução
 */
public enum FraudStatus {
    
    /**
     * Denúncia recebida e aguardando análise inicial
     */
    PENDING("Pendente", "Denúncia registrada e aguardando análise inicial"),
    
    /**
     * Denúncia está sendo analisada pela equipe de segurança
     */
    IN_ANALYSIS("Em Análise", "Denúncia está sendo investigada pelos analistas"),
    
    /**
     * Denúncia confirmada como fraude legítima
     */
    CONFIRMED("Confirmada", "Fraude confirmada após análise detalhada"),
    
    /**
     * Denúncia identificada como falso positivo
     */
    FALSE_POSITIVE("Falso Positivo", "Transação legítima identificada incorretamente como fraude"),
    
    /**
     * Denúncia rejeitada por falta de evidências ou dados inconsistentes
     */
    REJECTED("Rejeitada", "Denúncia rejeitada por falta de evidências suficientes"),
    
    /**
     * Caso encerrado com ações tomadas
     */
    CLOSED("Encerrada", "Denúncia processada e caso encerrado"),
    
    /**
     * Denúncia duplicada (já existe outra denúncia para a mesma transação)
     */
    DUPLICATE("Duplicada", "Denúncia duplicada identificada no sistema");

    private final String displayName;
    private final String description;

    FraudStatus(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Verifica se o status permite alterações na denúncia
     */
    public boolean isEditable() {
        return this == PENDING || this == IN_ANALYSIS;
    }

    /**
     * Verifica se o status indica que a denúncia está finalizada
     */
    public boolean isFinal() {
        return this == CLOSED || this == REJECTED || this == DUPLICATE || this == FALSE_POSITIVE;
    }

    /**
     * Verifica se o status indica fraude confirmada
     */
    public boolean isConfirmedFraud() {
        return this == CONFIRMED;
    }
}