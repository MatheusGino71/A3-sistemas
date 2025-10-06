package com.bradesco.sentinela.queryservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PixKeyQueryDTO {

    @NotBlank(message = "Chave PIX é obrigatória")
    @Size(max = 77, message = "Chave PIX deve ter no máximo 77 caracteres")
    private String pixKey;

    public PixKeyQueryDTO() {
    }

    public PixKeyQueryDTO(String pixKey) {
        this.pixKey = pixKey;
    }

    public String getPixKey() {
        return pixKey;
    }

    public void setPixKey(String pixKey) {
        this.pixKey = pixKey;
    }
}