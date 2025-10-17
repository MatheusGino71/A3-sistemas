package br.com.sentinelapix.riskanalysis.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

/**
 * DTO para resposta de análise de risco
 */
public class RiskAnalysisDTO {
    
    @JsonProperty("pix_key")
    private String pixKey;
    
    @JsonProperty("current_score")
    private Integer currentScore;
    
    @JsonProperty("risk_level")
    private String riskLevel;
    
    @JsonProperty("risk_description")
    private String riskDescription;
    
    @JsonProperty("recommendation")
    private String recommendation;
    
    @JsonProperty("total_reports")
    private Integer totalReports;
    
    @JsonProperty("reports_24h")
    private Integer reports24h;
    
    @JsonProperty("reports_7d")
    private Integer reports7d;
    
    @JsonProperty("reports_30d")
    private Integer reports30d;
    
    @JsonProperty("is_blocked")
    private Boolean isBlocked;
    
    @JsonProperty("blocked_reason")
    private String blockedReason;
    
    @JsonProperty("requires_blocking")
    private Boolean requiresBlocking;
    
    @JsonProperty("requires_monitoring")
    private Boolean requiresMonitoring;
    
    @JsonProperty("last_analysis")
    private LocalDateTime lastAnalysis;
    
    // Constructors
    public RiskAnalysisDTO() {}
    
    // Getters and Setters
    public String getPixKey() {
        return pixKey;
    }
    
    public void setPixKey(String pixKey) {
        this.pixKey = pixKey;
    }
    
    public Integer getCurrentScore() {
        return currentScore;
    }
    
    public void setCurrentScore(Integer currentScore) {
        this.currentScore = currentScore;
    }
    
    public String getRiskLevel() {
        return riskLevel;
    }
    
    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
    
    public String getRiskDescription() {
        return riskDescription;
    }
    
    public void setRiskDescription(String riskDescription) {
        this.riskDescription = riskDescription;
    }
    
    public String getRecommendation() {
        return recommendation;
    }
    
    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
    
    public Integer getTotalReports() {
        return totalReports;
    }
    
    public void setTotalReports(Integer totalReports) {
        this.totalReports = totalReports;
    }
    
    public Integer getReports24h() {
        return reports24h;
    }
    
    public void setReports24h(Integer reports24h) {
        this.reports24h = reports24h;
    }
    
    public Integer getReports7d() {
        return reports7d;
    }
    
    public void setReports7d(Integer reports7d) {
        this.reports7d = reports7d;
    }
    
    public Integer getReports30d() {
        return reports30d;
    }
    
    public void setReports30d(Integer reports30d) {
        this.reports30d = reports30d;
    }
    
    public Boolean getIsBlocked() {
        return isBlocked;
    }
    
    public void setIsBlocked(Boolean isBlocked) {
        this.isBlocked = isBlocked;
    }
    
    public String getBlockedReason() {
        return blockedReason;
    }
    
    public void setBlockedReason(String blockedReason) {
        this.blockedReason = blockedReason;
    }
    
    public Boolean getRequiresBlocking() {
        return requiresBlocking;
    }
    
    public void setRequiresBlocking(Boolean requiresBlocking) {
        this.requiresBlocking = requiresBlocking;
    }
    
    public Boolean getRequiresMonitoring() {
        return requiresMonitoring;
    }
    
    public void setRequiresMonitoring(Boolean requiresMonitoring) {
        this.requiresMonitoring = requiresMonitoring;
    }
    
    public LocalDateTime getLastAnalysis() {
        return lastAnalysis;
    }
    
    public void setLastAnalysis(LocalDateTime lastAnalysis) {
        this.lastAnalysis = lastAnalysis;
    }
    
    @Override
    public String toString() {
        return "RiskAnalysisDTO{" +
                "pixKey='" + pixKey + '\'' +
                ", currentScore=" + currentScore +
                ", riskLevel='" + riskLevel + '\'' +
                ", totalReports=" + totalReports +
                ", reports24h=" + reports24h +
                ", isBlocked=" + isBlocked +
                ", requiresBlocking=" + requiresBlocking +
                '}';
    }
}