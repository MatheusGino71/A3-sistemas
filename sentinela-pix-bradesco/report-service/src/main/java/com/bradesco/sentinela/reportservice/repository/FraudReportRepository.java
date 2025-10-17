package com.bradesco.sentinela.reportservice.repository;

import com.bradesco.sentinela.reportservice.model.FraudReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FraudReportRepository extends JpaRepository<FraudReport, Long> {

    /**
     * Busca todas as denúncias para uma chave PIX específica
     */
    List<FraudReport> findByReportedPixKey(String pixKey);

    /**
     * Conta o número de denúncias para uma chave PIX específica
     */
    long countByReportedPixKey(String pixKey);

    /**
     * Busca denúncias por chave PIX ordenadas por data (mais recentes primeiro)
     */
    List<FraudReport> findByReportedPixKeyOrderByTimestampDesc(String pixKey);

    /**
     * Busca denúncias por categoria de golpe
     */
    List<FraudReport> findByScamCategoryContainingIgnoreCase(String category);

    /**
     * Busca denúncias criadas após uma data específica
     */
    @Query("SELECT fr FROM FraudReport fr WHERE fr.timestamp >= :fromDate")
    List<FraudReport> findReportsFromDate(@Param("fromDate") LocalDateTime fromDate);
}