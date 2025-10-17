package com.bradesco.sentinela.reportservice.dto;

import com.bradesco.sentinela.reportservice.model.PixKeyType;

import java.time.LocalDateTime;

public class ReportResponseDTO {

    private Long id;
    private String reportedPixKey;
    private PixKeyType pixKeyType;
    private String scamCategory;
    private String description;
    private LocalDateTime timestamp;

    public ReportResponseDTO() {
    }

    public ReportResponseDTO(Long id, String reportedPixKey, PixKeyType pixKeyType, 
                           String scamCategory, String description, LocalDateTime timestamp) {
        this.id = id;
        this.reportedPixKey = reportedPixKey;
        this.pixKeyType = pixKeyType;
        this.scamCategory = scamCategory;
        this.description = description;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReportedPixKey() {
        return reportedPixKey;
    }

    public void setReportedPixKey(String reportedPixKey) {
        this.reportedPixKey = reportedPixKey;
    }

    public PixKeyType getPixKeyType() {
        return pixKeyType;
    }

    public void setPixKeyType(PixKeyType pixKeyType) {
        this.pixKeyType = pixKeyType;
    }

    public String getScamCategory() {
        return scamCategory;
    }

    public void setScamCategory(String scamCategory) {
        this.scamCategory = scamCategory;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}