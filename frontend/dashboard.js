// Sentinela PIX Dashboard JavaScript
class SentinelaPixDashboard {
    constructor() {
        this.currentPage = 'dashboard';
        this.isDarkMode = true;
        this.apiUrl = 'http://localhost:3001/api/v1';
        this.init();
    }

    init() {
        this.loadPage('dashboard');
        this.updateStats();
        this.startRealTimeUpdates();
        
        // Set initial theme
        document.documentElement.classList.toggle('dark', this.isDarkMode);
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
                <!-- Search and Analysis -->
                <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Consulta de Risco PIX</h3>
                    <div class="flex gap-4 items-end">
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chave PIX</label>
                            <input type="text" id="risk-pix-key" placeholder="Digite a chave PIX para análise..." 
                                   class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>
                        <button onclick="dashboard.analyzePixKey()" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors">
                            <span class="material-symbols-outlined">search</span>
                            Analisar
                        </button>
                    </div>
                </div>

                <!-- Risk Analysis Result -->
                <div id="risk-result" class="hidden bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <!-- Dynamic risk analysis content -->
                </div>

                <!-- High Risk Keys -->
                <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Chaves de Alto Risco</h3>
                        <button class="text-primary hover:text-primary/80 text-sm font-medium">Atualizar</button>
                    </div>
                    <div class="grid gap-4">
                        <div class="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                                    <span class="material-symbols-outlined text-red-600 dark:text-red-400">dangerous</span>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-900 dark:text-white">fraudulento@gmail.com</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Score: 85 | 5 denúncias em 24h</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-full text-xs font-medium">CRÍTICO</span>
                                <button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <span class="material-symbols-outlined">more_vert</span>
                                </button>
                            </div>
                        </div>

                        <div class="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
                                    <span class="material-symbols-outlined text-orange-600 dark:text-orange-400">warning</span>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-900 dark:text-white">11111111111</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Score: 65 | 3 denúncias em 12h</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="px-3 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 rounded-full text-xs font-medium">ALTO</span>
                                <button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <span class="material-symbols-outlined">more_vert</span>
                                </button>
                            </div>
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
        // This would fetch real data from API
        // For demo, we'll use mock data
        this.loadMockReports();
    }

    loadMockReports() {
        const mockReports = [
            {
                id: 1,
                pixKey: "fraudulento@gmail.com",
                type: "UNAUTHORIZED_TRANSACTION",
                amount: 1500.00,
                reporterBank: "Banco do Brasil",
                status: "CONFIRMED",
                createdAt: "2024-10-17T14:30:00Z"
            },
            {
                id: 2,
                pixKey: "11111111111",
                type: "ACCOUNT_TAKEOVER",
                amount: 850.00,
                reporterBank: "Caixa Econômica",
                status: "PENDING",
                createdAt: "2024-10-17T13:45:00Z"
            },
            {
                id: 3,
                pixKey: "suspeito@banco.com",
                type: "SOCIAL_ENGINEERING",
                amount: 2300.00,
                reporterBank: "Bradesco",
                status: "CONFIRMED",
                createdAt: "2024-10-17T12:20:00Z"
            }
        ];

        const tbody = document.getElementById('reports-table-body');
        if (tbody) {
            tbody.innerHTML = mockReports.map(report => `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td class="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900 dark:text-white">${report.pixKey}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-full text-xs">
                            ${report.type.replace('_', ' ')}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">R$ ${report.amount.toFixed(2)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">${report.reporterBank}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 ${report.status === 'CONFIRMED' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'} rounded-full text-xs">
                            ${report.status}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        ${new Date(report.createdAt).toLocaleString('pt-BR')}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <button class="text-primary hover:text-primary/80">
                            <span class="material-symbols-outlined">visibility</span>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    async analyzePixKey() {
        const pixKey = document.getElementById('risk-pix-key')?.value;
        if (!pixKey) return;

        // Mock analysis result
        const mockResult = {
            pixKey: pixKey,
            riskLevel: "HIGH_RISK",
            currentScore: 75,
            totalReports: 4,
            reports24h: 3,
            reports7d: 4,
            isBlocked: false,
            recommendation: "Bloqueio recomendado devido ao alto número de denúncias"
        };

        this.displayRiskResult(mockResult);
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

    showReportForm() {
        // This would show a modal or navigate to a form page
        alert('Funcionalidade de nova denúncia seria implementada aqui');
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