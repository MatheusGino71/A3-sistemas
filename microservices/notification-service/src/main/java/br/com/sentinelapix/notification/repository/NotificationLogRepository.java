package br.com.sentinelapix.notification.repository;

import br.com.sentinelapix.notification.model.NotificationLog;
import br.com.sentinelapix.notification.model.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
    
    /**
     * Busca logs de notificação por chave PIX
     */
    List<NotificationLog> findByPixKeyOrderByCreatedAtDesc(String pixKey);
    
    /**
     * Busca logs de notificação por ID da denúncia
     */
    List<NotificationLog> findByFraudReportIdOrderByCreatedAtDesc(Long fraudReportId);
    
    /**
     * Busca logs de notificação por status
     */
    List<NotificationLog> findByStatusOrderByCreatedAtDesc(NotificationStatus status);
    
    /**
     * Busca logs de notificação por código do banco
     */
    List<NotificationLog> findByBankCodeOrderByCreatedAtDesc(String bankCode);
    
    /**
     * Busca notificações pendentes de retry que já podem ser tentadas novamente
     */
    @Query("SELECT n FROM NotificationLog n WHERE n.status = 'RETRY' AND n.nextAttemptAt <= :currentTime")
    List<NotificationLog> findNotificationsReadyForRetry(@Param("currentTime") LocalDateTime currentTime);
    
    /**
     * Busca notificações que falharam após todas as tentativas
     */
    @Query("SELECT n FROM NotificationLog n WHERE n.status = 'FAILED' AND n.attemptCount >= n.maxAttempts")
    List<NotificationLog> findFailedNotifications();
    
    /**
     * Busca notificações por chave PIX e status
     */
    List<NotificationLog> findByPixKeyAndStatusOrderByCreatedAtDesc(String pixKey, NotificationStatus status);
    
    /**
     * Busca a última notificação bem-sucedida para uma chave PIX
     */
    Optional<NotificationLog> findTopByPixKeyAndStatusOrderByCreatedAtDesc(String pixKey, NotificationStatus status);
    
    /**
     * Conta quantas notificações foram enviadas para uma chave PIX
     */
    long countByPixKey(String pixKey);
    
    /**
     * Conta quantas notificações bem-sucedidas foram enviadas para uma chave PIX
     */
    long countByPixKeyAndStatus(String pixKey, NotificationStatus status);
    
    /**
     * Busca notificações criadas em um período específico
     */
    @Query("SELECT n FROM NotificationLog n WHERE n.createdAt BETWEEN :startDate AND :endDate ORDER BY n.createdAt DESC")
    List<NotificationLog> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);
    
    /**
     * Busca estatísticas de notificações por status
     */
    @Query("SELECT n.status, COUNT(n) FROM NotificationLog n GROUP BY n.status")
    List<Object[]> getNotificationStatsByStatus();
    
    /**
     * Busca notificações com muitas tentativas sem sucesso
     */
    @Query("SELECT n FROM NotificationLog n WHERE n.attemptCount > :attempts AND n.status != 'SUCCESS'")
    List<NotificationLog> findNotificationsWithManyAttempts(@Param("attempts") Integer attempts);
    
    /**
     * Remove logs de notificação antigos (limpeza de dados)
     */
    @Query("DELETE FROM NotificationLog n WHERE n.createdAt < :cutoffDate AND n.status = 'SUCCESS'")
    void deleteOldSuccessfulNotifications(@Param("cutoffDate") LocalDateTime cutoffDate);
}