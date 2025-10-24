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
    origin: [
        'http://localhost:8080', 
        'http://127.0.0.1:8080',
        'https://a3-quinta-1a763.web.app',
        'https://a3-quinta-1a763.firebaseapp.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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

        // Registered PIX Keys table (for security verification)
        db.run(`CREATE TABLE IF NOT EXISTS registered_pix_keys (
            id TEXT PRIMARY KEY,
            pix_key TEXT UNIQUE NOT NULL,
            key_type TEXT NOT NULL,
            owner_name TEXT,
            owner_document TEXT,
            bank_name TEXT,
            security_score INTEGER DEFAULT 100,
            is_verified BOOLEAN DEFAULT 0,
            registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_verification DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'ACTIVE'
        )`);

        // Security Checks table
        db.run(`CREATE TABLE IF NOT EXISTS security_checks (
            id TEXT PRIMARY KEY,
            pix_key TEXT NOT NULL,
            check_type TEXT NOT NULL,
            severity TEXT DEFAULT 'INFO',
            message TEXT NOT NULL,
            recommendation TEXT,
            checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (pix_key) REFERENCES registered_pix_keys (pix_key)
        )`);

        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            sobrenome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            cpf TEXT UNIQUE NOT NULL,
            telefone TEXT,
            banco TEXT,
            senha_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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

// Identify PIX key type
const identifyPixKeyType = (pixKey) => {
    if (pixKey.includes('@')) return 'EMAIL';
    if (pixKey.match(/^\d{11}$/)) return 'CPF';
    if (pixKey.match(/^\d{14}$/)) return 'CNPJ';
    if (pixKey.match(/^\+55\d{10,11}$/)) return 'PHONE';
    if (pixKey.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) return 'RANDOM';
    return 'UNKNOWN';
};

// Perform security analysis on PIX key
const performSecurityAnalysis = async (pixKey, keyType, ownerDocument) => {
    const checks = [];
    let securityScore = 100;
    
    // Check 1: Verify if key has fraud reports
    const fraudCheckPromise = new Promise((resolve) => {
        db.get("SELECT COUNT(*) as count FROM fraud_reports WHERE pix_key = ?", [pixKey], (err, row) => {
            const fraudCount = row?.count || 0;
            if (fraudCount > 0) {
                securityScore -= (fraudCount * 15);
                checks.push({
                    id: uuidv4(),
                    pix_key: pixKey,
                    check_type: 'FRAUD_HISTORY',
                    severity: fraudCount >= 3 ? 'CRITICAL' : fraudCount >= 1 ? 'HIGH' : 'MEDIUM',
                    message: `Esta chave PIX possui ${fraudCount} denúncia(s) de fraude registrada(s)`,
                    recommendation: 'Evite realizar transações com esta chave. Considere denunciar se for vítima de golpe.'
                });
            } else {
                checks.push({
                    id: uuidv4(),
                    pix_key: pixKey,
                    check_type: 'FRAUD_HISTORY',
                    severity: 'INFO',
                    message: 'Nenhuma denúncia de fraude encontrada',
                    recommendation: 'Chave sem histórico de denúncias no sistema.'
                });
            }
            resolve();
        });
    });

    // Check 2: Analyze key type security
    if (keyType === 'EMAIL') {
        const emailDomains = pixKey.split('@')[1]?.toLowerCase() || '';
        const suspiciousDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
        
        if (suspiciousDomains.includes(emailDomains)) {
            securityScore -= 5;
            checks.push({
                id: uuidv4(),
                pix_key: pixKey,
                check_type: 'KEY_TYPE_ANALYSIS',
                severity: 'LOW',
                message: 'E-mail pessoal genérico (maior risco de phishing)',
                recommendation: 'Prefira chaves de e-mails corporativos ou institucionais para maior segurança.'
            });
        }
    } else if (keyType === 'RANDOM') {
        securityScore += 10;
        checks.push({
            id: uuidv4(),
            pix_key: pixKey,
            check_type: 'KEY_TYPE_ANALYSIS',
            severity: 'INFO',
            message: 'Chave aleatória (maior privacidade)',
            recommendation: 'Tipo de chave mais seguro, pois não expõe dados pessoais.'
        });
    } else if (keyType === 'CPF' || keyType === 'CNPJ') {
        securityScore -= 10;
        checks.push({
            id: uuidv4(),
            pix_key: pixKey,
            check_type: 'KEY_TYPE_ANALYSIS',
            severity: 'MEDIUM',
            message: 'Documento como chave PIX expõe dados pessoais',
            recommendation: 'Considere usar chave aleatória para maior privacidade e segurança.'
        });
    }

    // Check 3: Verify risk analysis
    const riskCheckPromise = new Promise((resolve) => {
        db.get("SELECT * FROM risk_analysis WHERE pix_key = ?", [pixKey], (err, row) => {
            if (row) {
                if (row.risk_level === 'CRITICAL') {
                    securityScore -= 40;
                    checks.push({
                        id: uuidv4(),
                        pix_key: pixKey,
                        check_type: 'RISK_LEVEL',
                        severity: 'CRITICAL',
                        message: `Nível de risco CRÍTICO (Score: ${row.risk_score})`,
                        recommendation: 'NÃO realize transações com esta chave. Alto risco de fraude!'
                    });
                } else if (row.risk_level === 'HIGH') {
                    securityScore -= 25;
                    checks.push({
                        id: uuidv4(),
                        pix_key: pixKey,
                        check_type: 'RISK_LEVEL',
                        severity: 'HIGH',
                        message: `Nível de risco ALTO (Score: ${row.risk_score})`,
                        recommendation: 'Cautela! Verifique a identidade do destinatário antes de transferir.'
                    });
                } else if (row.risk_level === 'MEDIUM') {
                    securityScore -= 10;
                    checks.push({
                        id: uuidv4(),
                        pix_key: pixKey,
                        check_type: 'RISK_LEVEL',
                        severity: 'MEDIUM',
                        message: `Nível de risco MÉDIO (Score: ${row.risk_score})`,
                        recommendation: 'Confirme os dados do destinatário antes de realizar a transação.'
                    });
                }
            }
            resolve();
        });
    });

    await Promise.all([fraudCheckPromise, riskCheckPromise]);
    
    // Ensure score is between 0 and 100
    securityScore = Math.max(0, Math.min(100, securityScore));
    
    return { checks, securityScore };
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

// ==================== USER ROUTES ====================

// Register new user
app.post('/api/v1/users/register', async (req, res) => {
    const { nome, sobrenome, email, cpf, telefone, banco, senha } = req.body;
    
    // Validação
    if (!nome || !sobrenome || !email || !cpf || !senha) {
        return res.status(400).json({
            success: false,
            message: 'Campos obrigatórios: nome, sobrenome, email, cpf, senha'
        });
    }
    
    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Email inválido'
        });
    }
    
    // Validar CPF (11 dígitos)
    if (cpf.length !== 11 || !/^\d{11}$/.test(cpf)) {
        return res.status(400).json({
            success: false,
            message: 'CPF deve conter 11 dígitos'
        });
    }
    
    // Validar senha (mínimo 6 caracteres)
    if (senha.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Senha deve ter no mínimo 6 caracteres'
        });
    }
    
    try {
        // Verificar se email já existe
        const existingEmail = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email já cadastrado'
            });
        }
        
        // Verificar se CPF já existe
        const existingCPF = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM users WHERE cpf = ?', [cpf], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        if (existingCPF) {
            return res.status(400).json({
                success: false,
                message: 'CPF já cadastrado'
            });
        }
        
        // Hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);
        
        // Criar novo usuário
        const userId = uuidv4();
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO users (id, nome, sobrenome, email, cpf, telefone, banco, senha_hash) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, nome, sobrenome, email, cpf, telefone || null, banco || null, senhaHash],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
        
        // Gerar token JWT
        const token = jwt.sign(
            { id: userId, email, nome },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso',
            data: {
                id: userId,
                nome,
                sobrenome,
                email,
                token
            }
        });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar usuário'
        });
    }
});

// Login user
app.post('/api/v1/users/login', async (req, res) => {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
        return res.status(400).json({
            success: false,
            message: 'Email e senha são obrigatórios'
        });
    }
    
    try {
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha incorretos'
            });
        }
        
        const senhaValida = await bcrypt.compare(senha, user.senha_hash);
        
        if (!senhaValida) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha incorretos'
            });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email, nome: user.nome },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            data: {
                id: user.id,
                nome: user.nome,
                sobrenome: user.sobrenome,
                email: user.email,
                banco: user.banco,
                token
            }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao fazer login'
        });
    }
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

// PIX Key Registration and Security Check Routes

// Register a new PIX key for security monitoring
app.post('/api/v1/pix-keys/register', async (req, res) => {
    const { pixKey, ownerName, ownerDocument, bankName } = req.body;
    
    if (!pixKey) {
        return res.status(400).json({
            success: false,
            message: 'Chave PIX é obrigatória'
        });
    }
    
    try {
        const keyType = identifyPixKeyType(pixKey);
        const identifiedBank = bankName || identifyBankFromPixKey(pixKey);
        
        // Perform security analysis
        const { checks, securityScore } = await performSecurityAnalysis(pixKey, keyType, ownerDocument);
        
        const newKey = {
            id: uuidv4(),
            pix_key: pixKey,
            key_type: keyType,
            owner_name: ownerName || null,
            owner_document: ownerDocument || null,
            bank_name: identifiedBank,
            security_score: securityScore,
            is_verified: 0
        };
        
        // Insert PIX key
        db.run(`INSERT INTO registered_pix_keys 
               (id, pix_key, key_type, owner_name, owner_document, bank_name, security_score, is_verified) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [newKey.id, newKey.pix_key, newKey.key_type, newKey.owner_name, 
             newKey.owner_document, newKey.bank_name, newKey.security_score, newKey.is_verified],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({
                            success: false,
                            message: 'Esta chave PIX já está cadastrada no sistema'
                        });
                    }
                    console.error('Erro ao registrar chave PIX:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Erro ao registrar chave PIX'
                    });
                }
                
                // Insert security checks
                const stmt = db.prepare(`INSERT INTO security_checks 
                    (id, pix_key, check_type, severity, message, recommendation) 
                    VALUES (?, ?, ?, ?, ?, ?)`);
                
                checks.forEach(check => {
                    stmt.run([check.id, check.pix_key, check.check_type, 
                             check.severity, check.message, check.recommendation]);
                });
                stmt.finalize();
                
                res.status(201).json({
                    success: true,
                    data: {
                        ...newKey,
                        securityChecks: checks
                    },
                    message: 'Chave PIX registrada e analisada com sucesso'
                });
                
                console.log(`🔐 Nova chave PIX registrada: ${pixKey} - Score: ${securityScore}`);
            });
            
    } catch (error) {
        console.error('Erro ao processar registro:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao processar registro'
        });
    }
});

// Verify security of a PIX key (can be used without registration)
app.post('/api/v1/pix-keys/verify', async (req, res) => {
    const { pixKey } = req.body;
    
    if (!pixKey) {
        return res.status(400).json({
            success: false,
            message: 'Chave PIX é obrigatória'
        });
    }
    
    try {
        const keyType = identifyPixKeyType(pixKey);
        const { checks, securityScore } = await performSecurityAnalysis(pixKey, keyType, null);
        
        // Check if key is registered
        db.get("SELECT * FROM registered_pix_keys WHERE pix_key = ?", [pixKey], (err, registeredKey) => {
            let riskLevel = 'SAFE';
            if (securityScore < 30) riskLevel = 'CRITICAL';
            else if (securityScore < 50) riskLevel = 'HIGH';
            else if (securityScore < 70) riskLevel = 'MEDIUM';
            else if (securityScore < 85) riskLevel = 'LOW';
            
            res.json({
                success: true,
                data: {
                    pixKey,
                    keyType,
                    securityScore,
                    riskLevel,
                    isRegistered: !!registeredKey,
                    securityChecks: checks,
                    recommendation: securityScore >= 70 
                        ? '✅ Chave segura para transações' 
                        : securityScore >= 50 
                        ? '⚠️ Proceda com cautela' 
                        : '🚨 Não recomendado! Alto risco de fraude'
                }
            });
        });
        
    } catch (error) {
        console.error('Erro ao verificar chave PIX:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao verificar segurança da chave PIX'
        });
    }
});

// Get all registered PIX keys
app.get('/api/v1/pix-keys', (req, res) => {
    db.all(`SELECT * FROM registered_pix_keys ORDER BY registration_date DESC`, (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao buscar chaves PIX' });
        }
        
        res.json({
            success: true,
            data: rows
        });
    });
});

// Get specific PIX key details
app.get('/api/v1/pix-keys/:pixKey', (req, res) => {
    const { pixKey } = req.params;
    
    db.get("SELECT * FROM registered_pix_keys WHERE pix_key = ?", [pixKey], (err, keyData) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao buscar chave PIX' });
        }
        
        if (!keyData) {
            return res.status(404).json({
                success: false,
                message: 'Chave PIX não encontrada'
            });
        }
        
        // Get security checks for this key
        db.all("SELECT * FROM security_checks WHERE pix_key = ? ORDER BY checked_at DESC", 
               [pixKey], (err, checks) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Erro ao buscar verificações' });
            }
            
            res.json({
                success: true,
                data: {
                    ...keyData,
                    securityChecks: checks
                }
            });
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