package br.com.sentinelapix.notification.model;

/**
 * Enum que define os possíveis status de uma notificação
 */
public enum NotificationStatus {
    
    /**
     * Notificação pendente de envio
     */
    PENDING("Pendente"),
    
    /**
     * Notificação enviada com sucesso
     */
    SUCCESS("Sucesso"),
    
    /**
     * Notificação falhada após todas as tentativas
     */
    FAILED("Falha"),
    
    /**
     * Notificação aguardando nova tentativa
     */
    RETRY("Retentar"),
    
    /**
     * Notificação em processamento
     */
    PROCESSING("Processando");
    
    private final String description;
    
    NotificationStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    @Override
    public String toString() {
        return this.description;
    }
}