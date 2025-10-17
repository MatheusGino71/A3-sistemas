package br.com.sentinelapix.riskanalysis.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

/**
 * DTO para eventos de denúncia de fraude recebidos via RabbitMQ
 */
public class FraudReportEventDTO {
    
    @JsonProperty("fraud_report_id")
    @NotNull(message = "ID da denúncia é obrigatório")
    private Long fraudReportId;
    
    @JsonProperty("pix_key")
    @NotBlank(message = "Chave PIX é obrigatória")
    private String pixKey;
    
    @JsonProperty("reporter_bank")
    @NotBlank(message = "Banco denunciante é obrigatório")
    private String reporterBank;
    
    @JsonProperty("fraud_type")
    @NotBlank(message = "Tipo de fraude é obrigatório")
    private String fraudType;
    
    @JsonProperty("amount")
    private Double amount;
    
    @JsonProperty("description")
    private String description;
    
    @JsonProperty("priority")
    @NotBlank(message = "Prioridade é obrigatória")
    private String priority;
    
    @JsonProperty("occurred_at")
    @NotNull(message = "Data de ocorrência é obrigatória")
    private LocalDateTime occurredAt;
    
    @JsonProperty("reported_at")
    @NotNull(message = "Data da denúncia é obrigatória")
    private LocalDateTime reportedAt;
    
    // Constructors
    public FraudReportEventDTO() {}
    
    public FraudReportEventDTO(Long fraudReportId, String pixKey, String reporterBank,
                              String fraudType, Double amount, String description,
                              String priority, LocalDateTime occurredAt, LocalDateTime reportedAt) {
        this.fraudReportId = fraudReportId;
        this.pixKey = pixKey;
        this.reporterBank = reporterBank;
        this.fraudType = fraudType;
        this.amount = amount;
        this.description = description;
        this.priority = priority;
        this.occurredAt = occurredAt;
        this.reportedAt = reportedAt;
    }
    
    // Getters and Setters
    public Long getFraudReportId() {
        return fraudReportId;
    }
    
    public void setFraudReportId(Long fraudReportId) {
        this.fraudReportId = fraudReportId;
    }
    
    public String getPixKey() {
        return pixKey;
    }
    
    public void setPixKey(String pixKey) {
        this.pixKey = pixKey;
    }
    
    public String getReporterBank() {
        return reporterBank;
    }
    
    public void setReporterBank(String reporterBank) {
        this.reporterBank = reporterBank;
    }
    
    public String getFraudType() {
        return fraudType;
    }
    
    public void setFraudType(String fraudType) {
        this.fraudType = fraudType;
    }
    
    public Double getAmount() {
        return amount;
    }
    
    public void setAmount(Double amount) {
        this.amount = amount;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getPriority() {
        return priority;
    }
    
    public void setPriority(String priority) {
        this.priority = priority;
    }
    
    public LocalDateTime getOccurredAt() {
        return occurredAt;
    }
    
    public void setOccurredAt(LocalDateTime occurredAt) {
        this.occurredAt = occurredAt;
    }
    
    public LocalDateTime getReportedAt() {
        return reportedAt;
    }
    
    public void setReportedAt(LocalDateTime reportedAt) {
        this.reportedAt = reportedAt;
    }
    
    @Override
    public String toString() {
        return "FraudReportEventDTO{" +
                "fraudReportId=" + fraudReportId +
                ", pixKey='" + pixKey + '\'' +
                ", reporterBank='" + reporterBank + '\'' +
                ", fraudType='" + fraudType + '\'' +
                ", amount=" + amount +
                ", priority='" + priority + '\'' +
                ", occurredAt=" + occurredAt +
                ", reportedAt=" + reportedAt +
                '}';
    }
}