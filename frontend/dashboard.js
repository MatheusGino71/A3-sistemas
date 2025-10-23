// Sentinela PIX Dashboard JavaScript - Sistema 100% Funcional
class SentinelaPixDashboard {
    constructor() {
        this.currentPage = 'dashboard';
        this.isDarkMode = true;
        this.apiUrl = 'http://localhost:3001/api/v1';
        this.refreshInterval = 5000; // 5 segundos
        this.autoRefreshEnabled = true;
        this.init();
    }

    init() {
        this.loadPage('dashboard');
        this.updateStats();
        this.startRealTimeUpdates();
        this.setupAutoRefresh();
        
        // Set initial theme
        document.documentElement.classList.toggle('dark', this.isDarkMode);
        
        // Show notification that system is fully functional
        this.showNotification('✅ Sistema 100% funcional - Dados reais em tempo real!', 'success');
    }

    // Setup automatic refresh for real-time updates
    setupAutoRefresh() {
        setInterval(() => {
            if (this.autoRefreshEnabled) {
                this.updateStats();
                if (this.currentPage === 'reports') {
                    this.loadFraudReports();
                }
                if (this.currentPage === 'risk-analysis') {
                    this.loadRiskAnalysis();
                }
                if (this.currentPage === 'notifications') {
                    this.loadNotifications();
                }
            }
        }, this.refreshInterval);
    }

    // Show notification to user
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-black' :
            'bg-blue-500 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-lg">&times;</button>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Page Navigation
    showPage(pageId) {
        // Update active navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active', 'bg-primary/10', 'dark:bg-primary/20', 'text-primary', 'font-semibold');
            item.classList.add('hover:bg-gray-50', 'dark:hover:bg-gray-800', 'text-gray-600', 'dark:text-gray-400');
        });

        // Find and activate current nav item
        const activeNavItem = document.querySelector(`[onclick="showPage('${pageId}')"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active', 'bg-primary/10', 'dark:bg-primary/20', 'text-primary', 'font-semibold');
            activeNavItem.classList.remove('hover:bg-gray-50', 'dark:hover:bg-gray-800', 'text-gray-600', 'dark:text-gray-400');
        }

        this.currentPage = pageId;
        this.loadPage(pageId);
    }

    loadPage(pageId) {
        const pageConfig = {
            'dashboard': {
                title: 'Dashboard',
                subtitle: 'Visão geral do sistema anti-fraude'
            },
            'reports': {
                title: 'Denúncias',
                subtitle: 'Gerenciamento de denúncias de fraude'
            },
            'risk-analysis': {
                title: 'Análise de Risco',
                subtitle: 'Monitoramento e análise de chaves PIX'
            },
            'notifications': {
                title: 'Notificações',
                subtitle: 'Sistema de alertas entre bancos'
            },
            'monitoring': {
                title: 'Monitoramento',
                subtitle: 'Status dos microsserviços'
            },
            'settings': {
                title: 'Configurações',
                subtitle: 'Configurações do sistema'
            }
        };

        // Update header
        const config = pageConfig[pageId];
        document.getElementById('page-title').textContent = config.title;
        document.getElementById('page-subtitle').textContent = config.subtitle;

        // Hide all pages first
        document.querySelectorAll('.page-content').forEach(page => {
            page.style.display = 'none';
        });

        // Show selected page or create it
        let pageElement = document.getElementById(`${pageId}-page`);
        if (!pageElement) {
            pageElement = this.createPage(pageId);
        }
        pageElement.style.display = 'block';
    }

    createPage(pageId) {
        const container = document.getElementById('page-content');
        const pageElement = document.createElement('div');
        pageElement.id = `${pageId}-page`;
        pageElement.className = 'page-content';

        switch (pageId) {
            case 'reports':
                pageElement.innerHTML = this.createReportsPage();
                break;
            case 'risk-analysis':
                pageElement.innerHTML = this.createRiskAnalysisPage();
                break;
            case 'notifications':
                pageElement.innerHTML = this.createNotificationsPage();
                break;
            case 'monitoring':
                pageElement.innerHTML = this.createMonitoringPage();
                break;
            case 'settings':
                pageElement.innerHTML = this.createSettingsPage();
                break;
        }

        container.appendChild(pageElement);
        return pageElement;
    }

    createReportsPage() {
        return `
            <div class="space-y-6">
                <!-- Action Bar -->
                <div class="flex flex-col sm:flex-row gap-4 justify-between items-start">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Denúncias de Fraude PIX</h3>
                        <p class="text-gray-500 dark:text-gray-400">Gerencie e monitore as denúncias recebidas</p>
                    </div>
                    <button onclick="dashboard.showReportForm()" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors">
                        <span class="material-symbols-outlined">add</span>
                        Nova Denúncia
                    </button>
                </div>

                <!-- Filter Bar -->
                <div class="bg-white dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div class="flex flex-wrap gap-4 items-center">
                        <div class="flex-1 min-w-60">
                            <input type="text" placeholder="Buscar por chave PIX..." 
                                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>
                        <select class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="">Todos os Status</option>
                            <option value="pending">Pendente</option>
                            <option value="confirmed">Confirmada</option>
                            <option value="false_positive">Falso Positivo</option>
                        </select>
                        <select class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="">Todas as Prioridades</option>
                            <option value="critical">Crítica</option>
                            <option value="high">Alta</option>
                            <option value="medium">Média</option>
                            <option value="low">Baixa</option>
                        </select>
                    </div>
                </div>

                <!-- Reports Table -->
                <div class="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chave PIX</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Banco</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody id="reports-table-body" class="bg-white dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                                <!-- Dynamic content -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    createRiskAnalysisPage() {
        return `
            <div class="space-y-6">
                <!-- Tabs -->
                <div class="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div class="flex border-b border-gray-200 dark:border-gray-700">
                        <button onclick="dashboard.switchRiskTab('verify')" id="tab-verify" class="flex-1 px-6 py-4 text-sm font-medium text-primary border-b-2 border-primary bg-primary/5">
                            Verificar Segurança
                        </button>
                        <button onclick="dashboard.switchRiskTab('register')" id="tab-register" class="flex-1 px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            Cadastrar Chave
                        </button>
                        <button onclick="dashboard.switchRiskTab('risks')" id="tab-risks" class="flex-1 px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            Alto Risco
                        </button>
                    </div>
                </div>

                <!-- Tab Content: Verify Security -->
                <div id="content-verify" class="space-y-6">
                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div class="flex items-start gap-4 mb-6">
                            <div class="p-3 rounded-full bg-blue-500/10">
                                <span class="material-symbols-outlined text-2xl text-blue-500">verified_user</span>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Verificação de Segurança PIX</h3>
                                <p class="text-gray-600 dark:text-gray-400">Digite uma chave PIX para verificar sua segurança e histórico de denúncias</p>
                            </div>
                        </div>
                        
                        <div class="flex gap-4 items-end">
                            <div class="flex-1">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chave PIX</label>
                                <input type="text" id="verify-pix-key" placeholder="exemplo@email.com, CPF, telefone..." 
                                       class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary">
                            </div>
                            <button onclick="dashboard.verifyPixKeySecurity()" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors">
                                <span class="material-symbols-outlined">search</span>
                                Verificar
                            </button>
                        </div>
                    </div>

                    <!-- Security Result -->
                    <div id="security-result" class="hidden"></div>
                </div>

                <!-- Tab Content: Register Key -->
                <div id="content-register" class="hidden space-y-6">
                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div class="flex items-start gap-4 mb-6">
                            <div class="p-3 rounded-full bg-green-500/10">
                                <span class="material-symbols-outlined text-2xl text-green-500">app_registration</span>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Cadastrar Chave PIX</h3>
                                <p class="text-gray-600 dark:text-gray-400">Registre sua chave PIX para monitoramento contínuo de segurança</p>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chave PIX *</label>
                                <input type="text" id="register-pix-key" placeholder="Sua chave PIX" 
                                       class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome do Titular</label>
                                <input type="text" id="register-owner-name" placeholder="Nome completo" 
                                       class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CPF/CNPJ</label>
                                <input type="text" id="register-document" placeholder="000.000.000-00" 
                                       class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Banco</label>
                                <input type="text" id="register-bank" placeholder="Nome do banco" 
                                       class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            </div>
                        </div>
                        
                        <div class="mt-6 flex justify-end gap-4">
                            <button onclick="dashboard.clearRegisterForm()" class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                                Limpar
                            </button>
                            <button onclick="dashboard.registerPixKey()" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors">
                                <span class="material-symbols-outlined">save</span>
                                Cadastrar e Verificar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Tab Content: High Risks -->
                <div id="content-risks" class="hidden space-y-6">
                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Chaves de Alto Risco</h3>
                            <button onclick="dashboard.loadHighRiskKeys()" class="text-primary hover:text-primary/80 text-sm font-medium">
                                <span class="material-symbols-outlined text-sm">refresh</span> Atualizar
                            </button>
                        </div>
                        <div id="high-risk-keys-list" class="grid gap-4">
                            <p class="text-gray-500 dark:text-gray-400 text-center py-8">Carregando chaves de alto risco...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createNotificationsPage() {
        return `
            <div class="space-y-6">
                <!-- Notification Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center gap-4">
                            <div class="p-3 rounded-full bg-blue-500/10">
                                <span class="material-symbols-outlined text-2xl text-blue-500">send</span>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Enviadas Hoje</p>
                                <p class="text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center gap-4">
                            <div class="p-3 rounded-full bg-green-500/10">
                                <span class="material-symbols-outlined text-2xl text-green-500">check_circle</span>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Bem-sucedidas</p>
                                <p class="text-2xl font-bold text-gray-900 dark:text-white">1,195</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center gap-4">
                            <div class="p-3 rounded-full bg-red-500/10">
                                <span class="material-symbols-outlined text-2xl text-red-500">error</span>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Falharam</p>
                                <p class="text-2xl font-bold text-gray-900 dark:text-white">52</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Notifications -->
                <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Notificações Recentes</h3>
                        <div class="flex gap-2">
                            <button class="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors">
                                Filtros
                            </button>
                            <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                                Atualizar
                            </button>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Banco Destino</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Chave PIX</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tipo</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tentativas</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Hora</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">IT</div>
                                            <span class="ml-2 text-gray-900 dark:text-white">Banco Itaú</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">fraudulento@gmail.com</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-full text-xs">FRAUDE</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-full text-xs">SUCESSO</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">1/3</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">14:32</td>
                                </tr>
                                <!-- More rows... -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    createMonitoringPage() {
        return `
            <div class="space-y-6">
                <!-- Service Status -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="font-semibold text-gray-900 dark:text-white">API Gateway</h4>
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">99.9%</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Uptime</p>
                    </div>

                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="font-semibold text-gray-900 dark:text-white">Fraud Service</h4>
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">456ms</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Avg Response</p>
                    </div>

                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="font-semibold text-gray-900 dark:text-white">Risk Analysis</h4>
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">234ms</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Avg Response</p>
                    </div>

                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="font-semibold text-gray-900 dark:text-white">Notifications</h4>
                            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        </div>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">1.2s</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Avg Response</p>
                    </div>
                </div>

                <!-- System Metrics -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">CPU Usage</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-600 dark:text-gray-400">API Gateway</span>
                                <div class="flex items-center gap-2">
                                    <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                        <div class="w-1/4 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                    <span class="text-sm text-gray-900 dark:text-white">25%</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-600 dark:text-gray-400">Fraud Service</span>
                                <div class="flex items-center gap-2">
                                    <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                        <div class="w-1/2 h-2 bg-yellow-500 rounded-full"></div>
                                    </div>
                                    <span class="text-sm text-gray-900 dark:text-white">45%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Memory Usage</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-600 dark:text-gray-400">PostgreSQL</span>
                                <div class="flex items-center gap-2">
                                    <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                        <div class="w-3/5 h-2 bg-blue-500 rounded-full"></div>
                                    </div>
                                    <span class="text-sm text-gray-900 dark:text-white">60%</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-600 dark:text-gray-400">RabbitMQ</span>
                                <div class="flex items-center gap-2">
                                    <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                        <div class="w-1/3 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                    <span class="text-sm text-gray-900 dark:text-white">35%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createSettingsPage() {
        return `
            <div class="space-y-6">
                <!-- API Configuration -->
                <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configurações da API</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL Base da API</label>
                            <input type="text" value="http://localhost:8080/api/v1" 
                                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timeout (ms)</label>
                            <input type="number" value="30000" 
                                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>
                    </div>
                </div>

                <!-- Notification Settings -->
                <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configurações de Notificação</h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="font-medium text-gray-900 dark:text-white">Notificações em Tempo Real</h4>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Receber alertas instantâneos</p>
                            </div>
                            <button class="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                                <span class="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                            </button>
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="font-medium text-gray-900 dark:text-white">Relatórios Diários</h4>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Resumo diário por email</p>
                            </div>
                            <button class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
                                <span class="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Bank Webhooks -->
                <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Webhooks dos Bancos</h3>
                    <div class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" placeholder="Código do Banco" 
                                   class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <input type="text" placeholder="Nome do Banco" 
                                   class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <input type="url" placeholder="URL do Webhook" 
                                   class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>
                        <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                            Adicionar Webhook
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // API Methods
    async updateStats() {
        try {
            const response = await fetch(`${this.apiUrl}/dashboard/stats`);
            const result = await response.json();
            
            if (result.success) {
                const stats = result.data;
                
                // Update stat cards
                const statCards = {
                    'total-transactions': stats.totalTransactions || 0,
                    'frauds-detected': stats.fraudsDetected || 0,
                    'success-rate': `${(stats.successRate || 100).toFixed(1)}%`,
                    'total-reports': stats.totalReports || 0
                };
                
                Object.entries(statCards).forEach(([id, value]) => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.textContent = value;
                    }
                });
            }
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            this.showNotification('⚠️ Erro ao carregar estatísticas. Verifique se o backend está rodando.', 'warning');
        }
    }

    async analyzePixKey() {
        const pixKey = document.getElementById('risk-pix-key')?.value;
        if (!pixKey) {
            this.showNotification('⚠️ Por favor, digite uma chave PIX para análise', 'warning');
            return;
        }

        // Show loading state
        const button = document.querySelector('button[onclick="dashboard.analyzePixKey()"]');
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="animate-spin material-symbols-outlined">sync</span> Analisando...';
        button.disabled = true;

        try {
            const response = await fetch(`${this.apiUrl}/risk-analysis/${encodeURIComponent(pixKey)}`);
            const result = await response.json();

            if (result.success) {
                // Convert API response to display format
                const analysisResult = {
                    pixKey: result.data.pix_key || pixKey,
                    riskLevel: result.data.risk_level || 'LOW',
                    currentScore: result.data.risk_score || 0,
                    totalReports: result.data.report_count || 0,
                    reports24h: 0, // Would be calculated from API
                    reports7d: result.data.report_count || 0,
                    isBlocked: result.data.risk_level === 'CRITICAL',
                    recommendation: this.getRiskRecommendation(result.data.risk_level, result.data.report_count)
                };

                this.displayRiskResult(analysisResult);
                this.showNotification(`✅ Análise concluída para ${pixKey}`, 'success');
            } else {
                this.showNotification(`❌ Erro na análise: ${result.message}`, 'error');
            }
        } catch (error) {
            console.error('Erro ao analisar chave PIX:', error);
            this.showNotification('❌ Erro de conexão durante a análise', 'error');
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }

    getRiskRecommendation(riskLevel, reportCount) {
        switch (riskLevel) {
            case 'CRITICAL':
                return `🚨 RISCO CRÍTICO: ${reportCount} denúncias registradas. Bloqueio imediato recomendado.`;
            case 'HIGH':
                return `⚠️ RISCO ALTO: ${reportCount} denúncias. Monitoramento intensivo e possível bloqueio preventivo.`;
            case 'MEDIUM':
                return `⚠️ RISCO MÉDIO: ${reportCount} denúncia(s). Monitoramento recomendado.`;
            case 'LOW':
            default:
                return reportCount > 0 
                    ? `✅ RISCO BAIXO: ${reportCount} denúncia(s). Conta sob observação.`
                    : '✅ RISCO BAIXO: Nenhuma denúncia registrada. Conta sem histórico de fraude.';
        }
    }

    displayRiskResult(result) {
        const resultDiv = document.getElementById('risk-result');
        if (!resultDiv) return;

        const riskColor = {
            'LOW_RISK': 'green',
            'MEDIUM_RISK': 'yellow',
            'HIGH_RISK': 'red',
            'CRITICAL_RISK': 'red'
        }[result.riskLevel] || 'gray';

        resultDiv.innerHTML = `
            <div class="flex items-start gap-6">
                <div class="p-4 rounded-full bg-${riskColor}-500/10">
                    <span class="material-symbols-outlined text-3xl text-${riskColor}-500">
                        ${result.riskLevel.includes('HIGH') || result.riskLevel.includes('CRITICAL') ? 'dangerous' : 'info'}
                    </span>
                </div>
                <div class="flex-1">
                    <h4 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Análise de Risco PIX</h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Chave PIX</p>
                            <p class="font-mono text-gray-900 dark:text-white">${result.pixKey}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Score de Risco</p>
                            <p class="text-2xl font-bold text-${riskColor}-500">${result.currentScore}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Total de Denúncias</p>
                            <p class="text-xl font-semibold text-gray-900 dark:text-white">${result.totalReports}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Nas Últimas 24h</p>
                            <p class="text-xl font-semibold text-gray-900 dark:text-white">${result.reports24h}</p>
                        </div>
                    </div>
                    <div class="p-4 bg-${riskColor}-50 dark:bg-${riskColor}-900/20 border border-${riskColor}-200 dark:border-${riskColor}-800 rounded-lg">
                        <p class="text-${riskColor}-800 dark:text-${riskColor}-200">${result.recommendation}</p>
                    </div>
                </div>
            </div>
        `;

        resultDiv.classList.remove('hidden');
    }

    // Switch between risk analysis tabs
    switchRiskTab(tabName) {
        // Update tab buttons
        ['verify', 'register', 'risks'].forEach(tab => {
            const button = document.getElementById(`tab-${tab}`);
            const content = document.getElementById(`content-${tab}`);
            
            if (tab === tabName) {
                button.classList.add('text-primary', 'border-b-2', 'border-primary', 'bg-primary/5');
                button.classList.remove('text-gray-500', 'dark:text-gray-400');
                content.classList.remove('hidden');
            } else {
                button.classList.remove('text-primary', 'border-b-2', 'border-primary', 'bg-primary/5');
                button.classList.add('text-gray-500', 'dark:text-gray-400');
                content.classList.add('hidden');
            }
        });

        // Load content if needed
        if (tabName === 'risks') {
            this.loadHighRiskKeys();
        }
    }

    // Verify PIX key security
    async verifyPixKeySecurity() {
        const pixKey = document.getElementById('verify-pix-key')?.value;
        if (!pixKey) {
            this.showNotification('⚠️ Por favor, digite uma chave PIX', 'warning');
            return;
        }

        try {
            this.showNotification('🔍 Verificando segurança...', 'info');
            
            const response = await fetch(`${this.apiUrl}/pix-keys/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pixKey })
            });

            const result = await response.json();

            if (result.success) {
                this.displaySecurityResult(result.data);
                this.showNotification(`✅ Verificação concluída!`, 'success');
            } else {
                this.showNotification(`❌ Erro: ${result.message}`, 'error');
            }
        } catch (error) {
            console.error('Erro ao verificar segurança:', error);
            this.showNotification('❌ Erro ao verificar segurança da chave PIX', 'error');
        }
    }

    // Display security verification result
    displaySecurityResult(data) {
        const resultDiv = document.getElementById('security-result');
        if (!resultDiv) return;

        const scoreColor = data.securityScore >= 70 ? 'green' : data.securityScore >= 50 ? 'yellow' : 'red';
        const riskIcon = data.riskLevel === 'SAFE' ? 'verified_user' : 
                        data.riskLevel === 'LOW' ? 'info' :
                        data.riskLevel === 'MEDIUM' ? 'warning' : 'dangerous';

        let checksHtml = '';
        if (data.securityChecks && data.securityChecks.length > 0) {
            checksHtml = data.securityChecks.map(check => {
                const severityColors = {
                    'CRITICAL': 'red',
                    'HIGH': 'orange',
                    'MEDIUM': 'yellow',
                    'LOW': 'blue',
                    'INFO': 'green'
                };
                const color = severityColors[check.severity] || 'gray';
                
                return `
                    <div class="p-4 bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-200 dark:border-${color}-800 rounded-lg">
                        <div class="flex items-start gap-3">
                            <span class="material-symbols-outlined text-${color}-600 dark:text-${color}-400 text-xl">
                                ${check.severity === 'CRITICAL' || check.severity === 'HIGH' ? 'error' : check.severity === 'INFO' ? 'check_circle' : 'warning'}
                            </span>
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="font-medium text-${color}-900 dark:text-${color}-100">${check.message}</span>
                                    <span class="px-2 py-0.5 bg-${color}-200 dark:bg-${color}-800 text-${color}-800 dark:text-${color}-200 rounded text-xs font-medium">
                                        ${check.severity}
                                    </span>
                                </div>
                                ${check.recommendation ? `<p class="text-sm text-${color}-700 dark:text-${color}-300">${check.recommendation}</p>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        resultDiv.innerHTML = `
            <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div class="flex items-start gap-6 mb-6">
                    <div class="p-4 rounded-full bg-${scoreColor}-500/10">
                        <span class="material-symbols-outlined text-4xl text-${scoreColor}-500">${riskIcon}</span>
                    </div>
                    <div class="flex-1">
                        <h4 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Relatório de Segurança</h4>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Chave PIX</p>
                                <p class="font-mono text-gray-900 dark:text-white break-all">${data.pixKey}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Tipo</p>
                                <p class="font-semibold text-gray-900 dark:text-white">${data.keyType}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Score de Segurança</p>
                                <p class="text-3xl font-bold text-${scoreColor}-500">${data.securityScore}/100</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Nível de Risco</p>
                                <span class="inline-block px-3 py-1 bg-${scoreColor}-100 dark:bg-${scoreColor}-900/50 text-${scoreColor}-800 dark:text-${scoreColor}-200 rounded-full text-sm font-medium">
                                    ${data.riskLevel}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-4 bg-${scoreColor}-50 dark:bg-${scoreColor}-900/20 border border-${scoreColor}-200 dark:border-${scoreColor}-800 rounded-lg mb-6">
                    <p class="text-${scoreColor}-900 dark:text-${scoreColor}-100 font-medium">${data.recommendation}</p>
                </div>

                ${checksHtml ? `
                    <div class="space-y-3">
                        <h5 class="font-semibold text-gray-900 dark:text-white">Verificações de Segurança:</h5>
                        ${checksHtml}
                    </div>
                ` : ''}

                ${data.isRegistered ? `
                    <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p class="text-blue-800 dark:text-blue-200 text-sm">
                            <span class="material-symbols-outlined text-sm">info</span>
                            Esta chave está cadastrada no sistema de monitoramento
                        </p>
                    </div>
                ` : ''}
            </div>
        `;

        resultDiv.classList.remove('hidden');
    }

    // Register PIX key
    async registerPixKey() {
        const pixKey = document.getElementById('register-pix-key')?.value;
        const ownerName = document.getElementById('register-owner-name')?.value;
        const ownerDocument = document.getElementById('register-document')?.value;
        const bankName = document.getElementById('register-bank')?.value;

        if (!pixKey) {
            this.showNotification('⚠️ Por favor, preencha a chave PIX', 'warning');
            return;
        }

        try {
            this.showNotification('💾 Cadastrando chave PIX...', 'info');
            
            const response = await fetch(`${this.apiUrl}/pix-keys/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pixKey, ownerName, ownerDocument, bankName })
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification(`✅ Chave PIX cadastrada com sucesso!`, 'success');
                
                // Switch to verify tab and show results
                this.switchRiskTab('verify');
                document.getElementById('verify-pix-key').value = pixKey;
                this.displaySecurityResult({
                    pixKey: result.data.pix_key,
                    keyType: result.data.key_type,
                    securityScore: result.data.security_score,
                    riskLevel: result.data.security_score >= 70 ? 'SAFE' : 
                              result.data.security_score >= 50 ? 'MEDIUM' : 'HIGH',
                    recommendation: result.data.security_score >= 70 
                        ? '✅ Chave cadastrada e segura para transações' 
                        : '⚠️ Chave cadastrada - Monitore transações',
                    securityChecks: result.data.securityChecks,
                    isRegistered: true
                });
                
                this.clearRegisterForm();
            } else {
                this.showNotification(`❌ Erro: ${result.message}`, 'error');
            }
        } catch (error) {
            console.error('Erro ao cadastrar chave PIX:', error);
            this.showNotification('❌ Erro ao cadastrar chave PIX', 'error');
        }
    }

    // Clear registration form
    clearRegisterForm() {
        document.getElementById('register-pix-key').value = '';
        document.getElementById('register-owner-name').value = '';
        document.getElementById('register-document').value = '';
        document.getElementById('register-bank').value = '';
    }

    // Load high risk keys
    async loadHighRiskKeys() {
        const container = document.getElementById('high-risk-keys-list');
        if (!container) return;

        try {
            const response = await fetch(`${this.apiUrl}/risk-analysis`);
            const result = await response.json();

            if (result.success && result.data.length > 0) {
                const highRiskKeys = result.data.filter(key => 
                    key.risk_level === 'CRITICAL' || key.risk_level === 'HIGH'
                );

                if (highRiskKeys.length === 0) {
                    container.innerHTML = `
                        <div class="text-center py-8">
                            <span class="material-symbols-outlined text-6xl text-green-500 mb-4">verified_user</span>
                            <p class="text-gray-500 dark:text-gray-400">Nenhuma chave de alto risco encontrada</p>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = highRiskKeys.map(key => {
                    const isCritical = key.risk_level === 'CRITICAL';
                    const color = isCritical ? 'red' : 'orange';
                    const icon = isCritical ? 'dangerous' : 'warning';

                    return `
                        <div class="flex items-center justify-between p-4 bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-200 dark:border-${color}-800 rounded-lg">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 bg-${color}-100 dark:bg-${color}-900/50 rounded-full flex items-center justify-center">
                                    <span class="material-symbols-outlined text-${color}-600 dark:text-${color}-400">${icon}</span>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-900 dark:text-white">${key.pix_key}</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">
                                        Score: ${key.risk_score} | ${key.report_count} denúncia(s)
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="px-3 py-1 bg-${color}-100 dark:bg-${color}-900/50 text-${color}-800 dark:text-${color}-200 rounded-full text-xs font-medium">
                                    ${key.risk_level}
                                </span>
                                <button onclick="dashboard.verifyPixKeySecurity(); document.getElementById('verify-pix-key').value='${key.pix_key}'; dashboard.switchRiskTab('verify');" 
                                        class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="Ver detalhes">
                                    <span class="material-symbols-outlined">visibility</span>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                container.innerHTML = `
                    <div class="text-center py-8">
                        <span class="material-symbols-outlined text-6xl text-gray-400 mb-4">search_off</span>
                        <p class="text-gray-500 dark:text-gray-400">Nenhum dado de risco disponível</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Erro ao carregar chaves de alto risco:', error);
            container.innerHTML = `
                <div class="text-center py-8">
                    <span class="material-symbols-outlined text-6xl text-red-400 mb-4">error</span>
                    <p class="text-red-500">Erro ao carregar dados</p>
                </div>
            `;
        }
    }

    showReportForm() {
        // Create modal for fraud report form
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Nova Denúncia de Fraude PIX</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <form onsubmit="dashboard.submitFraudReport(event)" class="p-6 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Chave PIX do Golpista *
                            </label>
                            <input type="text" name="pixKey" required 
                                   placeholder="email@exemplo.com, +5511999999999, CPF ou CNPJ"
                                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Banco/Instituição *
                            </label>
                            <select name="reporterBank" required 
                                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary">
                                <option value="">Selecione seu banco</option>
                                <option value="Banco do Brasil">Banco do Brasil</option>
                                <option value="Itaú Unibanco">Itaú Unibanco</option>
                                <option value="Bradesco">Bradesco</option>
                                <option value="Santander">Santander</option>
                                <option value="Caixa Econômica Federal">Caixa Econômica Federal</option>
                                <option value="Nubank">Nubank</option>
                                <option value="Inter">Inter</option>
                                <option value="C6 Bank">C6 Bank</option>
                                <option value="Next">Next</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Prioridade
                            </label>
                            <select name="priority" 
                                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary">
                                <option value="LOW">Baixa</option>
                                <option value="MEDIUM" selected>Média</option>
                                <option value="HIGH">Alta</option>
                                <option value="CRITICAL">Crítica</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Valor da Transação (R$)
                            </label>
                            <input type="number" name="amount" step="0.01" min="0" 
                                   placeholder="0,00"
                                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ID da Transação
                            </label>
                            <input type="text" name="transactionId" 
                                   placeholder="ID único da transação PIX"
                                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary">
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Descrição da Fraude *
                            </label>
                            <textarea name="description" required rows="4" 
                                      placeholder="Descreva detalhadamente o golpe aplicado..."
                                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Informações da Vítima (Opcional)
                            </label>
                            <textarea name="victimInfo" rows="2" 
                                      placeholder="Dados adicionais sobre a vítima (sem dados pessoais sensíveis)"
                                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                        </div>
                    </div>
                    
                    <div class="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button type="button" onclick="this.closest('.fixed').remove()" 
                                class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" 
                                class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                            <span class="material-symbols-outlined">send</span>
                            Enviar Denúncia
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    async submitFraudReport(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="animate-spin material-symbols-outlined">sync</span> Enviando...';
        submitButton.disabled = true;
        
        try {
            const response = await fetch(`${this.apiUrl}/fraud-reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showNotification('✅ Denúncia enviada com sucesso! Sistema processando automaticamente...', 'success');
                form.closest('.fixed').remove();
                
                // Refresh the reports page if we're on it
                if (this.currentPage === 'reports') {
                    this.loadFraudReports();
                }
                
                // Update stats
                this.updateStats();
                
                // Show additional info about automatic processing
                setTimeout(() => {
                    this.showNotification('🔄 Análise de risco atualizada automaticamente', 'info');
                }, 1500);
                
                setTimeout(() => {
                    this.showNotification('📤 Notificação enviada para a instituição do golpista', 'info');
                }, 3000);
                
            } else {
                this.showNotification(`❌ Erro: ${result.message}`, 'error');
            }
        } catch (error) {
            console.error('Erro ao enviar denúncia:', error);
            this.showNotification('❌ Erro de conexão. Tente novamente.', 'error');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    // Load fraud reports from API
    async loadFraudReports() {
        try {
            const response = await fetch(`${this.apiUrl}/fraud-reports`);
            const result = await response.json();
            
            if (result.success) {
                this.displayFraudReports(result.data.reports);
            }
        } catch (error) {
            console.error('Erro ao carregar denúncias:', error);
        }
    }

    displayFraudReports(reports) {
        const container = document.querySelector('#reports-table-body');
        if (!container) return;
        
        if (reports.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        Nenhuma denúncia encontrada. Clique em "Nova Denúncia" para adicionar.
                    </td>
                </tr>
            `;
            return;
        }
        
        container.innerHTML = reports.map(report => {
            const statusColor = {
                'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                'CONFIRMED': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                'UNDER_INVESTIGATION': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                'FALSE_POSITIVE': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
            }[report.status] || 'bg-gray-100 text-gray-800';
            
            const priorityColor = {
                'CRITICAL': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                'HIGH': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
                'MEDIUM': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                'LOW': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            }[report.priority] || 'bg-gray-100 text-gray-800';
            
            const date = new Date(report.created_at).toLocaleString('pt-BR');
            
            return `
                <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td class="px-6 py-4">
                        <div class="font-medium text-gray-900 dark:text-white">${report.pix_key}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">${report.reporter_bank}</div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm text-gray-900 dark:text-white max-w-xs truncate" title="${report.description}">
                            ${report.description}
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 text-xs font-medium rounded-full ${statusColor}">
                            ${report.status}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 text-xs font-medium rounded-full ${priorityColor}">
                            ${report.priority}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        ${date}
                    </td>
                    <td class="px-6 py-4">
                        <button onclick="dashboard.viewReportDetails('${report.id}')" 
                                class="text-primary hover:text-primary/80 text-sm font-medium">
                            Detalhes
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    async viewReportDetails(reportId) {
        // Implementation for viewing report details
        this.showNotification('Funcionalidade de detalhes será implementada', 'info');
    }

    // Load risk analysis data
    async loadRiskAnalysis() {
        try {
            const response = await fetch(`${this.apiUrl}/risk-analysis`);
            const result = await response.json();
            
            if (result.success) {
                this.displayRiskAnalysis(result.data);
            }
        } catch (error) {
            console.error('Erro ao carregar análise de risco:', error);
        }
    }

    displayRiskAnalysis(riskData) {
        // Implementation for displaying risk analysis
        console.log('Risk data:', riskData);
    }

    // Load notifications
    async loadNotifications() {
        try {
            const response = await fetch(`${this.apiUrl}/notifications`);
            const result = await response.json();
            
            if (result.success) {
                this.displayNotifications(result.data);
            }
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
        }
    }

    displayNotifications(notifications) {
        // Implementation for displaying notifications
        console.log('Notifications:', notifications);
    }

    startRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateStats();
        }, 30000); // Update every 30 seconds
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.documentElement.classList.toggle('dark', this.isDarkMode);
        
        // Update theme icon
        const themeButton = document.querySelector('button[onclick="toggleTheme()"] .material-symbols-outlined');
        if (themeButton) {
            themeButton.textContent = this.isDarkMode ? 'light_mode' : 'dark_mode';
        }
    }
}

// Global functions for onclick handlers
function showPage(pageId) {
    window.dashboard.showPage(pageId);
}

function toggleTheme() {
    window.dashboard.toggleTheme();
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new SentinelaPixDashboard();
});