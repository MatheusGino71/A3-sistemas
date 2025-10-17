package com.bradesco.sentinela.reportservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "fraud_reports", indexes = {
    @Index(name = "idx_reported_pix_key", columnList = "reported_pix_key")
})
public class FraudReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Chave PIX é obrigatória")
    @Size(max = 77, message = "Chave PIX deve ter no máximo 77 caracteres")
    @Column(name = "reported_pix_key", nullable = false, length = 77)
    private String reportedPixKey;

    @NotNull(message = "Tipo da chave PIX é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(name = "pix_key_type", nullable = false)
    private PixKeyType pixKeyType;

    @NotBlank(message = "Categoria do golpe é obrigatória")
    @Size(max = 100, message = "Categoria deve ter no máximo 100 caracteres")
    @Column(name = "scam_category", nullable = false, length = 100)
    private String scamCategory;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
    @Column(name = "description", nullable = false, length = 1000)
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime timestamp;

    public FraudReport() {
    }

    public FraudReport(String reportedPixKey, PixKeyType pixKeyType, String scamCategory, String description) {
        this.reportedPixKey = reportedPixKey;
        this.pixKeyType = pixKeyType;
        this.scamCategory = scamCategory;
        this.description = description;
        this.timestamp = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
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