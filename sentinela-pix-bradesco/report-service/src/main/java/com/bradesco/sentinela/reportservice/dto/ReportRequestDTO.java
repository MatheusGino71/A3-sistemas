package com.bradesco.sentinela.reportservice.dto;

import com.bradesco.sentinela.reportservice.model.PixKeyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ReportRequestDTO {

    @NotBlank(message = "Chave PIX é obrigatória")
    @Size(max = 77, message = "Chave PIX deve ter no máximo 77 caracteres")
    private String reportedPixKey;

    @NotNull(message = "Tipo da chave PIX é obrigatório")
    private PixKeyType pixKeyType;

    @NotBlank(message = "Categoria do golpe é obrigatória")
    @Size(max = 100, message = "Categoria deve ter no máximo 100 caracteres")
    private String scamCategory;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
    private String description;

    public ReportRequestDTO() {
    }

    public ReportRequestDTO(String reportedPixKey, PixKeyType pixKeyType, String scamCategory, String description) {
        this.reportedPixKey = reportedPixKey;
        this.pixKeyType = pixKeyType;
        this.scamCategory = scamCategory;
        this.description = description;
    }

    // Getters and Setters
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
}