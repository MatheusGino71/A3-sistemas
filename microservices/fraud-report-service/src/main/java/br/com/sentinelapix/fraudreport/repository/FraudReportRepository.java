package br.com.sentinelapix.fraudreport.repository;

import br.com.sentinelapix.fraudreport.model.FraudPriority;
import br.com.sentinelapix.fraudreport.model.FraudReport;
import br.com.sentinelapix.fraudreport.model.FraudStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository para gerenciamento de denúncias de fraude PIX
 * 
 * Contém queries personalizadas para consultas específicas do domínio
 */
@Repository
public interface FraudReportRepository extends JpaRepository<FraudReport, Long> {

    /**
     * Buscar denúncia por ID da transação PIX
     */
    Optional<FraudReport> findByTransactionId(String transactionId);

    /**
     * Buscar denúncias por chave PIX ordenadas por timestamp
     */
    Page<FraudReport> findByPixKeyOrderByReportTimestampDesc(String pixKey, Pageable pageable);

    /**
     * Contar denúncias por chave PIX
     */
    long countByPixKey(String pixKey);

    /**
     * Contar denúncias por chave PIX e status
     */
    long countByPixKeyAndStatus(String pixKey, FraudStatus status);

    /**
     * Buscar primeira denúncia por chave PIX (mais antiga)
     */
    Optional<FraudReport> findFirstByPixKeyOrderByReportTimestampAsc(String pixKey);

    /**
     * Buscar última denúncia por chave PIX (mais recente)
     */
    Optional<FraudReport> findFirstByPixKeyOrderByReportTimestampDesc(String pixKey);

    /**
     * Buscar denúncias por status
     */
    List<FraudReport> findByStatus(FraudStatus status);

    /**
     * Buscar denúncias por prioridade
     */
    List<FraudReport> findByPriority(FraudPriority priority);

    /**
     * Buscar denúncias por banco da vítima
     */
    Page<FraudReport> findByVictimBankOrderByReportTimestampDesc(String victimBank, Pageable pageable);

    /**
     * Buscar denúncias por período
     */
    @Query("SELECT fr FROM FraudReport fr WHERE fr.reportTimestamp BETWEEN :startDate AND :endDate ORDER BY fr.reportTimestamp DESC")
    List<FraudReport> findByReportTimestampBetween(@Param("startDate") LocalDateTime startDate, 
                                                  @Param("endDate") LocalDateTime endDate);

    /**
     * Buscar denúncias de uma chave PIX nas últimas 24 horas
     */
    @Query("SELECT fr FROM FraudReport fr WHERE fr.pixKey = :pixKey AND fr.reportTimestamp >= :since")
    List<FraudReport> findRecentReportsByPixKey(@Param("pixKey") String pixKey, 
                                               @Param("since") LocalDateTime since);

    /**
     * Query complexa com filtros opcionais
     */
    @Query("SELECT fr FROM FraudReport fr WHERE " +
           "(:pixKey IS NULL OR fr.pixKey = :pixKey) AND " +
           "(:victimBank IS NULL OR fr.victimBank = :victimBank) AND " +
           "(:status IS NULL OR fr.status = :status) AND " +
           "(:priority IS NULL OR fr.priority = :priority) " +
           "ORDER BY fr.reportTimestamp DESC")
    Page<FraudReport> findWithFilters(@Param("pixKey") String pixKey,
                                     @Param("victimBank") String victimBank,
                                     @Param("status") FraudStatus status,
                                     @Param("priority") FraudPriority priority,
                                     Pageable pageable);

    /**
     * Estatísticas de denúncias por mês
     */
    @Query("SELECT YEAR(fr.reportTimestamp), MONTH(fr.reportTimestamp), COUNT(fr) " +
           "FROM FraudReport fr " +
           "GROUP BY YEAR(fr.reportTimestamp), MONTH(fr.reportTimestamp) " +
           "ORDER BY YEAR(fr.reportTimestamp) DESC, MONTH(fr.reportTimestamp) DESC")
    List<Object[]> getMonthlyStatistics();

    /**
     * Top chaves PIX com mais denúncias
     */
    @Query("SELECT fr.pixKey, COUNT(fr) as reportCount " +
           "FROM FraudReport fr " +
           "GROUP BY fr.pixKey " +
           "ORDER BY reportCount DESC")
    List<Object[]> getTopReportedPixKeys(Pageable pageable);

    /**
     * Denúncias pendentes há mais de X horas
     */
    @Query("SELECT fr FROM FraudReport fr WHERE fr.status = 'PENDING' AND fr.reportTimestamp < :threshold")
    List<FraudReport> findOverdueReports(@Param("threshold") LocalDateTime threshold);

    /**
     * Contar denúncias por status
     */
    @Query("SELECT fr.status, COUNT(fr) FROM FraudReport fr GROUP BY fr.status")
    List<Object[]> countByStatus();

    /**
     * Contar denúncias por prioridade
     */
    @Query("SELECT fr.priority, COUNT(fr) FROM FraudReport fr GROUP BY fr.priority")
    List<Object[]> countByPriority();
}