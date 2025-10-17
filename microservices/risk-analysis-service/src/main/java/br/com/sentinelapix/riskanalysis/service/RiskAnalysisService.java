package br.com.sentinelapix.riskanalysis.service;

import br.com.sentinelapix.riskanalysis.dto.FraudReportEventDTO;
import br.com.sentinelapix.riskanalysis.dto.RiskAnalysisDTO;
import br.com.sentinelapix.riskanalysis.model.RiskLevel;
import br.com.sentinelapix.riskanalysis.model.RiskScore;
import br.com.sentinelapix.riskanalysis.repository.RiskScoreRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RiskAnalysisService {
    
    private static final Logger logger = LoggerFactory.getLogger(RiskAnalysisService.class);
    
    @Autowired
    private RiskScoreRepository riskScoreRepository;
    
    /**
     * Analisa o risco de uma chave PIX baseado no histórico de denúncias
     */
    public RiskAnalysisDTO analyzeRisk(String pixKey) {
        logger.info("Iniciando análise de risco para chave PIX: {}", pixKey);
        
        RiskScore riskScore = getRiskScore(pixKey);
        recalculateRiskScore(riskScore);
        
        RiskAnalysisDTO analysis = new RiskAnalysisDTO();
        analysis.setPixKey(pixKey);
        analysis.setCurrentScore(riskScore.getCurrentScore());
        analysis.setRiskLevel(riskScore.getRiskLevel().name());
        analysis.setRiskDescription(riskScore.getRiskLevel().getDescription());
        analysis.setRecommendation(riskScore.getRiskLevel().getRecommendation());
        analysis.setTotalReports(riskScore.getTotalReports());
        analysis.setReports24h(riskScore.getReports24h());
        analysis.setReports7d(riskScore.getReports7d());
        analysis.setReports30d(riskScore.getReports30d());
        analysis.setIsBlocked(riskScore.getIsBlocked());
        analysis.setLastAnalysis(LocalDateTime.now());
        analysis.setRequiresBlocking(riskScore.getRiskLevel().requiresBlocking());
        analysis.setRequiresMonitoring(riskScore.getRiskLevel().requiresMonitoring());
        
        logger.info("Análise de risco concluída para chave PIX: {} - Score: {} - Nível: {}", 
                   pixKey, riskScore.getCurrentScore(), riskScore.getRiskLevel());
        
        return analysis;
    }
    
    /**
     * Processa uma nova denúncia e atualiza o score de risco
     */
    public RiskAnalysisDTO processFraudReport(FraudReportEventDTO fraudReport) {
        logger.info("Processando nova denúncia para análise de risco - Chave PIX: {}", 
                   fraudReport.getPixKey());
        
        RiskScore riskScore = getRiskScore(fraudReport.getPixKey());
        
        // Incrementa contadores
        riskScore.incrementReport(fraudReport.getAmount(), 
                                 fraudReport.getReporterBank(), 
                                 fraudReport.getReportedAt());
        
        // Recalcula score
        recalculateRiskScore(riskScore);
        
        // Salva no banco
        riskScore = riskScoreRepository.save(riskScore);
        
        // Verifica se precisa bloquear automaticamente
        if (riskScore.getRiskLevel().requiresBlocking() && !riskScore.getIsBlocked()) {
            blockPixKey(riskScore.getPixKey(), "Bloqueio automático por alto risco");
        }
        
        return analyzeRisk(fraudReport.getPixKey());
    }
    
    /**
     * Recalcula o score de risco baseado nas regras de negócio
     */
    private void recalculateRiskScore(RiskScore riskScore) {
        LocalDateTime now = LocalDateTime.now();
        String pixKey = riskScore.getPixKey();
        
        // Conta denúncias por período
        int reports24h = riskScoreRepository.countReportsInPeriod(pixKey, now.minusHours(24), now);
        int reports7d = riskScoreRepository.countReportsInPeriod(pixKey, now.minusDays(7), now);
        int reports30d = riskScoreRepository.countReportsInPeriod(pixKey, now.minusDays(30), now);
        int differentBanks = riskScoreRepository.countDistinctReporterBanks(pixKey);
        int highValueReports = riskScoreRepository.countHighValueReports(pixKey, 1000.0);
        
        // Atualiza contadores
        riskScore.setReports24h(reports24h);
        riskScore.setReports7d(reports7d);
        riskScore.setReports30d(reports30d);
        riskScore.setDifferentBanksCount(differentBanks);
        riskScore.setHighValueReports(highValueReports);
        
        // Calcula novo score baseado nas regras
        int newScore = calculateScore(reports24h, reports7d, reports30d, 
                                    differentBanks, highValueReports);
        
        riskScore.setCurrentScore(newScore);
        riskScore.setLastCalculation(now);
        
        logger.debug("Score recalculado para chave PIX: {} - Novo score: {} - " +
                    "Reports 24h: {}, 7d: {}, 30d: {}, Bancos diferentes: {}", 
                    pixKey, newScore, reports24h, reports7d, reports30d, differentBanks);
    }
    
    /**
     * Calcula o score baseado nas regras de negócio:
     * - 1 denúncia = 15 pontos (SUSPICIOUS)
     * - 3 denúncias em 24h = 65 pontos (HIGH)  
     * - 5+ denúncias em 7 dias = 85 pontos (CRITICAL)
     * - Múltiplos bancos = +20 pontos
     * - Valores altos = +10 pontos por denúncia
     */
    private int calculateScore(int reports24h, int reports7d, int reports30d, 
                              int differentBanks, int highValueReports) {
        int score = 0;
        
        // Score base por número de denúncias em 24h
        if (reports24h >= 3) {
            score += 65; // Alto risco
        } else if (reports24h >= 1) {
            score += 15; // Suspeita
        }
        
        // Score adicional por denúncias em 7 dias
        if (reports7d >= 5) {
            score += 20; // Pode elevar para crítico
        } else if (reports7d >= 3) {
            score += 10;
        }
        
        // Score adicional por múltiplos bancos denunciando
        if (differentBanks >= 3) {
            score += 20;
        } else if (differentBanks >= 2) {
            score += 10;
        }
        
        // Score adicional por valores altos
        score += Math.min(highValueReports * 10, 30); // Máximo 30 pontos
        
        // Score adicional por histórico de 30 dias
        if (reports30d >= 10) {
            score += 15;
        } else if (reports30d >= 5) {
            score += 5;
        }
        
        return Math.min(score, 100); // Score máximo 100
    }
    
    /**
     * Obtém ou cria um RiskScore para a chave PIX
     */
    private RiskScore getRiskScore(String pixKey) {
        Optional<RiskScore> existing = riskScoreRepository.findByPixKey(pixKey);
        if (existing.isPresent()) {
            return existing.get();
        } else {
            RiskScore newRiskScore = new RiskScore(pixKey);
            return riskScoreRepository.save(newRiskScore);
        }
    }
    
    /**
     * Bloqueia uma chave PIX
     */
    public void blockPixKey(String pixKey, String reason) {
        logger.warn("Bloqueando chave PIX: {} - Motivo: {}", pixKey, reason);
        
        RiskScore riskScore = getRiskScore(pixKey);
        riskScore.blockKey(reason);
        riskScoreRepository.save(riskScore);
    }
    
    /**
     * Desbloqueia uma chave PIX
     */
    public void unblockPixKey(String pixKey) {
        logger.info("Desbloqueando chave PIX: {}", pixKey);
        
        Optional<RiskScore> riskScore = riskScoreRepository.findByPixKey(pixKey);
        if (riskScore.isPresent()) {
            riskScore.get().unblockKey();
            riskScoreRepository.save(riskScore.get());
        }
    }
    
    /**
     * Lista chaves com alto risco
     */
    public List<RiskScore> getHighRiskKeys() {
        return riskScoreRepository.findByRiskLevelIn(
            List.of(RiskLevel.HIGH, RiskLevel.CRITICAL));
    }
    
    /**
     * Lista chaves bloqueadas
     */
    public List<RiskScore> getBlockedKeys() {
        return riskScoreRepository.findByIsBlockedTrue();
    }
}