// API Configuration
const API_CONFIG = {
    REPORT_SERVICE: 'http://localhost:8081',
    QUERY_SERVICE: 'http://localhost:8082'
};

// Global state
let reportsData = [];
let queryCount = 0;
let systemStartTime = Date.now();

// Utility function for fetch with timeout
async function fetchWithTimeout(url, options = {}, timeout = 8000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            mode: 'cors',
            cache: 'no-cache'
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
    }
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkSystemHealth();
    loadDashboardData();
    
    // Update uptime every second
    setInterval(updateUptime, 1000);
});

// Initialize Application
function initializeApp() {
    console.log('🚀 Sentinela PIX Interface Inicializada');
    
    // Show dashboard by default
    showSection('dashboard');
    
    // Add loading animations
    document.body.classList.add('fade-in');
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Query Form
    const queryForm = document.getElementById('query-form');
    if (queryForm) {
        queryForm.addEventListener('submit', handleQuerySubmit);
    }
    
    // Report Form
    const reportForm = document.getElementById('report-form');
    if (reportForm) {
        reportForm.addEventListener('submit', handleReportSubmit);
    }
    
    // Filter changes
    const filterCategory = document.getElementById('filter-category');
    const filterKeyType = document.getElementById('filter-key-type');
    
    if (filterCategory) {
        filterCategory.addEventListener('change', loadReports);
    }
    
    if (filterKeyType) {
        filterKeyType.addEventListener('change', loadReports);
    }
}

// Navigation Handler
function handleNavigation(e) {
    e.preventDefault();
    
    const targetSection = e.currentTarget.dataset.section;
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Show target section
    showSection(targetSection);
    
    // Load section-specific data
    if (targetSection === 'historico') {
        loadReports();
    } else if (targetSection === 'dashboard') {
        loadDashboardData();
    }
}

// Show Section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.classList.add('fade-in');
    }
}

// Check System Health
async function checkSystemHealth() {
    try {
        // Add timeout and better error handling
        const reportHealthResponse = await fetchWithTimeout(`${API_CONFIG.REPORT_SERVICE}/actuator/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }, 5000);
        
        const queryHealthResponse = await fetchWithTimeout(`${API_CONFIG.QUERY_SERVICE}/actuator/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }, 5000);
        
        const reportHealth = reportHealthResponse.ok ? await reportHealthResponse.json() : { status: 'DOWN' };
        const queryHealth = queryHealthResponse.ok ? await queryHealthResponse.json() : { status: 'DOWN' };
        
        const systemStatus = document.getElementById('system-status');
        if (reportHealth.status === 'UP' && queryHealth.status === 'UP') {
            systemStatus.textContent = 'Online';
            systemStatus.className = 'text-success';
        } else if (reportHealth.status === 'UP' || queryHealth.status === 'UP') {
            systemStatus.textContent = 'Parcial';
            systemStatus.className = 'text-warning';
        } else {
            systemStatus.textContent = 'Offline';
            systemStatus.className = 'text-danger';
        }
        
        console.log('✅ Sistema Online - Report Service:', reportHealth.status, 'Query Service:', queryHealth.status);
        
    } catch (error) {
        console.error('❌ Erro ao verificar saúde do sistema:', error);
        const systemStatus = document.getElementById('system-status');
        systemStatus.textContent = 'Verificando...';
        systemStatus.className = 'text-warning';
        
        // Retry after 5 seconds
        setTimeout(() => checkSystemHealth(), 5000);
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        showLoading();
        
        // Load reports count
        const reportsResponse = await fetchWithTimeout(`${API_CONFIG.REPORT_SERVICE}/api/reports`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!reportsResponse.ok) {
            throw new Error(`HTTP ${reportsResponse.status}: ${reportsResponse.statusText}`);
        }
        
        const reports = await reportsResponse.json();
        
        document.getElementById('total-reports').textContent = reports.length;
        document.getElementById('total-queries').textContent = queryCount;
        
        // Update recent activity
        updateRecentActivity('Sistema carregado com sucesso', 'success');
        updateRecentActivity(`${reports.length} relatórios encontrados`, 'info');
        
        hideLoading();
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados do dashboard:', error);
        hideLoading();
        showError('Erro ao carregar dados do dashboard: ' + error.message);
    }
}

// Handle Query Submit
async function handleQuerySubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const pixKey = formData.get('pixKey').trim();
    
    if (!pixKey) {
        showError('Por favor, insira uma chave PIX válida');
        return;
    }
    
    try {
        showLoading();
        queryCount++;
        
        // Query risk assessment
        const riskResponse = await fetchWithTimeout(`${API_CONFIG.QUERY_SERVICE}/api/query/pix-key/${encodeURIComponent(pixKey)}/risk`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!riskResponse.ok) {
            throw new Error(`HTTP ${riskResponse.status}: ${riskResponse.statusText}`);
        }
        
        const riskData = await riskResponse.json();
        
        // Query associated reports
        const reportsResponse = await fetchWithTimeout(`${API_CONFIG.QUERY_SERVICE}/api/query/pix-key/${encodeURIComponent(pixKey)}/reports`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        const reports = reportsResponse.ok ? await reportsResponse.json() : [];
        
        // Display results
        displayQueryResult(riskData, reports);
        
        // Update activity
        updateRecentActivity(`Consulta realizada para chave: ${pixKey}`, 'info');
        
        hideLoading();
        
    } catch (error) {
        console.error('❌ Erro na consulta:', error);
        hideLoading();
        showError('Erro ao consultar chave PIX: ' + error.message);
    }
}

// Display Query Result
function displayQueryResult(riskData, reports) {
    const resultCard = document.getElementById('query-result');
    const resultPixKey = document.getElementById('result-pix-key');
    const resultKeyType = document.getElementById('result-key-type');
    const resultRiskLevel = document.getElementById('result-risk-level');
    const resultRiskScore = document.getElementById('result-risk-score');
    const resultReportCount = document.getElementById('result-report-count');
    const riskBadge = document.getElementById('risk-badge');
    const reportsContainer = document.getElementById('reports-container');
    
    // Populate basic info
    resultPixKey.textContent = riskData.pixKey;
    resultKeyType.textContent = getKeyTypeLabel(riskData.keyType);
    resultRiskLevel.textContent = getRiskLevelLabel(riskData.riskLevel);
    resultRiskScore.textContent = riskData.riskScore.toFixed(2);
    resultReportCount.textContent = riskData.reportCount;
    
    // Set risk badge
    riskBadge.textContent = getRiskLevelLabel(riskData.riskLevel);
    riskBadge.className = `risk-badge ${riskData.riskLevel.toLowerCase()}`;
    
    // Display associated reports
    if (reports && reports.length > 0) {
        reportsContainer.innerHTML = reports.map(report => `
            <div class="report-item">
                <div class="report-meta">
                    <span class="report-category">${getCategoryLabel(report.scamCategory)}</span>
                    <span class="report-date">${formatDate(report.createdAt)}</span>
                </div>
                <div class="report-description">
                    ${report.description.length > 200 ? 
                        report.description.substring(0, 200) + '...' : 
                        report.description}
                </div>
            </div>
        `).join('');
    } else {
        reportsContainer.innerHTML = '<p class="text-success">Nenhum relatório de fraude encontrado para esta chave.</p>';
    }
    
    // Show result card
    resultCard.style.display = 'block';
    resultCard.classList.add('slide-up');
    
    // Scroll to result
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Handle Report Submit
async function handleReportSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reportData = {
        reportedPixKey: formData.get('reportedPixKey').trim(),
        pixKeyType: formData.get('pixKeyType'),
        scamCategory: formData.get('scamCategory'),
        description: formData.get('description').trim()
    };
    
    // Validate required fields
    if (!reportData.reportedPixKey || !reportData.pixKeyType || !reportData.scamCategory || !reportData.description) {
        showError('Por favor, preencha todos os campos obrigatórios');
        return;
    }
    
    try {
        showLoading();
        
        const response = await fetchWithTimeout(`${API_CONFIG.REPORT_SERVICE}/api/reports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(reportData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        
        // Show success message
        document.getElementById('report-id').textContent = result.id;
        document.getElementById('report-success').style.display = 'block';
        document.getElementById('report-form').style.display = 'none';
        
        // Reset form
        e.target.reset();
        
        // Update activity
        updateRecentActivity(`Novo relatório criado: ID ${result.id}`, 'danger');
        
        hideLoading();
        
        // Scroll to success message
        document.getElementById('report-success').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('❌ Erro ao enviar relatório:', error);
        hideLoading();
        showError('Erro ao enviar relatório: ' + error.message);
    }
}

// Hide Report Success
function hideReportSuccess() {
    document.getElementById('report-success').style.display = 'none';
    document.getElementById('report-form').style.display = 'block';
}

// Load Reports
async function loadReports() {
    try {
        showTableLoading();
        
        const response = await fetchWithTimeout(`${API_CONFIG.REPORT_SERVICE}/api/reports`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        let reports = await response.json();
        reportsData = reports;
        
        // Apply filters
        const categoryFilter = document.getElementById('filter-category')?.value;
        const keyTypeFilter = document.getElementById('filter-key-type')?.value;
        
        if (categoryFilter) {
            reports = reports.filter(report => report.scamCategory === categoryFilter);
        }
        
        if (keyTypeFilter) {
            reports = reports.filter(report => report.pixKeyType === keyTypeFilter);
        }
        
        // Sort by most recent
        reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Display reports in table
        displayReportsTable(reports);
        
    } catch (error) {
        console.error('❌ Erro ao carregar relatórios:', error);
        showTableError('Erro ao carregar relatórios: ' + error.message);
    }
}

// Display Reports Table
function displayReportsTable(reports) {
    const tbody = document.getElementById('reports-tbody');
    
    if (!reports || reports.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="loading">
                    <i class="fas fa-info-circle"></i> Nenhum relatório encontrado
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = reports.map(report => `
        <tr>
            <td><strong>#${report.id}</strong></td>
            <td title="${report.reportedPixKey}">
                ${report.reportedPixKey.length > 20 ? 
                    report.reportedPixKey.substring(0, 20) + '...' : 
                    report.reportedPixKey}
            </td>
            <td>${getKeyTypeLabel(report.pixKeyType)}</td>
            <td>
                <span class="report-category">${getCategoryLabel(report.scamCategory)}</span>
            </td>
            <td>${formatDate(report.createdAt)}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="showReportDetails(${report.id})">
                    <i class="fas fa-eye"></i> Ver
                </button>
            </td>
        </tr>
    `).join('');
}

// Show Report Details
async function showReportDetails(reportId) {
    try {
        showLoading();
        
        const response = await fetchWithTimeout(`${API_CONFIG.REPORT_SERVICE}/api/reports/${reportId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const report = await response.json();
        
        // Populate modal
        document.getElementById('modal-title').textContent = `Relatório #${report.id}`;
        document.getElementById('modal-body').innerHTML = `
            <div class="report-details">
                <div class="risk-item">
                    <span class="risk-label">ID do Relatório:</span>
                    <span>#${report.id}</span>
                </div>
                <div class="risk-item">
                    <span class="risk-label">Chave PIX Reportada:</span>
                    <span>${report.reportedPixKey}</span>
                </div>
                <div class="risk-item">
                    <span class="risk-label">Tipo da Chave:</span>
                    <span>${getKeyTypeLabel(report.pixKeyType)}</span>
                </div>
                <div class="risk-item">
                    <span class="risk-label">Categoria:</span>
                    <span class="report-category">${getCategoryLabel(report.scamCategory)}</span>
                </div>
                <div class="risk-item">
                    <span class="risk-label">Data do Relatório:</span>
                    <span>${formatDateTime(report.createdAt)}</span>
                </div>
                <div style="margin-top: 1.5rem;">
                    <strong>Descrição:</strong>
                    <div style="margin-top: 0.5rem; background: #f7fafc; padding: 1rem; border-radius: 8px; line-height: 1.6;">
                        ${report.description}
                    </div>
                </div>
            </div>
        `;
        
        // Show modal
        document.getElementById('report-modal').style.display = 'block';
        
        hideLoading();
        
    } catch (error) {
        console.error('❌ Erro ao carregar detalhes:', error);
        hideLoading();
        showError('Erro ao carregar detalhes do relatório: ' + error.message);
    }
}

// Close Report Modal
function closeReportModal() {
    document.getElementById('report-modal').style.display = 'none';
}

// Update Recent Activity
function updateRecentActivity(message, type = 'info') {
    const activityList = document.getElementById('recent-activity');
    
    if (!activityList) return;
    
    const iconClass = {
        'success': 'fa-check-circle text-success',
        'danger': 'fa-exclamation-triangle text-danger',
        'warning': 'fa-exclamation-circle text-warning',
        'info': 'fa-info-circle text-info'
    };
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item fade-in';
    activityItem.innerHTML = `
        <i class="fas ${iconClass[type] || iconClass.info}"></i>
        <span>${message}</span>
        <small>${formatTime(new Date())}</small>
    `;
    
    // Add to top
    activityList.insertBefore(activityItem, activityList.firstChild);
    
    // Keep only last 10 items
    while (activityList.children.length > 10) {
        activityList.removeChild(activityList.lastChild);
    }
}

// Update Uptime
function updateUptime() {
    const uptimeElement = document.getElementById('uptime');
    if (!uptimeElement) return;
    
    const uptime = Date.now() - systemStartTime;
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
    
    uptimeElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
}

// Utility Functions
function getKeyTypeLabel(keyType) {
    const labels = {
        'EMAIL': 'E-mail',
        'PHONE': 'Telefone',
        'CPF': 'CPF',
        'RANDOM': 'Aleatória'
    };
    return labels[keyType] || keyType;
}

function getRiskLevelLabel(riskLevel) {
    const labels = {
        'LOW': 'Baixo',
        'MEDIUM': 'Médio',
        'HIGH': 'Alto'
    };
    return labels[riskLevel] || riskLevel;
}

function getCategoryLabel(category) {
    const labels = {
        'FALSO_VENDEDOR': 'Falso Vendedor',
        'PHISHING': 'Phishing',
        'ENGENHARIA_SOCIAL': 'Engenharia Social',
        'CLONAGEM_WHATSAPP': 'Clonagem WhatsApp',
        'FALSO_SEQUESTRO': 'Falso Sequestro',
        'INVESTIMENTO_FRAUDULENTO': 'Investimento Fraudulento',
        'ROUBO_IDENTIDADE': 'Roubo de Identidade',
        'OUTROS': 'Outros'
    };
    return labels[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
}

function formatTime(date) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Loading and Error Functions
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

function showTableLoading() {
    const tbody = document.getElementById('reports-tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="loading">
                    <i class="fas fa-spinner fa-spin"></i> Carregando relatórios...
                </td>
            </tr>
        `;
    }
}

function showTableError(message) {
    const tbody = document.getElementById('reports-tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="loading">
                    <i class="fas fa-exclamation-triangle text-danger"></i> ${message}
                </td>
            </tr>
        `;
    }
}

function showError(message) {
    console.error(message);
    
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #fed7d7, #fc8181);
        color: #742a2a;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(245, 101, 101, 0.3);
        z-index: 10000;
        max-width: 400px;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;
    
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
            <button onclick="this.parentNode.parentNode.remove()" style="
                background: none; border: none; color: #742a2a; cursor: pointer; 
                font-size: 1.2rem; margin-left: auto; padding: 0;
            ">&times;</button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('report-modal');
    if (event.target === modal) {
        closeReportModal();
    }
}

// Add slide in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

console.log('🎯 Sentinela PIX JavaScript carregado com sucesso!');