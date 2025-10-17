const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

// Mock data storage
let fraudReports = [];
let riskAnalyses = [];
let notifications = [];
let stats = {
    totalTransactions: 15847,
    fraudsDetected: 234,
    successRate: 98.5,
    totalReports: 156
};

// Mock PIX keys database
const pixKeys = new Map();

// Initialize some mock data
const initializeMockData = () => {
    // Add some mock fraud reports
    fraudReports = [
        {
            id: uuidv4(),
            pixKey: 'usuario@fraudulento.com',
            reporterBank: 'Banco do Brasil',
            description: 'Usuário solicitou PIX e não entregou produto',
            status: 'UNDER_INVESTIGATION',
            priority: 'HIGH',
            createdAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            pixKey: '+5511999887766',
            reporterBank: 'Itaú',
            description: 'Possível golpe do PIX falso',
            status: 'CONFIRMED',
            priority: 'CRITICAL',
            createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
            id: uuidv4(),
            pixKey: '12345678901',
            reporterBank: 'Bradesco',
            description: 'Chave PIX suspeita de atividade fraudulenta',
            status: 'PENDING',
            priority: 'MEDIUM',
            createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
        }
    ];

    // Add mock risk analyses
    riskAnalyses = [
        { pixKey: 'usuario@fraudulento.com', riskLevel: 'HIGH', score: 85, reportCount: 3 },
        { pixKey: '+5511999887766', riskLevel: 'CRITICAL', score: 95, reportCount: 5 },
        { pixKey: '12345678901', riskLevel: 'MEDIUM', score: 60, reportCount: 1 }
    ];
};

// API Routes

// Dashboard Stats
app.get('/api/v1/dashboard/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            ...stats,
            lastUpdate: new Date().toISOString()
        }
    });
});

// Fraud Reports Routes
app.get('/api/v1/fraud-reports', (req, res) => {
    const { page = 1, limit = 10, status, priority } = req.query;
    
    let filteredReports = fraudReports;
    
    if (status) {
        filteredReports = filteredReports.filter(report => report.status === status);
    }
    
    if (priority) {
        filteredReports = filteredReports.filter(report => report.priority === priority);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedReports = filteredReports.slice(startIndex, endIndex);
    
    res.json({
        success: true,
        data: {
            reports: paginatedReports,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(filteredReports.length / limit),
                count: filteredReports.length
            }
        }
    });
});

app.post('/api/v1/fraud-reports', (req, res) => {
    const { pixKey, reporterBank, description, priority = 'MEDIUM' } = req.body;
    
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
        status: 'PENDING',
        priority,
        createdAt: new Date().toISOString()
    };
    
    fraudReports.unshift(newReport);
    stats.totalReports = fraudReports.length;
    
    // Update risk analysis
    updateRiskAnalysis(pixKey);
    
    res.status(201).json({
        success: true,
        data: newReport,
        message: 'Denúncia registrada com sucesso'
    });
});

app.put('/api/v1/fraud-reports/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const reportIndex = fraudReports.findIndex(report => report.id === id);
    
    if (reportIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Denúncia não encontrada'
        });
    }
    
    fraudReports[reportIndex].status = status;
    fraudReports[reportIndex].updatedAt = new Date().toISOString();
    
    res.json({
        success: true,
        data: fraudReports[reportIndex],
        message: 'Status atualizado com sucesso'
    });
});

// Risk Analysis Routes
app.get('/api/v1/risk-analysis', (req, res) => {
    res.json({
        success: true,
        data: riskAnalyses
    });
});

app.get('/api/v1/risk-analysis/:pixKey', (req, res) => {
    const { pixKey } = req.params;
    
    const riskAnalysis = riskAnalyses.find(analysis => analysis.pixKey === pixKey);
    
    if (!riskAnalysis) {
        return res.json({
            success: true,
            data: {
                pixKey,
                riskLevel: 'LOW',
                score: 0,
                reportCount: 0
            }
        });
    }
    
    res.json({
        success: true,
        data: riskAnalysis
    });
});

// Notifications Routes
app.get('/api/v1/notifications', (req, res) => {
    res.json({
        success: true,
        data: notifications
    });
});

// Charts and Analytics Routes
app.get('/api/v1/analytics/transactions-chart', (req, res) => {
    const mockData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
            label: 'Transações',
            data: [2340, 2891, 3201, 2756, 3458, 3892],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4
        }, {
            label: 'Fraudes',
            data: [23, 31, 28, 35, 42, 38],
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4
        }]
    };
    
    res.json({
        success: true,
        data: mockData
    });
});

app.get('/api/v1/analytics/risk-distribution', (req, res) => {
    const mockData = {
        labels: ['Baixo', 'Médio', 'Alto', 'Crítico'],
        datasets: [{
            data: [65, 20, 10, 5],
            backgroundColor: [
                '#10B981',
                '#F59E0B',
                '#EF4444',
                '#7C2D12'
            ]
        }]
    };
    
    res.json({
        success: true,
        data: mockData
    });
});

// Helper function to update risk analysis
const updateRiskAnalysis = (pixKey) => {
    const reportCount = fraudReports.filter(report => report.pixKey === pixKey).length;
    let riskLevel = 'LOW';
    let score = 0;
    
    if (reportCount >= 5) {
        riskLevel = 'CRITICAL';
        score = 90 + (reportCount * 2);
    } else if (reportCount >= 3) {
        riskLevel = 'HIGH';
        score = 70 + (reportCount * 5);
    } else if (reportCount >= 1) {
        riskLevel = 'MEDIUM';
        score = 40 + (reportCount * 15);
    }
    
    const existingIndex = riskAnalyses.findIndex(analysis => analysis.pixKey === pixKey);
    
    if (existingIndex !== -1) {
        riskAnalyses[existingIndex] = { pixKey, riskLevel, score, reportCount };
    } else {
        riskAnalyses.push({ pixKey, riskLevel, score, reportCount });
    }
};

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Sentinela PIX Backend'
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

// Initialize mock data and start server
initializeMockData();

app.listen(PORT, () => {
    console.log(`🚀 Sentinela PIX Backend rodando na porta ${PORT}`);
    console.log(`📊 Dashboard disponível em: http://localhost:8080`);
    console.log(`🔗 API disponível em: http://localhost:${PORT}/api/v1`);
    console.log(`❤️ Health check: http://localhost:${PORT}/health`);
});

module.exports = app;