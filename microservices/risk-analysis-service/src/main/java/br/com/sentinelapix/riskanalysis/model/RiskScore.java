package br.com.sentinelapix.riskanalysis.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "risk_scores")
public class RiskScore {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "pix_key", nullable = false, unique = true)
    @NotBlank(message = "Chave PIX é obrigatória")
    private String pixKey;
    
    @Column(name = "current_score", nullable = false)
    @NotNull(message = "Score atual é obrigatório")
    private Integer currentScore = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false)
    @NotNull(message = "Nível de risco é obrigatório")
    private RiskLevel riskLevel = RiskLevel.LOW;
    
    @Column(name = "total_reports", nullable = false)
    private Integer totalReports = 0;
    
    @Column(name = "reports_24h", nullable = false)
    private Integer reports24h = 0;
    
    @Column(name = "reports_7d", nullable = false)
    private Integer reports7d = 0;
    
    @Column(name = "reports_30d", nullable = false)
    private Integer reports30d = 0;
    
    @Column(name = "high_value_reports", nullable = false)
    private Integer highValueReports = 0;
    
    @Column(name = "different_banks_count", nullable = false)
    private Integer differentBanksCount = 0;
    
    @Column(name = "first_report_date")
    private LocalDateTime firstReportDate;
    
    @Column(name = "last_report_date")
    private LocalDateTime lastReportDate;
    
    @Column(name = "last_calculation", nullable = false)
    private LocalDateTime lastCalculation = LocalDateTime.now();
    
    @Column(name = "is_blocked", nullable = false)
    private Boolean isBlocked = false;
    
    @Column(name = "blocked_at")
    private LocalDateTime blockedAt;
    
    @Column(name = "blocked_reason")
    private String blockedReason;
    
    // Constructors
    public RiskScore() {}
    
    public RiskScore(String pixKey) {
        this.pixKey = pixKey;
        this.currentScore = 0;
        this.riskLevel = RiskLevel.LOW;
        this.lastCalculation = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
        updateRiskLevel();
    }
    
    public RiskLevel getRiskLevel() {
        return riskLevel;
    }
    
    public void setRiskLevel(RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
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
    
    public Integer getHighValueReports() {
        return highValueReports;
    }
    
    public void setHighValueReports(Integer highValueReports) {
        this.highValueReports = highValueReports;
    }
    
    public Integer getDifferentBanksCount() {
        return differentBanksCount;
    }
    
    public void setDifferentBanksCount(Integer differentBanksCount) {
        this.differentBanksCount = differentBanksCount;
    }
    
    public LocalDateTime getFirstReportDate() {
        return firstReportDate;
    }
    
    public void setFirstReportDate(LocalDateTime firstReportDate) {
        this.firstReportDate = firstReportDate;
    }
    
    public LocalDateTime getLastReportDate() {
        return lastReportDate;
    }
    
    public void setLastReportDate(LocalDateTime lastReportDate) {
        this.lastReportDate = lastReportDate;
    }
    
    public LocalDateTime getLastCalculation() {
        return lastCalculation;
    }
    
    public void setLastCalculation(LocalDateTime lastCalculation) {
        this.lastCalculation = lastCalculation;
    }
    
    public Boolean getIsBlocked() {
        return isBlocked;
    }
    
    public void setIsBlocked(Boolean isBlocked) {
        this.isBlocked = isBlocked;
    }
    
    public LocalDateTime getBlockedAt() {
        return blockedAt;
    }
    
    public void setBlockedAt(LocalDateTime blockedAt) {
        this.blockedAt = blockedAt;
    }
    
    public String getBlockedReason() {
        return blockedReason;
    }
    
    public void setBlockedReason(String blockedReason) {
        this.blockedReason = blockedReason;
    }
    
    // Business Methods
    private void updateRiskLevel() {
        if (currentScore >= 80) {
            this.riskLevel = RiskLevel.CRITICAL;
        } else if (currentScore >= 60) {
            this.riskLevel = RiskLevel.HIGH;
        } else if (currentScore >= 30) {
            this.riskLevel = RiskLevel.MEDIUM;
        } else if (currentScore >= 10) {
            this.riskLevel = RiskLevel.SUSPICIOUS;
        } else {
            this.riskLevel = RiskLevel.LOW;
        }
    }
    
    public void incrementReport(Double amount, String reporterBank, LocalDateTime reportDate) {
        this.totalReports++;
        this.lastReportDate = reportDate;
        this.lastCalculation = LocalDateTime.now();
        
        if (this.firstReportDate == null) {
            this.firstReportDate = reportDate;
        }
        
        // Incrementa contador de valor alto se o valor for > 1000
        if (amount != null && amount > 1000.0) {
            this.highValueReports++;
        }
    }
    
    public void blockKey(String reason) {
        this.isBlocked = true;
        this.blockedAt = LocalDateTime.now();
        this.blockedReason = reason;
        this.currentScore = Math.max(this.currentScore, 80); // Força score crítico
        updateRiskLevel();
    }
    
    public void unblockKey() {
        this.isBlocked = false;
        this.blockedAt = null;
        this.blockedReason = null;
    }
    
    @Override
    public String toString() {
        return "RiskScore{" +
                "id=" + id +
                ", pixKey='" + pixKey + '\'' +
                ", currentScore=" + currentScore +
                ", riskLevel=" + riskLevel +
                ", totalReports=" + totalReports +
                ", reports24h=" + reports24h +
                ", isBlocked=" + isBlocked +
                '}';
    }
}