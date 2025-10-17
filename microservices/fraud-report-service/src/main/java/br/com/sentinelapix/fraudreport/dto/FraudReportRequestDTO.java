package br.com.sentinelapix.fraudreport.dto;

import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para recebimento de denúncias de fraude PIX
 * 
 * Representa os dados enviados pelas instituições financeiras
 * quando registram uma denúncia de golpe PIX
 */
public class FraudReportRequestDTO {

    @NotBlank(message = "Chave PIX é obrigatória")
    @Size(min = 11, max = 77, message = "Chave PIX deve ter entre 11 e 77 caracteres")
    private String pixKey;

    @NotNull(message = "Valor da transação é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @DecimalMax(value = "999999999.99", message = "Valor excede o limite máximo")
    private BigDecimal amount;

    @NotNull(message = "Timestamp da transação é obrigatório")
    @PastOrPresent(message = "Timestamp deve ser no passado ou presente")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime transactionTimestamp;

    @NotBlank(message = "ID da transação é obrigatório")
    @Size(min = 32, max = 32, message = "ID da transação deve ter 32 caracteres")
    @Pattern(regexp = "^[A-Z0-9]{32}$", message = "ID da transação deve conter apenas letras maiúsculas e números")
    private String transactionId;

    @NotBlank(message = "Banco da vítima é obrigatório")
    @Pattern(regexp = "^\\d{8}$", message = "Código do banco deve ter 8 dígitos")
    private String victimBank;

    @Size(max = 500, message = "Informações do reporter devem ter no máximo 500 caracteres")
    private String reporterInfo;

    @Size(max = 1000, message = "Observações devem ter no máximo 1000 caracteres")
    private String observations;

    // Construtores
    public FraudReportRequestDTO() {}

    public FraudReportRequestDTO(String pixKey, BigDecimal amount, LocalDateTime transactionTimestamp, 
                               String transactionId, String victimBank) {
        this.pixKey = pixKey;
        this.amount = amount;
        this.transactionTimestamp = transactionTimestamp;
        this.transactionId = transactionId;
        this.victimBank = victimBank;
    }

    // Getters e Setters
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

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    @Override
    public String toString() {
        return "FraudReportRequestDTO{" +
                "pixKey='" + pixKey + '\'' +
                ", amount=" + amount +
                ", transactionTimestamp=" + transactionTimestamp +
                ", transactionId='" + transactionId + '\'' +
                ", victimBank='" + victimBank + '\'' +
                '}';
    }
}