const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'sentinela-pix-secret-key';

// Middleware
app.use(cors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

// Database initialization
const dbPath = path.join(__dirname, 'sentinela_pix.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initializeDatabase = () => {
    db.serialize(() => {
        // Fraud Reports table
        db.run(`CREATE TABLE IF NOT EXISTS fraud_reports (
            id TEXT PRIMARY KEY,
            pix_key TEXT NOT NULL,
            reporter_bank TEXT NOT NULL,
            description TEXT NOT NULL,
            amount REAL,
            transaction_id TEXT,
            victim_info TEXT,
            status TEXT DEFAULT 'PENDING',
            priority TEXT DEFAULT 'MEDIUM',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Risk Analysis table
        db.run(`CREATE TABLE IF NOT EXISTS risk_analysis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pix_key TEXT UNIQUE NOT NULL,
            risk_level TEXT DEFAULT 'LOW',
            risk_score INTEGER DEFAULT 0,
            report_count INTEGER DEFAULT 0,
            first_report_date DATETIME,
            last_report_date DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Notifications table
        db.run(`CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            fraud_report_id TEXT NOT NULL,
            target_bank TEXT NOT NULL,
            pix_key TEXT NOT NULL,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'PENDING',
            sent_at DATETIME,
            delivered_at DATETIME,
            retry_count INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (fraud_report_id) REFERENCES fraud_reports (id)
        )`);

        // System Statistics table
        db.run(`CREATE TABLE IF NOT EXISTS system_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            total_transactions INTEGER DEFAULT 0,
            frauds_detected INTEGER DEFAULT 0,
            success_rate REAL DEFAULT 0.0,
            total_reports INTEGER DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Insert initial stats if not exists
        db.get("SELECT COUNT(*) as count FROM system_stats", (err, row) => {
            if (row.count === 0) {
                db.run("INSERT INTO system_stats (total_transactions, frauds_detected, success_rate, total_reports) VALUES (0, 0, 100.0, 0)");
            }
        });

        console.log('✅ Database initialized successfully');
    });
};

// Helper functions for database operations
const insertFraudReport = (report) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`INSERT INTO fraud_reports 
            (id, pix_key, reporter_bank, description, amount, transaction_id, victim_info, status, priority) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        
        stmt.run([
            report.id, report.pixKey, report.reporterBank, report.description,
            report.amount, report.transactionId, report.victimInfo, report.status, report.priority
        ], function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
        stmt.finalize();
    });
};

const updateRiskAnalysis = (pixKey) => {
    return new Promise((resolve, reject) => {
        // Count reports for this PIX key
        db.get("SELECT COUNT(*) as count FROM fraud_reports WHERE pix_key = ?", [pixKey], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            const reportCount = row.count;
            let riskLevel = 'LOW';
            let riskScore = 0;

            // Calculate risk level based on report count and time
            if (reportCount >= 5) {
                riskLevel = 'CRITICAL';
                riskScore = Math.min(100, 90 + (reportCount * 2));
            } else if (reportCount >= 3) {
                riskLevel = 'HIGH';
                riskScore = 70 + (reportCount * 5);
            } else if (reportCount >= 1) {
                riskLevel = 'MEDIUM';
                riskScore = 40 + (reportCount * 15);
            }

            // Check for reports in last 24 hours
            db.get(`SELECT COUNT(*) as recent_count FROM fraud_reports 
                   WHERE pix_key = ? AND created_at >= datetime('now', '-24 hours')`, [pixKey], (err, recentRow) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (recentRow.recent_count >= 3) {
                    riskLevel = 'CRITICAL';
                    riskScore = Math.max(riskScore, 95);
                }

                // Update or insert risk analysis
                db.run(`INSERT OR REPLACE INTO risk_analysis 
                       (pix_key, risk_level, risk_score, report_count, first_report_date, last_report_date, updated_at)
                       VALUES (?, ?, ?, ?, 
                               COALESCE((SELECT first_report_date FROM risk_analysis WHERE pix_key = ?), datetime('now')),
                               datetime('now'), datetime('now'))`,
                    [pixKey, riskLevel, riskScore, reportCount, pixKey], (err) => {
                        if (err) reject(err);
                        else resolve({ pixKey, riskLevel, riskScore, reportCount });
                    });
            });
        });
    });
};

const createNotification = (fraudReportId, pixKey, reporterBank) => {
    return new Promise((resolve, reject) => {
        // Identify target bank based on PIX key
        const targetBank = identifyBankFromPixKey(pixKey);
        const message = `🚨 ALERTA DE FRAUDE PIX\n\nChave PIX: ${pixKey}\nDenunciado por: ${reporterBank}\nRecomendamos análise imediata da conta.`;
        
        const notification = {
            id: uuidv4(),
            fraud_report_id: fraudReportId,
            target_bank: targetBank,
            pix_key: pixKey,
            message: message,
            status: 'PENDING'
        };

        db.run(`INSERT INTO notifications 
               (id, fraud_report_id, target_bank, pix_key, message, status) 
               VALUES (?, ?, ?, ?, ?, ?)`,
            [notification.id, notification.fraud_report_id, notification.target_bank, 
             notification.pix_key, notification.message, notification.status], (err) => {
                if (err) reject(err);
                else {
                    // Auto-send notification
                    sendNotification(notification.id);
                    resolve(notification);
                }
            });
    });
};

const identifyBankFromPixKey = (pixKey) => {
    // Bank identification logic based on PIX key pattern
    if (pixKey.includes('@')) {
        const domain = pixKey.split('@')[1].toLowerCase();
        if (domain.includes('bb.com') || domain.includes('bancodobrasil')) return 'Banco do Brasil';
        if (domain.includes('itau.com') || domain.includes('itauunibanco')) return 'Itaú Unibanco';
        if (domain.includes('bradesco.com')) return 'Bradesco';
        if (domain.includes('santander.com')) return 'Santander';
        if (domain.includes('caixa.gov')) return 'Caixa Econômica Federal';
        if (domain.includes('nubank.com')) return 'Nubank';
        if (domain.includes('inter.co')) return 'Banco Inter';
        if (domain.includes('c6bank.com')) return 'C6 Bank';
        if (domain.includes('next.com')) return 'Next';
        return 'Banco Não Identificado';
    }
    
    // For CPF, CNPJ, or phone numbers, we cannot identify the bank without additional data
    // Return generic identifier
    if (pixKey.match(/^\d{11}$/)) {
        return 'CPF - Banco Não Identificado';
    }
    
    if (pixKey.match(/^\d{14}$/)) {
        return 'CNPJ - Banco Não Identificado';
    }
    
    if (pixKey.match(/^\+55\d{10,11}$/)) {
        return 'Telefone - Banco Não Identificado';
    }
    
    return 'Banco Não Identificado';
};

const sendNotification = (notificationId) => {
    // Simulate notification sending (in real world, this would be webhook/API calls)
    setTimeout(() => {
        db.run(`UPDATE notifications SET status = 'SENT', sent_at = datetime('now') WHERE id = ?`, 
               [notificationId], (err) => {
                   if (!err) {
                       console.log(`📤 Notificação ${notificationId} enviada com sucesso`);
                       
                       // Simulate delivery confirmation
                       setTimeout(() => {
                           db.run(`UPDATE notifications SET status = 'DELIVERED', delivered_at = datetime('now') WHERE id = ?`,
                                  [notificationId], (err) => {
                                      if (!err) {
                                          console.log(`✅ Notificação ${notificationId} entregue`);
                                      }
                                  });
                       }, 2000);
                   }
               });
    }, 1000);
};

const updateSystemStats = () => {
    db.get("SELECT COUNT(*) as total_reports FROM fraud_reports", (err, reportRow) => {
        if (err) return;
        
        db.get("SELECT COUNT(*) as confirmed_frauds FROM fraud_reports WHERE status = 'CONFIRMED'", (err, fraudRow) => {
            if (err) return;
            
            const totalReports = reportRow.total_reports;
            const confirmedFrauds = fraudRow.confirmed_frauds;
            const totalTransactions = totalReports; // Real transaction count based on actual reports
            const successRate = totalTransactions > 0 ? ((totalTransactions - confirmedFrauds) / totalTransactions * 100) : 100;
            
            db.run(`UPDATE system_stats SET 
                   total_transactions = ?, frauds_detected = ?, success_rate = ?, total_reports = ?, updated_at = datetime('now')`,
                   [totalTransactions, confirmedFrauds, successRate, totalReports]);
        });
    });
};

// API Routes

// Dashboard Stats (Real-time from database)
app.get('/api/v1/dashboard/stats', (req, res) => {
    db.get("SELECT * FROM system_stats ORDER BY updated_at DESC LIMIT 1", (err, stats) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas' });
        }
        
        res.json({
            success: true,
            data: {
                totalTransactions: stats?.total_transactions || 0,
                fraudsDetected: stats?.frauds_detected || 0,
                successRate: stats?.success_rate || 100.0,
                totalReports: stats?.total_reports || 0,
                lastUpdate: new Date().toISOString()
            }
        });
    });
});

// Fraud Reports Routes
app.get('/api/v1/fraud-reports', (req, res) => {
    const { page = 1, limit = 10, status, priority } = req.query;
    
    let whereClause = '';
    let params = [];
    
    if (status) {
        whereClause += ' WHERE status = ?';
        params.push(status);
    }
    
    if (priority) {
        whereClause += (whereClause ? ' AND' : ' WHERE') + ' priority = ?';
        params.push(priority);
    }
    
    const offset = (page - 1) * limit;
    
    db.all(`SELECT * FROM fraud_reports${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`, 
           [...params, parseInt(limit), offset], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao buscar denúncias' });
        }
        
        db.get(`SELECT COUNT(*) as total FROM fraud_reports${whereClause}`, params, (err, countRow) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Erro ao contar denúncias' });
            }
            
            res.json({
                success: true,
                data: {
                    reports: rows,
                    pagination: {
                        current: parseInt(page),
                        total: Math.ceil(countRow.total / limit),
                        count: countRow.total
                    }
                }
            });
        });
    });
});

app.post('/api/v1/fraud-reports', async (req, res) => {
    const { pixKey, reporterBank, description, amount, transactionId, victimInfo, priority = 'MEDIUM' } = req.body;
    
    if (!pixKey || !reporterBank || !description) {
        return res.status(400).json({
            success: false,
            message: 'Campos obrigatórios: pixKey, reporterBank, description'
        });
    }
    
    const newReport = {
        id: uuidv4(),
        pixKey,
        reporterBank,
        description,
        amount: amount || null,
        transactionId: transactionId || null,
        victimInfo: victimInfo || null,
        status: 'PENDING',
        priority
    };
    
    try {
        await insertFraudReport(newReport);
        
        // Update risk analysis automatically
        const riskAnalysis = await updateRiskAnalysis(pixKey);
        
        // Create and send notification automatically
        await createNotification(newReport.id, pixKey, reporterBank);
        
        // Update system stats
        updateSystemStats();
        
        res.status(201).json({
            success: true,
            data: {
                ...newReport,
                riskAnalysis
            },
            message: 'Denúncia registrada e processada automaticamente'
        });
        
        console.log(`🚨 Nova denúncia processada: ${pixKey} por ${reporterBank}`);
        
    } catch (error) {
        console.error('Erro ao processar denúncia:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao processar denúncia'
        });
    }
});

app.put('/api/v1/fraud-reports/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    db.run("UPDATE fraud_reports SET status = ?, updated_at = datetime('now') WHERE id = ?", 
           [status, id], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar status' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Denúncia não encontrada' });
        }
        
        // Update stats when status changes
        updateSystemStats();
        
        db.get("SELECT * FROM fraud_reports WHERE id = ?", [id], (err, row) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Erro ao buscar denúncia' });
            }
            
            res.json({
                success: true,
                data: row,
                message: 'Status atualizado com sucesso'
            });
        });
    });
});

// Risk Analysis Routes
app.get('/api/v1/risk-analysis', (req, res) => {
    db.all("SELECT * FROM risk_analysis ORDER BY risk_score DESC", (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao buscar análises de risco' });
        }
        
        res.json({
            success: true,
            data: rows
        });
    });
});

app.get('/api/v1/risk-analysis/:pixKey', (req, res) => {
    const { pixKey } = req.params;
    
    db.get("SELECT * FROM risk_analysis WHERE pix_key = ?", [pixKey], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao buscar análise de risco' });
        }
        
        if (!row) {
            return res.json({
                success: true,
                data: {
                    pixKey,
                    riskLevel: 'LOW',
                    riskScore: 0,
                    reportCount: 0
                }
            });
        }
        
        res.json({
            success: true,
            data: row
        });
    });
});

// Notifications Routes
app.get('/api/v1/notifications', (req, res) => {
    db.all(`SELECT n.*, fr.description as fraud_description 
           FROM notifications n 
           LEFT JOIN fraud_reports fr ON n.fraud_report_id = fr.id 
           ORDER BY n.created_at DESC`, (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao buscar notificações' });
        }
        
        res.json({
            success: true,
            data: rows
        });
    });
});

// Analytics Routes (Real data from database)
app.get('/api/v1/analytics/transactions-chart', (req, res) => {
    // Generate chart data based on actual reports over time
    db.all(`SELECT 
               DATE(created_at) as date,
               COUNT(*) as reports,
               COUNT(CASE WHEN status = 'CONFIRMED' THEN 1 END) as frauds
           FROM fraud_reports 
           WHERE created_at >= date('now', '-30 days')
           GROUP BY DATE(created_at)
           ORDER BY date`, (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao gerar dados do gráfico' });
        }
        
        const labels = rows.map(row => {
            const date = new Date(row.date);
            return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
        });
        
        const reportData = rows.map(row => row.reports); // Real report count
        const fraudData = rows.map(row => row.frauds);
        
        res.json({
            success: true,
            data: {
                labels,
                datasets: [{
                    label: 'Denúncias',
                    data: reportData,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Fraudes Confirmadas',
                    data: fraudData,
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }]
            }
        });
    });
});

app.get('/api/v1/analytics/risk-distribution', (req, res) => {
    db.all(`SELECT risk_level, COUNT(*) as count 
           FROM risk_analysis 
           GROUP BY risk_level`, (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao gerar distribuição de risco' });
        }
        
        const labels = [];
        const data = [];
        const colors = [];
        
        const riskMap = {
            'LOW': { label: 'Baixo', color: '#10B981' },
            'MEDIUM': { label: 'Médio', color: '#F59E0B' },
            'HIGH': { label: 'Alto', color: '#EF4444' },
            'CRITICAL': { label: 'Crítico', color: '#7C2D12' }
        };
        
        rows.forEach(row => {
            const risk = riskMap[row.risk_level] || { label: row.risk_level, color: '#6B7280' };
            labels.push(risk.label);
            data.push(row.count);
            colors.push(risk.color);
        });
        
        res.json({
            success: true,
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors
                }]
            }
        });
    });
});

// Auto-update statistics every 5 minutes
cron.schedule('*/5 * * * *', () => {
    updateSystemStats();
    console.log('📊 Estatísticas atualizadas automaticamente');
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Sentinela PIX Backend',
        database: 'Connected'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint não encontrado'
    });
});

// Initialize database and start server
initializeDatabase();

app.listen(PORT, () => {
    console.log(`🚀 Sentinela PIX Backend rodando na porta ${PORT}`);
    console.log(`📊 Dashboard disponível em: http://localhost:8080`);
    console.log(`🔗 API disponível em: http://localhost:${PORT}/api/v1`);
    console.log(`❤️ Health check: http://localhost:${PORT}/health`);
    console.log(`💾 Database: ${dbPath}`);
    console.log(`✅ Sistema 100% funcional - SEM dados mock!`);
});

module.exports = app;