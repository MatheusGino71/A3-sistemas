package com.bradesco.sentinela.queryservice.dto;

import com.bradesco.sentinela.queryservice.model.RiskLevel;

import java.time.LocalDateTime;

public class RiskAssessmentDTO {

    private String pixKey;
    private RiskLevel riskLevel;
    private long reportCount;
    private String summary;
    private LocalDateTime assessmentTime;

    public RiskAssessmentDTO() {
        this.assessmentTime = LocalDateTime.now();
    }

    public RiskAssessmentDTO(String pixKey, RiskLevel riskLevel, long reportCount, String summary) {
        this.pixKey = pixKey;
        this.riskLevel = riskLevel;
        this.reportCount = reportCount;
        this.summary = summary;
        this.assessmentTime = LocalDateTime.now();
    }

    // Getters and Setters
    public String getPixKey() {
        return pixKey;
    }

    public void setPixKey(String pixKey) {
        this.pixKey = pixKey;
    }

    public RiskLevel getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
    }

    public long getReportCount() {
        return reportCount;
    }

    public void setReportCount(long reportCount) {
        this.reportCount = reportCount;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public LocalDateTime getAssessmentTime() {
        return assessmentTime;
    }

    public void setAssessmentTime(LocalDateTime assessmentTime) {
        this.assessmentTime = assessmentTime;
    }
}