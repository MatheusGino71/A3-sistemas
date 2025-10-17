package br.com.sentinelapix.fraudreport.model;

/**
 * Enumeration para definir a prioridade de análise de uma denúncia de fraude
 * 
 * A prioridade é determinada com base em fatores como:
 * - Valor da transação
 * - Histórico de denúncias da chave PIX
 * - Padrões suspeitos identificados
 */
public enum FraudPriority {
    
    /**
     * Prioridade baixa
     * - Valores pequenos (até R$ 500)
     * - Primeira denúncia da chave PIX
     * - Sem padrões suspeitos identificados
     */
    LOW("Baixa", "Análise com prioridade baixa - até 72 horas"),
    
    /**
     * Prioridade média (padrão)
     * - Valores medianos (R$ 500 - R$ 5.000)
     * - Chave PIX com 1-2 denúncias anteriores
     * - Padrões moderadamente suspeitos
     */
    MEDIUM("Média", "Análise com prioridade média - até 24 horas"),
    
    /**
     * Prioridade alta
     * - Valores altos (R$ 5.000 - R$ 20.000)
     * - Chave PIX com 3+ denúncias anteriores
     * - Padrões claramente suspeitos
     */
    HIGH("Alta", "Análise com prioridade alta - até 4 horas"),
    
    /**
     * Prioridade crítica
     * - Valores muito altos (acima de R$ 20.000)
     * - Chave PIX com muitas denúncias (5+)
     * - Padrões de fraude organizizada ou ataques coordenados
     */
    CRITICAL("Crítica", "Análise urgente - até 1 hora");

    private final String displayName;
    private final String description;

    FraudPriority(String displayName, String description) {
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
     * Determina a prioridade baseada no valor da transação
     * 
     * @param amount Valor da transação em reais
     * @return Prioridade calculada
     */
    public static FraudPriority calculateByAmount(java.math.BigDecimal amount) {
        if (amount == null) return MEDIUM;
        
        double value = amount.doubleValue();
        
        if (value >= 20000) {
            return CRITICAL;
        } else if (value >= 5000) {
            return HIGH;
        } else if (value >= 500) {
            return MEDIUM;
        } else {
            return LOW;
        }
    }

    /**
     * Eleva a prioridade baseada no número de denúncias anteriores da chave PIX
     * 
     * @param currentPriority Prioridade atual
     * @param previousReportsCount Número de denúncias anteriores
     * @return Prioridade ajustada
     */
    public static FraudPriority adjustByReportHistory(FraudPriority currentPriority, int previousReportsCount) {
        if (previousReportsCount >= 5) {
            return CRITICAL;
        } else if (previousReportsCount >= 3) {
            return currentPriority.ordinal() < HIGH.ordinal() ? HIGH : currentPriority;
        } else if (previousReportsCount >= 2) {
            return currentPriority.ordinal() < MEDIUM.ordinal() ? MEDIUM : currentPriority;
        }
        
        return currentPriority;
    }

    /**
     * Retorna o tempo máximo de SLA para análise desta prioridade (em horas)
     */
    public int getSlaHours() {
        return switch (this) {
            case LOW -> 72;
            case MEDIUM -> 24;
            case HIGH -> 4;
            case CRITICAL -> 1;
        };
    }
}