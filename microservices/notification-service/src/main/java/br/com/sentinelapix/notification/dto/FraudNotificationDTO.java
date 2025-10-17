package br.com.sentinelapix.notification.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

/**
 * DTO para notificar bancos sobre denúncias de fraude em chaves PIX
 */
public class FraudNotificationDTO {
    
    @JsonProperty("pix_key")
    @NotBlank(message = "Chave PIX é obrigatória")
    private String pixKey;
    
    @JsonProperty("fraud_report_id")
    @NotNull(message = "ID da denúncia é obrigatório")
    private Long fraudReportId;
    
    @JsonProperty("reporter_bank")
    @NotBlank(message = "Banco denunciante é obrigatório")
    private String reporterBank;
    
    @JsonProperty("fraud_type")
    @NotBlank(message = "Tipo de fraude é obrigatório")
    private String fraudType;
    
    @JsonProperty("priority")
    @NotBlank(message = "Prioridade é obrigatória")
    private String priority;
    
    @JsonProperty("amount")
    private Double amount;
    
    @JsonProperty("description")
    private String description;
    
    @JsonProperty("occurred_at")
    @NotNull(message = "Data de ocorrência é obrigatória")
    private LocalDateTime occurredAt;
    
    @JsonProperty("reported_at")
    @NotNull(message = "Data da denúncia é obrigatória")
    private LocalDateTime reportedAt;
    
    @JsonProperty("notification_id")
    private String notificationId;
    
    // Constructors
    public FraudNotificationDTO() {}
    
    public FraudNotificationDTO(String pixKey, Long fraudReportId, String reporterBank,
                               String fraudType, String priority, Double amount,
                               String description, LocalDateTime occurredAt,
                               LocalDateTime reportedAt) {
        this.pixKey = pixKey;
        this.fraudReportId = fraudReportId;
        this.reporterBank = reporterBank;
        this.fraudType = fraudType;
        this.priority = priority;
        this.amount = amount;
        this.description = description;
        this.occurredAt = occurredAt;
        this.reportedAt = reportedAt;
        this.notificationId = "NOTIF-" + fraudReportId + "-" + System.currentTimeMillis();
    }
    
    // Getters and Setters
    public String getPixKey() {
        return pixKey;
    }
    
    public void setPixKey(String pixKey) {
        this.pixKey = pixKey;
    }
    
    public Long getFraudReportId() {
        return fraudReportId;
    }
    
    public void setFraudReportId(Long fraudReportId) {
        this.fraudReportId = fraudReportId;
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
    
    public String getPriority() {
        return priority;
    }
    
    public void setPriority(String priority) {
        this.priority = priority;
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
    
    public String getNotificationId() {
        return notificationId;
    }
    
    public void setNotificationId(String notificationId) {
        this.notificationId = notificationId;
    }
    
    @Override
    public String toString() {
        return "FraudNotificationDTO{" +
                "pixKey='" + pixKey + '\'' +
                ", fraudReportId=" + fraudReportId +
                ", reporterBank='" + reporterBank + '\'' +
                ", fraudType='" + fraudType + '\'' +
                ", priority='" + priority + '\'' +
                ", amount=" + amount +
                ", occurredAt=" + occurredAt +
                ", notificationId='" + notificationId + '\'' +
                '}';
    }
}