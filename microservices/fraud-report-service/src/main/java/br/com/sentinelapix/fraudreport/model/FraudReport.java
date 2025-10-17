package br.com.sentinelapix.fraudreport.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Entidade que representa uma denúncia de fraude PIX
 * 
 * Esta classe modela todas as informações necessárias para uma denúncia
 * de golpe PIX, incluindo dados da transação, vítima e status da investigação.
 */
@Entity
@Table(name = "fraud_reports", indexes = {
    @Index(name = "idx_pix_key", columnList = "pixKey"),
    @Index(name = "idx_transaction_id", columnList = "transactionId"),
    @Index(name = "idx_victim_bank", columnList = "victimBank"),
    @Index(name = "idx_report_timestamp", columnList = "reportTimestamp")
})
public class FraudReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Chave PIX do golpista (destinatário da transação fraudulenta)
     */
    @NotBlank(message = "Chave PIX é obrigatória")
    @Size(min = 11, max = 77, message = "Chave PIX deve ter entre 11 e 77 caracteres")
    @Column(name = "pix_key", nullable = false, length = 77)
    private String pixKey;

    /**
     * Valor da transação fraudulenta
     */
    @NotNull(message = "Valor da transação é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @DecimalMax(value = "999999999.99", message = "Valor excede o limite máximo")
    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    /**
     * Data e hora da transação PIX fraudulenta
     */
    @NotNull(message = "Timestamp da transação é obrigatório")
    @PastOrPresent(message = "Timestamp deve ser no passado ou presente")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "transaction_timestamp", nullable = false)
    private LocalDateTime transactionTimestamp;

    /**
     * ID único da transação PIX (E2E ID)
     */
    @NotBlank(message = "ID da transação é obrigatório")
    @Size(min = 32, max = 32, message = "ID da transação deve ter 32 caracteres")
    @Pattern(regexp = "^[A-Z0-9]{32}$", message = "ID da transação deve conter apenas letras maiúsculas e números")
    @Column(name = "transaction_id", nullable = false, length = 32, unique = true)
    private String transactionId;

    /**
     * Código ISPB do banco da vítima (8 dígitos)
     */
    @NotBlank(message = "Banco da vítima é obrigatório")
    @Pattern(regexp = "^\\d{8}$", message = "Código do banco deve ter 8 dígitos")
    @Column(name = "victim_bank", nullable = false, length = 8)
    private String victimBank;

    /**
     * Informações adicionais do denunciante/vítima (sem dados sensíveis)
     */
    @Size(max = 500, message = "Informações do reporter devem ter no máximo 500 caracteres")
    @Column(name = "reporter_info", length = 500)
    private String reporterInfo;

    /**
     * Status atual da denúncia
     */
    @NotNull(message = "Status é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private FraudStatus status = FraudStatus.PENDING;

    /**
     * Prioridade da denúncia baseada em fatores como valor e histórico
     */
    @NotNull(message = "Prioridade é obrigatória")
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 10)
    private FraudPriority priority = FraudPriority.MEDIUM;

    /**
     * Timestamp de quando a denúncia foi registrada no sistema
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "report_timestamp", nullable = false)
    private LocalDateTime reportTimestamp;

    /**
     * IP de origem da denúncia (para auditoria)
     */
    @Pattern(regexp = "^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$", message = "IP deve estar no formato válido")
    @Column(name = "source_ip", length = 15)
    private String sourceIp;

    /**
     * User agent da requisição (para auditoria)
     */
    @Size(max = 500, message = "User agent deve ter no máximo 500 caracteres")
    @Column(name = "user_agent", length = 500)
    private String userAgent;

    /**
     * Observações adicionais sobre a denúncia
     */
    @Size(max = 1000, message = "Observações devem ter no máximo 1000 caracteres")
    @Column(name = "observations", length = 1000)
    private String observations;

    /**
     * Timestamp da última atualização
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Construtor padrão
    public FraudReport() {
        this.reportTimestamp = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Construtor com parâmetros principais
    public FraudReport(String pixKey, BigDecimal amount, LocalDateTime transactionTimestamp, 
                      String transactionId, String victimBank) {
        this();
        this.pixKey = pixKey;
        this.amount = amount;
        this.transactionTimestamp = transactionTimestamp;
        this.transactionId = transactionId;
        this.victimBank = victimBank;
    }

    // Callback para atualizar timestamp
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
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

    public String getSourceIp() {
        return sourceIp;
    }

    public void setSourceIp(String sourceIp) {
        this.sourceIp = sourceIp;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
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
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FraudReport that = (FraudReport) o;
        return Objects.equals(transactionId, that.transactionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(transactionId);
    }

    @Override
    public String toString() {
        return "FraudReport{" +
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