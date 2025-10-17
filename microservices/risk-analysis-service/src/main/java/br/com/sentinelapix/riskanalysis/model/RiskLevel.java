package br.com.sentinelapix.riskanalysis.model;

/**
 * Enum que define os níveis de risco para chaves PIX
 */
public enum RiskLevel {
    
    /**
     * Baixo risco - Score 0-9
     */
    LOW("Baixo", 0, "Chave com baixo ou nenhum risco identificado"),
    
    /**
     * Suspeita - Score 10-29  
     */
    SUSPICIOUS("Suspeita", 10, "Chave com atividade suspeita, requer monitoramento"),
    
    /**
     * Médio risco - Score 30-59
     */
    MEDIUM("Médio", 30, "Chave com risco moderado, atenção necessária"),
    
    /**
     * Alto risco - Score 60-79
     */
    HIGH("Alto", 60, "Chave de alto risco, bloqueio recomendado"),
    
    /**
     * Crítico - Score 80+
     */
    CRITICAL("Crítico", 80, "Chave crítica, bloqueio imediato necessário");
    
    private final String description;
    private final int minScore;
    private final String recommendation;
    
    RiskLevel(String description, int minScore, String recommendation) {
        this.description = description;
        this.minScore = minScore;
        this.recommendation = recommendation;
    }
    
    public String getDescription() {
        return description;
    }
    
    public int getMinScore() {
        return minScore;
    }
    
    public String getRecommendation() {
        return recommendation;
    }
    
    /**
     * Determina o nível de risco baseado no score
     */
    public static RiskLevel fromScore(int score) {
        if (score >= 80) return CRITICAL;
        if (score >= 60) return HIGH;
        if (score >= 30) return MEDIUM;
        if (score >= 10) return SUSPICIOUS;
        return LOW;
    }
    
    /**
     * Verifica se o nível requer bloqueio
     */
    public boolean requiresBlocking() {
        return this == HIGH || this == CRITICAL;
    }
    
    /**
     * Verifica se o nível requer monitoramento especial
     */
    public boolean requiresMonitoring() {
        return this != LOW;
    }
    
    @Override
    public String toString() {
        return this.description;
    }
}