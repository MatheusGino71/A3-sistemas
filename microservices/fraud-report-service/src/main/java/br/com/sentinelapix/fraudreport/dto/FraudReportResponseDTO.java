package br.com.sentinelapix.fraudreport.dto;

import br.com.sentinelapix.fraudreport.model.FraudPriority;
import br.com.sentinelapix.fraudreport.model.FraudStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para resposta de denúncias de fraude PIX
 * 
 * Representa os dados retornados após o processamento da denúncia
 */
public class FraudReportResponseDTO {

    private Long id;
    private String pixKey;
    private BigDecimal amount;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime transactionTimestamp;
    
    private String transactionId;
    private String victimBank;
    private String reporterInfo;
    private FraudStatus status;
    private FraudPriority priority;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime reportTimestamp;
    
    private String observations;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    // Construtor padrão
    public FraudReportResponseDTO() {}

    // Construtor com parâmetros principais
    public FraudReportResponseDTO(Long id, String pixKey, BigDecimal amount, 
                                LocalDateTime transactionTimestamp, String transactionId, 
                                String victimBank, FraudStatus status, FraudPriority priority,
                                LocalDateTime reportTimestamp) {
        this.id = id;
        this.pixKey = pixKey;
        this.amount = amount;
        this.transactionTimestamp = transactionTimestamp;
        this.transactionId = transactionId;
        this.victimBank = victimBank;
        this.status = status;
        this.priority = priority;
        this.reportTimestamp = reportTimestamp;
    }

    // Getters e Setters
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

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getTransactionTimestamp() {
        return transactionTimestamp;
    }

    public void setTransactionTimestamp(LocalDateTime transactionTimestamp) {
        this.transactionTimestamp = transactionTimestamp;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getVictimBank() {
        return victimBank;
    }

    public void setVictimBank(String victimBank) {
        this.victimBank = victimBank;
    }

    public String getReporterInfo() {
        return reporterInfo;
    }

    public void setReporterInfo(String reporterInfo) {
        this.reporterInfo = reporterInfo;
    }

    public FraudStatus getStatus() {
        return status;
    }

    public void setStatus(FraudStatus status) {
        this.status = status;
    }

    public FraudPriority getPriority() {
        return priority;
    }

    public void setPriority(FraudPriority priority) {
        this.priority = priority;
    }

    public LocalDateTime getReportTimestamp() {
        return reportTimestamp;
    }

    public void setReportTimestamp(LocalDateTime reportTimestamp) {
        this.reportTimestamp = reportTimestamp;
    }

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "FraudReportResponseDTO{" +
                "id=" + id +
                ", pixKey='" + pixKey + '\'' +
                ", amount=" + amount +
                ", transactionId='" + transactionId + '\'' +
                ", victimBank='" + victimBank + '\'' +
                ", status=" + status +
                ", priority=" + priority +
                ", reportTimestamp=" + reportTimestamp +
                '}';
    }
}