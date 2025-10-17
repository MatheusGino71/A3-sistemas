package br.com.sentinelapix.riskanalysis.repository;

import br.com.sentinelapix.riskanalysis.model.RiskLevel;
import br.com.sentinelapix.riskanalysis.model.RiskScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RiskScoreRepository extends JpaRepository<RiskScore, Long> {
    
    /**
     * Busca RiskScore por chave PIX
     */
    Optional<RiskScore> findByPixKey(String pixKey);
    
    /**
     * Busca RiskScores por nível de risco
     */
    List<RiskScore> findByRiskLevel(RiskLevel riskLevel);
    
    /**
     * Busca RiskScores por múltiplos níveis de risco
     */
    List<RiskScore> findByRiskLevelIn(List<RiskLevel> riskLevels);
    
    /**
     * Busca chaves bloqueadas
     */
    List<RiskScore> findByIsBlockedTrue();
    
    /**
     * Busca chaves com score acima do valor especificado
     */
    @Query("SELECT r FROM RiskScore r WHERE r.currentScore >= :minScore ORDER BY r.currentScore DESC")
    List<RiskScore> findByScoreGreaterThanEqual(@Param("minScore") Integer minScore);
    
    /**
     * Busca chaves com muitas denúncias em 24h
     */
    @Query("SELECT r FROM RiskScore r WHERE r.reports24h >= :minReports ORDER BY r.reports24h DESC")
    List<RiskScore> findByReports24hGreaterThanEqual(@Param("minReports") Integer minReports);
    
    /**
     * Conta denúncias para uma chave PIX em um período específico
     * Esta query seria executada contra a tabela de fraud_reports
     */
    @Query(value = "SELECT COUNT(*) FROM fraud_reports WHERE pix_key = :pixKey AND reported_at BETWEEN :startDate AND :endDate", 
           nativeQuery = true)
    int countReportsInPeriod(@Param("pixKey") String pixKey, 
                           @Param("startDate") LocalDateTime startDate, 
                           @Param("endDate") LocalDateTime endDate);
    
    /**
     * Conta quantos bancos diferentes já denunciaram uma chave PIX
     */
    @Query(value = "SELECT COUNT(DISTINCT reporter_bank) FROM fraud_reports WHERE pix_key = :pixKey", 
           nativeQuery = true)
    int countDistinctReporterBanks(@Param("pixKey") String pixKey);
    
    /**
     * Conta denúncias de alto valor para uma chave PIX
     */
    @Query(value = "SELECT COUNT(*) FROM fraud_reports WHERE pix_key = :pixKey AND amount > :minAmount", 
           nativeQuery = true)
    int countHighValueReports(@Param("pixKey") String pixKey, @Param("minAmount") Double minAmount);
    
    /**
     * Busca chaves que precisam de recálculo de score
     */
    @Query("SELECT r FROM RiskScore r WHERE r.lastCalculation < :cutoffTime")
    List<RiskScore> findNeedingRecalculation(@Param("cutoffTime") LocalDateTime cutoffTime);
    
    /**
     * Busca top chaves por score
     */
    @Query("SELECT r FROM RiskScore r ORDER BY r.currentScore DESC")
    List<RiskScore> findTopByScore(@Param("limit") int limit);
    
    /**
     * Busca chaves com atividade recente
     */
    @Query("SELECT r FROM RiskScore r WHERE r.lastReportDate >= :sinceDate ORDER BY r.lastReportDate DESC")
    List<RiskScore> findWithRecentActivity(@Param("sinceDate") LocalDateTime sinceDate);
    
    /**
     * Estatísticas gerais de risco
     */
    @Query("SELECT r.riskLevel, COUNT(r) FROM RiskScore r GROUP BY r.riskLevel")
    List<Object[]> getRiskStatistics();
    
    /**
     * Busca chaves suspeitas que podem precisar de investigação
     */
    @Query("SELECT r FROM RiskScore r WHERE r.riskLevel IN ('SUSPICIOUS', 'MEDIUM', 'HIGH', 'CRITICAL') " +
           "AND r.isBlocked = false ORDER BY r.currentScore DESC")
    List<RiskScore> findSuspiciousKeys();
}