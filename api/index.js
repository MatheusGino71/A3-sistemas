const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// Importar validações
const { validateFraudReport } = require('../backend/middleware/validation');
const { reportLimiter, authLimiter, apiLimiter } = require('../backend/middleware/rateLimiter');

const app = express();

// Inicializar Firebase Admin (apenas uma vez)
if (!admin.apps.length) {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : require('../backend/firebase-service-account.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    console.log('✅ Firebase Admin inicializado');
  } catch (error) {
    console.error('❌ Erro Firebase:', error.message);
  }
}

const db = admin.firestore();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function getFromCache(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ==================== ROUTES ====================

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    firebase: admin.apps.length > 0 ? 'connected' : 'disconnected'
  });
});

// Criar denúncia
app.post('/api/v1/fraud-reports', reportLimiter, validateFraudReport, async (req, res) => {
  try {
    const { pixKey, reporterBank, description, amount, priority } = req.body;

    const report = {
      id: uuidv4(),
      pixKey,
      reporterBank,
      description,
      amount: amount || 0,
      status: 'pending',
      priority: priority || 'medium',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('fraudReports').doc(report.id).set(report);

    const notification = {
      id: uuidv4(),
      type: 'fraud_report',
      title: 'Nova Denúncia de Fraude PIX',
      message: `Chave PIX ${pixKey} denunciada pelo banco ${reporterBank}`,
      fraudReportId: report.id,
      read_at: null,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('notifications').doc(notification.id).set(notification);
    cache.clear();

    res.status(201).json({
      success: true,
      data: { ...report, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar denúncia' });
  }
});

// Listar denúncias
app.get('/api/v1/fraud-reports', apiLimiter, async (req, res) => {
  const cacheKey = `reports:${JSON.stringify(req.query)}`;
  const cached = getFromCache(cacheKey);
  
  if (cached) return res.json(cached);

  try {
    const { status, priority, limit = 50 } = req.query;
    let query = db.collection('fraudReports').orderBy('createdAt', 'desc');
    
    if (status) query = query.where('status', '==', status);
    if (priority) query = query.where('priority', '==', priority);
    query = query.limit(parseInt(limit));
    
    const snapshot = await query.get();
    const reports = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      reports.push({
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });

    const response = { success: true, count: reports.length, data: reports };
    setCache(cacheKey, response);
    res.json(response);

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar denúncias' });
  }
});

// Buscar denúncia por ID
app.get('/api/v1/fraud-reports/:id', apiLimiter, async (req, res) => {
  try {
    const doc = await db.collection('fraudReports').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Denúncia não encontrada' });
    }

    const data = doc.data();
    res.json({
      success: true,
      data: {
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar denúncia' });
  }
});

// Listar notificações
app.get('/api/v1/notifications', apiLimiter, async (req, res) => {
  const cacheKey = `notifications:${JSON.stringify(req.query)}`;
  const cached = getFromCache(cacheKey);
  
  if (cached) return res.json(cached);

  try {
    const { unread, limit = 50 } = req.query;
    let query = db.collection('notifications').orderBy('created_at', 'desc');
    
    if (unread === 'true') query = query.where('read_at', '==', null);
    query = query.limit(parseInt(limit));
    
    const snapshot = await query.get();
    const notifications = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      notifications.push({
        ...data,
        created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        read_at: data.read_at?.toDate?.()?.toISOString() || null
      });
    });

    const response = { success: true, count: notifications.length, data: notifications };
    setCache(cacheKey, response);
    res.json(response);

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar notificações' });
  }
});

// Dashboard Stats
app.get('/api/v1/dashboard/stats', apiLimiter, async (req, res) => {
  const cached = getFromCache('stats');
  if (cached) return res.json(cached);

  try {
    const [reportsSnapshot, notificationsSnapshot] = await Promise.all([
      db.collection('fraudReports').get(),
      db.collection('notifications').get()
    ]);

    const reports = [];
    reportsSnapshot.forEach(doc => reports.push(doc.data()));

    const notifications = [];
    notificationsSnapshot.forEach(doc => notifications.push(doc.data()));

    const stats = {
      totalReports: reports.length,
      pendingReports: reports.filter(r => r.status === 'pending').length,
      investigatingReports: reports.filter(r => r.status === 'investigating').length,
      confirmedReports: reports.filter(r => r.status === 'confirmed').length,
      rejectedReports: reports.filter(r => r.status === 'rejected').length,
      criticalReports: reports.filter(r => r.priority === 'critical').length,
      highPriorityReports: reports.filter(r => r.priority === 'high').length,
      unreadNotifications: notifications.filter(n => !n.read_at).length,
      lastUpdate: new Date().toISOString()
    };

    const response = { success: true, data: stats };
    setCache('stats', response);
    res.json(response);

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas' });
  }
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ success: false, message: 'Erro interno' });
});

module.exports = app;
