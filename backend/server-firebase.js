const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');
const admin = require('firebase-admin');

// Importar métricas e middleware
const { 
  register, 
  metricsMiddleware, 
  incrementWsConnections, 
  decrementWsConnections,
  recordFraudReport,
  recordRiskAnalysis,
  recordError
} = require('./utils/metrics');

// Importar validações
const { validateFraudReport } = require('./middleware/validation');
const { reportLimiter, loginLimiter, generalLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3001;

// Inicializar Firebase Admin
try {
  // Tentar carregar service account do arquivo ou variáveis de ambiente
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : require('./firebase-service-account.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });

  console.log('✅ Firebase Admin inicializado com sucesso');
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase Admin:', error.message);
  console.log('⚠️  Continuando sem Firebase Admin - funcionalidades limitadas');
}

const db = admin.firestore();

// Criar servidor HTTP
const server = http.createServer(app);

// Configurar WebSocket Server
const wss = new WebSocket.Server({ server, path: '/ws' });

// Armazenar conexões de usuários
const userConnections = new Map();

wss.on('connection', (ws) => {
    console.log('🔌 Nova conexão WebSocket estabelecida');
    incrementWsConnections();
    let userId = null;

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'identify') {
                userId = data.userId;
                userConnections.set(userId, ws);
                console.log(`✅ Usuário ${userId} conectado via WebSocket`);
                
                ws.send(JSON.stringify({
                    type: 'connected',
                    message: 'WebSocket conectado com sucesso'
                }));
            }
        } catch (error) {
            console.error('Erro ao processar mensagem WebSocket:', error);
            recordError('websocket_message', 'error');
        }
    });

    ws.on('close', () => {
        if (userId) {
            userConnections.delete(userId);
            console.log(`❌ Usuário ${userId} desconectado`);
        }
        decrementWsConnections();
        console.log('🔌 Conexão WebSocket fechada');
    });

    ws.on('error', (error) => {
        console.error('Erro no WebSocket:', error);
        recordError('websocket_error', 'error');
    });
});

// Função para enviar notificação via WebSocket
function sendNotificationViaWebSocket(userId, notification) {
    const userWs = userConnections.get(userId);
    if (userWs && userWs.readyState === WebSocket.OPEN) {
        userWs.send(JSON.stringify({
            type: 'notification',
            notification: notification
        }));
        return true;
    }
    return false;
}

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(metricsMiddleware);

// Cache em memória simples
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getCacheKey(path) {
    return path;
}

function getFromCache(key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`📦 Cache HIT: ${key}`);
        return cached.data;
    }
    console.log(`💨 Cache MISS: ${key}`);
    return null;
}

function setCache(key, data) {
    cache.set(key, { data, timestamp: Date.now() });
}

function invalidateCache(pattern) {
    for (const key of cache.keys()) {
        if (key.includes(pattern)) {
            cache.delete(key);
        }
    }
}

// Limpeza de cache periódica
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
        if (now - value.timestamp >= CACHE_TTL) {
            cache.delete(key);
        }
    }
    console.log('🧹 Cache cleanup: itens antigos removidos');
}, 10 * 60 * 1000); // 10 minutos

// ==================== ROTAS DA API ====================

// Health Check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'ZENIT API',
        firebase: admin.apps.length > 0 ? 'connected' : 'disconnected'
    });
});

// Métricas Prometheus
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (error) {
        res.status(500).end(error);
    }
});

// ==================== FRAUD REPORTS ====================

// Criar denúncia de fraude
app.post('/api/v1/fraud-reports', reportLimiter, validateFraudReport, async (req, res) => {
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
        priority,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    try {
        // Salvar no Firestore
        await db.collection('fraudReports').doc(newReport.id).set(newReport);
        
        // Criar notificação
        const notification = {
            id: uuidv4(),
            type: 'fraud_report',
            title: 'Nova Denúncia de Fraude',
            message: `Denúncia registrada para chave PIX: ${pixKey}`,
            fraudReportId: newReport.id,
            pixKey: pixKey,
            read_at: null,
            created_at: admin.firestore.FieldValue.serverTimestamp()
        };
        
        await db.collection('notifications').doc(notification.id).set(notification);
        
        // Enviar via WebSocket para todos os usuários conectados
        userConnections.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'notification',
                    notification: {
                        ...notification,
                        created_at: new Date().toISOString()
                    }
                }));
            }
        });
        
        invalidateCache('fraud-reports');
        invalidateCache('dashboard');
        recordFraudReport(priority.toLowerCase());
        
        res.status(201).json({
            success: true,
            data: newReport,
            message: 'Denúncia registrada e processada automaticamente'
        });
        
        console.log(`🚨 Nova denúncia processada: ${pixKey} por ${reporterBank}`);
        
    } catch (error) {
        console.error('Erro ao processar denúncia:', error);
        recordError('fraud_report_creation', 'error');
        res.status(500).json({
            success: false,
            message: 'Erro interno ao processar denúncia'
        });
    }
});

// Listar denúncias
app.get('/api/v1/fraud-reports', generalLimiter, async (req, res) => {
    const cacheKey = getCacheKey(req.path);
    const cached = getFromCache(cacheKey);
    
    if (cached) {
        return res.json(cached);
    }

    try {
        const snapshot = await db.collection('fraudReports')
            .orderBy('createdAt', 'desc')
            .limit(100)
            .get();
        
        const reports = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            reports.push({
                ...data,
                createdAt: data.createdAt?.toDate().toISOString(),
                updatedAt: data.updatedAt?.toDate().toISOString()
            });
        });
        
        const response = {
            success: true,
            data: reports
        };
        
        setCache(cacheKey, response);
        res.json(response);
        
    } catch (error) {
        console.error('Erro ao buscar denúncias:', error);
        recordError('fraud_reports_fetch', 'error');
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar denúncias'
        });
    }
});

// Buscar denúncia por ID
app.get('/api/v1/fraud-reports/:id', generalLimiter, async (req, res) => {
    const { id } = req.params;
    
    try {
        const doc = await db.collection('fraudReports').doc(id).get();
        
        if (!doc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Denúncia não encontrada'
            });
        }
        
        const data = doc.data();
        res.json({
            success: true,
            data: {
                ...data,
                createdAt: data.createdAt?.toDate().toISOString(),
                updatedAt: data.updatedAt?.toDate().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Erro ao buscar denúncia:', error);
        recordError('fraud_report_fetch', 'error');
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar denúncia'
        });
    }
});

// ==================== NOTIFICATIONS ====================

// Listar notificações
app.get('/api/v1/notifications', generalLimiter, async (req, res) => {
    const { userId, limit = 50 } = req.query;
    
    try {
        let query = db.collection('notifications')
            .orderBy('created_at', 'desc')
            .limit(parseInt(limit));
        
        const snapshot = await query.get();
        
        const notifications = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            notifications.push({
                ...data,
                created_at: data.created_at?.toDate().toISOString(),
                read_at: data.read_at?.toDate().toISOString()
            });
        });
        
        res.json({
            success: true,
            notifications: notifications
        });
        
    } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        recordError('notifications_fetch', 'error');
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar notificações'
        });
    }
});

// Marcar notificação como lida
app.put('/api/v1/notifications/:id/read', generalLimiter, async (req, res) => {
    const { id } = req.params;
    
    try {
        await db.collection('notifications').doc(id).update({
            read_at: admin.firestore.FieldValue.serverTimestamp()
        });
        
        res.json({
            success: true,
            message: 'Notificação marcada como lida'
        });
        
    } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error);
        recordError('notification_mark_read', 'error');
        res.status(500).json({
            success: false,
            message: 'Erro ao marcar notificação como lida'
        });
    }
});

// Marcar todas como lidas
app.put('/api/v1/notifications/read-all', generalLimiter, async (req, res) => {
    try {
        const snapshot = await db.collection('notifications')
            .where('read_at', '==', null)
            .get();
        
        const batch = db.batch();
        snapshot.forEach(doc => {
            batch.update(doc.ref, {
                read_at: admin.firestore.FieldValue.serverTimestamp()
            });
        });
        
        await batch.commit();
        
        res.json({
            success: true,
            message: `${snapshot.size} notificações marcadas como lidas`
        });
        
    } catch (error) {
        console.error('Erro ao marcar todas as notificações como lidas:', error);
        recordError('notifications_mark_all_read', 'error');
        res.status(500).json({
            success: false,
            message: 'Erro ao marcar notificações como lidas'
        });
    }
});

// ==================== DASHBOARD STATS ====================

app.get('/api/v1/dashboard/stats', generalLimiter, async (req, res) => {
    const cacheKey = getCacheKey(req.path);
    const cached = getFromCache(cacheKey);
    
    if (cached) {
        return res.json(cached);
    }

    try {
        // Buscar estatísticas do Firestore
        const [reportsSnapshot, notificationsSnapshot] = await Promise.all([
            db.collection('fraudReports').get(),
            db.collection('notifications').get()
        ]);
        
        const totalReports = reportsSnapshot.size;
        const pendingReports = reportsSnapshot.docs.filter(doc => 
            doc.data().status === 'PENDING'
        ).length;
        
        const totalNotifications = notificationsSnapshot.size;
        const unreadNotifications = notificationsSnapshot.docs.filter(doc => 
            doc.data().read_at === null
        ).length;
        
        const stats = {
            totalReports,
            pendingReports,
            totalNotifications,
            unreadNotifications,
            timestamp: new Date().toISOString()
        };
        
        const response = {
            success: true,
            data: stats
        };
        
        setCache(cacheKey, response);
        res.json(response);
        
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        recordError('dashboard_stats_fetch', 'error');
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar estatísticas'
        });
    }
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    recordError('unhandled_error', 'error');
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
    });
});

// ==================== SERVER START ====================

server.listen(PORT, () => {
    console.log('🚀 ZENIT Backend rodando na porta', PORT);
    console.log('📊 Dashboard disponível em: http://localhost:8080');
    console.log('🔗 API disponível em: http://localhost:' + PORT + '/api/v1');
    console.log('🔌 WebSocket disponível em: ws://localhost:' + PORT + '/ws');
    console.log('❤️ Health check: http://localhost:' + PORT + '/health');
    console.log('🔥 Firebase Firestore: Conectado');
    console.log('✅ Sistema 100% funcional com Firebase!');
    console.log('🔔 Notificações em tempo real habilitadas via WebSocket');
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    recordError('unhandled_rejection', 'error');
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    recordError('uncaught_exception', 'error');
    process.exit(1);
});
