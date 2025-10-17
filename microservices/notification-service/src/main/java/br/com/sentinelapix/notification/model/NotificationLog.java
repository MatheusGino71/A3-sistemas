package br.com.sentinelapix.notification.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_logs")
public class NotificationLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "pix_key", nullable = false)
    @NotBlank(message = "Chave PIX é obrigatória")
    private String pixKey;
    
    @Column(name = "bank_code", nullable = false)
    @NotBlank(message = "Código do banco é obrigatório")
    private String bankCode;
    
    @Column(name = "bank_name", nullable = false)
    @NotBlank(message = "Nome do banco é obrigatório")
    private String bankName;
    
    @Column(name = "fraud_report_id", nullable = false)
    @NotNull(message = "ID da denúncia é obrigatório")
    private Long fraudReportId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @NotNull(message = "Status é obrigatório")
    private NotificationStatus status;
    
    @Column(name = "webhook_url")
    private String webhookUrl;
    
    @Column(name = "attempt_count", nullable = false)
    private Integer attemptCount = 0;
    
    @Column(name = "max_attempts", nullable = false)
    private Integer maxAttempts = 3;
    
    @Column(name = "response_status")
    private Integer responseStatus;
    
    @Column(name = "response_body", length = 2000)
    private String responseBody;
    
    @Column(name = "error_message", length = 1000)
    private String errorMessage;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "next_attempt_at")
    private LocalDateTime nextAttemptAt;
    
    // Constructors
    public NotificationLog() {}
    
    public NotificationLog(String pixKey, String bankCode, String bankName, 
                          Long fraudReportId, String webhookUrl) {
        this.pixKey = pixKey;
        this.bankCode = bankCode;
        this.bankName = bankName;
        this.fraudReportId = fraudReportId;
        this.webhookUrl = webhookUrl;
        this.status = NotificationStatus.PENDING;
        this.createdAt = LocalDateTime.now();
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
    
    public String getBankCode() {
        return bankCode;
    }
    
    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }
    
    public String getBankName() {
        return bankName;
    }
    
    public void setBankName(String bankName) {
        this.bankName = bankName;
    }
    
    public Long getFraudReportId() {
        return fraudReportId;
    }
    
    public void setFraudReportId(Long fraudReportId) {
        this.fraudReportId = fraudReportId;
    }
    
    public NotificationStatus getStatus() {
        return status;
    }
    
    public void setStatus(NotificationStatus status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getWebhookUrl() {
        return webhookUrl;
    }
    
    public void setWebhookUrl(String webhookUrl) {
        this.webhookUrl = webhookUrl;
    }
    
    public Integer getAttemptCount() {
        return attemptCount;
    }
    
    public void setAttemptCount(Integer attemptCount) {
        this.attemptCount = attemptCount;
    }
    
    public Integer getMaxAttempts() {
        return maxAttempts;
    }
    
    public void setMaxAttempts(Integer maxAttempts) {
        this.maxAttempts = maxAttempts;
    }
    
    public Integer getResponseStatus() {
        return responseStatus;
    }
    
    public void setResponseStatus(Integer responseStatus) {
        this.responseStatus = responseStatus;
    }
    
    public String getResponseBody() {
        return responseBody;
    }
    
    public void setResponseBody(String responseBody) {
        this.responseBody = responseBody;
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public LocalDateTime getNextAttemptAt() {
        return nextAttemptAt;
    }
    
    public void setNextAttemptAt(LocalDateTime nextAttemptAt) {
        this.nextAttemptAt = nextAttemptAt;
    }
    
    // Business Methods
    public void incrementAttempt() {
        this.attemptCount++;
        this.updatedAt = LocalDateTime.now();
    }
    
    public boolean canRetry() {
        return this.attemptCount < this.maxAttempts && 
               this.status != NotificationStatus.SUCCESS;
    }
    
    public void markAsSuccess(Integer responseStatus, String responseBody) {
        this.status = NotificationStatus.SUCCESS;
        this.responseStatus = responseStatus;
        this.responseBody = responseBody;
        this.errorMessage = null;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void markAsFailed(String errorMessage) {
        this.status = NotificationStatus.FAILED;
        this.errorMessage = errorMessage;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void scheduleNextAttempt(int delayMinutes) {
        this.nextAttemptAt = LocalDateTime.now().plusMinutes(delayMinutes);
        this.status = NotificationStatus.RETRY;
        this.updatedAt = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return "NotificationLog{" +
                "id=" + id +
                ", pixKey='" + pixKey + '\'' +
                ", bankCode='" + bankCode + '\'' +
                ", fraudReportId=" + fraudReportId +
                ", status=" + status +
                ", attemptCount=" + attemptCount +
                ", createdAt=" + createdAt +
                '}';
    }
}