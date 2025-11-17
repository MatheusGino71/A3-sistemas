// Sentinela PIX Dashboard JavaScript - Sistema 100% Funcional
class SentinelaPixDashboard {
    constructor() {
        this.currentPage = 'dashboard';
        this.isDarkMode = true;
        this.apiUrl = 'http://localhost:3001/api/v1';
        this.refreshInterval = 5000; // 5 segundos
        this.autoRefreshEnabled = true;
        this.userId = this.getUserId();
        this.init();
    }

    // Get user ID from localStorage or Firebase
    getUserId() {
        // Try to get from Firebase user
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                return user.uid || user.id || 1;
            } catch (e) {
                console.warn('Error parsing user:', e);
            }
        }
        // Default to 1 for testing
        return 1;
    }

    init() {
        this.loadPage('dashboard');
        this.updateStats();
        this.startRealTimeUpdates();
        this.setupAutoRefresh();
        this.setupWebSocket();
        this.setupFirebaseMessaging();
        
        // Set initial theme
        document.documentElement.classList.toggle('dark', this.isDarkMode);
    }

    // Setup WebSocket connection for real-time notifications
    setupWebSocket() {
        // Avoid multiple connection attempts
        if (this.wsConnecting) return;
        this.wsConnecting = true;
        
        const wsUrl = 'ws://localhost:3001/ws';
        console.log('🔌 Conectando ao WebSocket:', wsUrl);
        
        try {
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                console.log('✅ WebSocket conectado');
                this.wsConnecting = false;
                this.wsConnected = true;
                this.showNotification('Conectado ao sistema de notificações em tempo real', 'success');
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📨 Notificação recebida via WebSocket:', data);
                    
                    if (data.type === 'notification') {
                        this.handleNewNotification(data.notification);
                    }
                } catch (error) {
                    console.error('❌ Erro ao processar mensagem WebSocket:', error);
                }
            };
            
            this.ws.onerror = (error) => {
                console.warn('⚠️ WebSocket erro:', error.message || 'Conexão falhou');
                this.wsConnecting = false;
                this.wsConnected = false;
                // Don't show error notification to user - will retry automatically
            };
            
            this.ws.onclose = () => {
                console.log('🔌 WebSocket desconectado. Tentando reconectar em 5s...');
                this.wsConnecting = false;
                this.wsConnected = false;
                setTimeout(() => this.setupWebSocket(), 5000);
            };
        } catch (error) {
            console.error('❌ Erro ao criar WebSocket:', error);
            this.wsConnecting = false;
            setTimeout(() => this.setupWebSocket(), 5000);
        }
    }

    // Handle new notification received
    handleNewNotification(notification) {
        console.log('🔔 Nova notificação:', notification);
        
        // Show toast notification
        this.showNotification(notification.message || notification.title, 'info');
        
        // Update notification badge
        this.updateNotificationBadge();
        
        // Play notification sound (optional)
        this.playNotificationSound();
        
        // If user is on notifications page, refresh the list
        if (this.currentPage === 'notifications') {
            this.loadNotifications();
        }
        
        // Request browser notification permission if not granted
        if (Notification.permission === 'granted') {
            new Notification(notification.title || 'Nova Notificação ZENIT', {
                body: notification.message,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: 'sentinela-pix',
                requireInteraction: false
            });
        }
    }

    // Update notification badge with unread count
    async updateNotificationBadge() {
        try {
            const response = await fetch(`${this.apiUrl}/notifications/check?userId=${this.userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const badge = document.getElementById('notification-badge');
                const count = document.getElementById('notification-count');
                
                if (data.hasNew && data.unreadCount > 0) {
                    if (badge) {
                        badge.classList.remove('hidden');
                    }
                    if (count) {
                        count.textContent = data.unreadCount > 99 ? '99+' : data.unreadCount;
                    }
                } else {
                    if (badge) {
                        badge.classList.add('hidden');
                    }
                }
            }
        } catch (error) {
            console.error('❌ Erro ao atualizar badge de notificações:', error);
        }
    }

    // Play notification sound
    playNotificationSound() {
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKfo77RiGwU7k9jzwHkpBSh+zPLaizsKFV+16uupVRQKRp/g8r5sIQUrgs/y2Ik2Bhxpve/mnE4MDk+n6O+0YhsFO5PY88B5KQYof8zy2os7ChZfterpqVUUCkaf4PK+bCEFK4PP8tiJNgYcab3v5pxODA5Pp+jvtGIbBTuU2PLBeSgFJ3/N8tuLOwoWX7Xq6qlVFApGn+DyvmshBSuDz/LYiTYGHGm97+acTgwOT6fo77RiGwU7lNjzwXkoBSh/zfLaizsKFl+16uqpVRQKRp/g8r5sIQUrg8/y2Ik2Bhxpve/mnE4MDk+n6O+0YhsFO5TY88F5KAUof83y2os7ChZfterpqVUUCkaf4PK+bCEFK4PP8tiJNgYcab3v5pxODA5Pp+jvtGIbBTuU2PPBeSgFKH/N8tqLOwoWX7Xq6qlVFApGn+DyvmwhBSuDz/LYiTYGHGm97+acTgwOT6fo77RiGwU7lNjzwXkoBSh/zfLaizsKFl+16uqpVRQKRp/g8r5sIQUrg8/y2Ik2Bhxpve/mnE4MDk+n6O+0YhsFO5TY88F5KAUof83y2os7ChZfterpqVUUCkaf4PK+bCEFK4PP8tiJNgYcab3v5pxODA5Pp+jvtGIbBTuU2PPBeSgFKH/N8tqLOwoWX7Xq6qlVFApGn+DyvmwhBSuDz/LYiTYGHGm97+acTgwOT6fo77RiGwU7lNjzwXkoBSh/zfLaizsKFl+16uqpVRQKRp/g8r5sIQUrg8/y2Ik2Bhxpve/mnE4MDk+n6O+0YhsFO5TY88F5KAUof83y2os7ChZfterpqVUUCkaf4PK+bCEFK4PP8tiJNgYcab3v5pxODA5Pp+jvtGIbBTuU2PPBeSgFKH/N8tqLOwoWX7Xq6qlVFApGn+DyvmwhBSuDz/LYiTYGHGm97+acTgwOT6fo77RiGwU7lNjzwXkoBSh/zfLaizsKFl+16uqpVRQKRp/g8r5sIQUrg8/y2Ik2Bhxpve/mnE4MDk+n6O+0YhsFO5TY88F5KAUof83y2os7ChZfterpqVUUCkaf4PK+bCEFK4PP8tiJNgYcab3v5pxODA5Pp+jvtGIbBTuU2PPBeSgFKH/N8tqLOwA=');
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Ignore errors if autoplay is blocked
        } catch (error) {
            // Ignore sound errors
        }
    }

    // Setup Firebase Cloud Messaging
    async setupFirebaseMessaging() {
        try {
            // Check if notifications are supported
            if (!('Notification' in window)) {
                console.warn('⚠️ Navegador não suporta notificações');
                return;
            }
            
            // Import Firebase config
            const firebaseModule = await import('./firebase-config.js').catch(() => null);
            
            if (!firebaseModule || !firebaseModule.messaging) {
                console.warn('⚠️ Firebase Messaging não está disponível - continuando sem push notifications');
                return;
            }
            
            const { messaging } = firebaseModule;
            
            // Request notification permission
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                console.log('✅ Permissão de notificação concedida');
                
                // Register service worker
                if ('serviceWorker' in navigator) {
                    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(() => null);
                    
                    if (!registration) {
                        console.warn('⚠️ Service Worker não pôde ser registrado');
                        return;
                    }
                    
                    console.log('✅ Service Worker registrado');
                    
                    // Get FCM token (optional - requires VAPID key)
                    // Uncomment when you have a VAPID key from Firebase Console
                    /*
                    const { getToken } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');
                    const token = await getToken(messaging, {
                        vapidKey: 'YOUR_VAPID_KEY',
                        serviceWorkerRegistration: registration
                    });
                    
                    if (token) {
                        console.log('✅ FCM Token obtido');
                        await this.saveFCMToken(token);
                    }
                    */
                }
            } else {
                console.warn('⚠️ Permissão de notificação não concedida');
            }
        } catch (error) {
            console.warn('⚠️ Firebase Messaging não disponível:', error.message);
            // Continue without Firebase - WebSocket notifications will still work
        }
    }

    // Save FCM token to backend
    async saveFCMToken(token) {
        try {
            const response = await fetch(`${this.apiUrl}/users/fcm-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ fcm_token: token })
            });
            
            if (response.ok) {
                console.log('✅ FCM Token salvo no backend');
            } else {
                console.error('❌ Erro ao salvar FCM Token');
            }
        } catch (error) {
            console.error('❌ Erro ao salvar FCM Token:', error);
        }
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
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descrição</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prioridade</th>
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
                                <p id="notifications-sent" class="text-2xl font-bold text-gray-900 dark:text-white">0</p>
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
                                <p id="notifications-success" class="text-2xl font-bold text-gray-900 dark:text-white">0</p>
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
                                <p id="notifications-failed" class="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Notifications -->
                <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Notificações Recentes</h3>
                        <div class="flex gap-2">
                            <button onclick="window.dashboard.loadNotifications()" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                                <span class="material-symbols-outlined text-lg">refresh</span>
                                Atualizar
                            </button>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Notificação</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Mensagem</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Hora</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody id="notifications-table-body" class="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr>
                                    <td colspan="5" class="px-6 py-12 text-center">
                                        <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-2">notifications_off</span>
                                        <p class="text-gray-500 dark:text-gray-400">Nenhuma notificação enviada ainda</p>
                                        <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Notificações aparecerão aqui quando forem enviadas</p>
                                    </td>
                                </tr>
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
                        <p id="api-uptime" class="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Uptime</p>
                    </div>

                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="font-semibold text-gray-900 dark:text-white">Fraud Service</h4>
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <p id="fraud-response" class="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Avg Response</p>
                    </div>

                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="font-semibold text-gray-900 dark:text-white">Risk Analysis</h4>
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <p id="risk-response" class="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Avg Response</p>
                    </div>

                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="font-semibold text-gray-900 dark:text-white">Notifications</h4>
                            <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
                        </div>
                        <p id="notif-response" class="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Avg Response</p>
                    </div>
                </div>

                <!-- System Metrics -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">CPU Usage</h3>
                        <div class="h-64 flex items-center justify-center">
                            <div class="text-center">
                                <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-2">memory</span>
                                <p class="text-gray-500 dark:text-gray-400">Métricas em tempo real</p>
                                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Dados aparecerão quando disponíveis</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Memory Usage</h3>
                        <div class="h-64 flex items-center justify-center">
                            <div class="text-center">
                                <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-2">storage</span>
                                <p class="text-gray-500 dark:text-gray-400">Métricas em tempo real</p>
                                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Dados aparecerão quando disponíveis</p>
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
            console.log('updateStats: Iniciando, currentPage =', this.currentPage);
            const response = await fetch(`${this.apiUrl}/dashboard/stats`);
            const result = await response.json();
            console.log('updateStats: Resposta stats:', result);
            
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
                
                // Update charts if on dashboard page
                if (this.currentPage === 'dashboard') {
                    console.log('Atualizando gráficos do dashboard...');
                    this.updateActivityChart();
                    this.updateRiskLevelsChart();
                    this.updateRecentAlerts();
                }
            }
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            // Silently fail - no notification shown
        }
    }
    
    async updateActivityChart() {
        try {
            console.log('updateActivityChart: Iniciando...');
            const response = await fetch(`${this.apiUrl}/fraud-reports?limit=100`);
            const result = await response.json();
            console.log('updateActivityChart: Resposta da API:', result);
            
            const reports = (result.success && result.data && result.data.reports) ? result.data.reports : [];
            console.log('updateActivityChart: Total de reports:', reports.length);
            
            // Group reports by date (last 7 days)
            const last7Days = [];
            const counts = {};
            const today = new Date();
            
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                last7Days.push(dateStr);
                counts[dateStr] = 0;
            }
            
            // Count reports per day
            reports.forEach(report => {
                const reportDate = new Date(report.created_at);
                const dateStr = reportDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                if (counts.hasOwnProperty(dateStr)) {
                    counts[dateStr]++;
                }
            });
            
            const chartElement = document.getElementById('activity-chart');
            const totalElement = document.getElementById('chart-total');
            
            if (totalElement) {
                totalElement.textContent = reports.length;
            }
            
            if (chartElement) {
                const maxValue = Math.max(...Object.values(counts), 1);
                
                chartElement.innerHTML = `
                    <div class="flex items-end justify-between h-full gap-2 px-4">
                        ${last7Days.map(day => {
                            const count = counts[day];
                            const height = (count / maxValue) * 100;
                            return `
                                <div class="flex flex-col items-center flex-1 group">
                                    <div class="relative w-full">
                                        <div class="bg-primary/20 dark:bg-primary/30 rounded-t-lg transition-all duration-300 group-hover:bg-primary/40" 
                                             style="height: ${height > 5 ? height : 5}%; min-height: 4px">
                                        </div>
                                        <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                            ${count} denúncias
                                        </div>
                                    </div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">${day}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }
        } catch (error) {
            console.error('Erro ao atualizar gráfico de atividade:', error);
        }
    }
    
    async updateRiskLevelsChart() {
        try {
            console.log('updateRiskLevelsChart: Iniciando...');
            const response = await fetch(`${this.apiUrl}/fraud-reports?limit=100`);
            const result = await response.json();
            console.log('updateRiskLevelsChart: Resposta da API:', result);
            
            const reports = (result.success && result.data && result.data.reports) ? result.data.reports : [];
            console.log('updateRiskLevelsChart: Total de reports:', reports.length);
            
            // Count by priority
            const counts = {
                'CRITICAL': 0,
                'HIGH': 0,
                'MEDIUM': 0,
                'LOW': 0
            };
            
            reports.forEach(report => {
                if (counts.hasOwnProperty(report.priority)) {
                    counts[report.priority]++;
                }
            });
            
            const total = Object.values(counts).reduce((a, b) => a + b, 0);
            
            const chartElement = document.getElementById('risk-levels');
            if (!chartElement) return;
            
            if (total === 0) {
                chartElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"><p>Crie denúncias para ver a distribuição de riscos</p></div>';
                return;
            }
            
            const colors = {
                'CRITICAL': { bg: 'bg-red-500', text: 'text-red-500' },
                'HIGH': { bg: 'bg-orange-500', text: 'text-orange-500' },
                'MEDIUM': { bg: 'bg-yellow-500', text: 'text-yellow-500' },
                'LOW': { bg: 'bg-green-500', text: 'text-green-500' }
            };
            
            const labels = {
                'CRITICAL': 'Crítica',
                'HIGH': 'Alta',
                'MEDIUM': 'Média',
                'LOW': 'Baixa'
            };
            
            chartElement.innerHTML = `
                <div class="space-y-4 w-full">
                    ${Object.entries(counts).filter(([_, count]) => count > 0).map(([level, count]) => {
                        const percentage = ((count / total) * 100).toFixed(1);
                        return `
                            <div>
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="font-medium text-gray-700 dark:text-gray-300">${labels[level]}</span>
                                    <span class="${colors[level].text} font-semibold">${count} (${percentage}%)</span>
                                </div>
                                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div class="${colors[level].bg} h-3 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Erro ao atualizar níveis de risco:', error);
        }
    }
    
    async updateRecentAlerts() {
        try {
            console.log('updateRecentAlerts: Iniciando...');
            const response = await fetch(`${this.apiUrl}/fraud-reports?limit=5`);
            const result = await response.json();
            console.log('updateRecentAlerts: Resposta da API:', result);
            
            const reports = (result.success && result.data && result.data.reports) ? result.data.reports : [];
            console.log('updateRecentAlerts: Total de reports:', reports.length);
            
            const alertsElement = document.getElementById('recent-alerts');
            if (!alertsElement) return;
            
            if (reports.length === 0) {
                alertsElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"><p>Nenhum alerta recente</p></div>';
                return;
            }
            
            const priorityIcons = {
                'CRITICAL': { icon: 'error', color: 'text-red-500' },
                'HIGH': { icon: 'warning', color: 'text-orange-500' },
                'MEDIUM': { icon: 'info', color: 'text-yellow-500' },
                'LOW': { icon: 'check_circle', color: 'text-green-500' }
            };
            
            alertsElement.innerHTML = `
                <div class="space-y-3">
                    ${reports.slice(0, 5).map(report => {
                        const date = new Date(report.created_at);
                        const timeAgo = this.getTimeAgo(date);
                        const priority = priorityIcons[report.priority] || priorityIcons['LOW'];
                        
                        return `
                            <div class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                                 onclick="dashboard.viewReportDetails('${report.id}')">
                                <span class="material-symbols-outlined ${priority.color} text-2xl">${priority.icon}</span>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        Denúncia de fraude - ${report.pix_key}
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        ${report.description}
                                    </p>
                                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        ${timeAgo}
                                    </p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Erro ao atualizar alertas recentes:', error);
        }
    }
    
    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 60) return 'Agora mesmo';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min atrás`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h atrás`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d atrás`;
        return date.toLocaleDateString('pt-BR');
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
            } else {
                alert(`Erro na análise: ${result.message}`);
            }
        } catch (error) {
            console.error('Erro ao analisar chave PIX:', error);
            alert('Erro de conexão. Verifique se o backend está rodando.');
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
            alert('Por favor, digite uma chave PIX');
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/pix-keys/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pixKey })
            });

            const result = await response.json();

            if (result.success) {
                this.displaySecurityResult(result.data);
            } else {
                alert(`Erro: ${result.message}`);
            }
        } catch (error) {
            console.error('Erro ao verificar segurança:', error);
            alert('Erro de conexão. Verifique se o backend está rodando.');
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
            alert('Por favor, preencha a chave PIX');
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/pix-keys/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pixKey, ownerName, ownerDocument, bankName })
            });

            const result = await response.json();

            if (result.success) {
                alert('Chave PIX cadastrada com sucesso!');
                
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
                alert(`Erro: ${result.message}`);
            }
        } catch (error) {
            console.error('Erro ao cadastrar chave PIX:', error);
            alert('Erro de conexão. Verifique se o backend está rodando.');
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
        console.log('🚀 submitFraudReport INICIADO');
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Debug logging
        console.log('📤 Enviando denúncia:', data);
        console.log('🔗 URL:', `${this.apiUrl}/fraud-reports`);
        
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
            
            console.log('📥 Status da resposta:', response.status);
            const result = await response.json();
            console.log('📥 Resultado:', result);
            
            if (result.errors && result.errors.length > 0) {
                console.error('❌ Erros de validação:', result.errors);
                result.errors.forEach((err, idx) => {
                    console.error(`  ${idx + 1}. ${err.field}: ${err.message}`);
                });
            }
            
            if (result.success) {
                alert('Denúncia enviada com sucesso! O sistema está processando automaticamente.');
                form.closest('.fixed').remove();
                
                // Refresh the reports page if we're on it
                if (this.currentPage === 'reports') {
                    this.loadFraudReports();
                }
                
                // Update stats
                this.updateStats();
                
            } else {
                alert(`Erro: ${result.message}`);
            }
        } catch (error) {
            console.error('❌ Erro ao enviar denúncia:', error);
            alert('Erro de conexão. Tente novamente.');
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
                    <td colspan="7" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
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
            
            // Format currency
            const formatCurrency = (value) => {
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(value || 0);
            };
            
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
                        <div class="font-medium text-gray-900 dark:text-white">
                            ${formatCurrency(report.amount)}
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
        try {
            const response = await fetch(`${this.apiUrl}/fraud-reports/${reportId}`);
            const result = await response.json();
            
            if (!result.success) {
                alert('Erro ao carregar detalhes da denúncia');
                return;
            }
            
            const report = result.data;
            
            // Format status and priority
            const statusLabels = {
                'PENDING': 'Pendente',
                'CONFIRMED': 'Confirmado',
                'UNDER_INVESTIGATION': 'Em Investigação',
                'FALSE_POSITIVE': 'Falso Positivo'
            };
            
            const priorityLabels = {
                'CRITICAL': 'Crítica',
                'HIGH': 'Alta',
                'MEDIUM': 'Média',
                'LOW': 'Baixa'
            };
            
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
            
            const createdDate = new Date(report.created_at).toLocaleString('pt-BR');
            const updatedDate = report.updated_at ? new Date(report.updated_at).toLocaleString('pt-BR') : 'N/A';
            
            // Format currency
            const formatCurrency = (value) => {
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(value || 0);
            };
            
            // Create modal
            const modalHtml = `
                <div id="reportDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
                            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Detalhes da Denúncia</h2>
                            <button onclick="document.getElementById('reportDetailsModal').remove()" 
                                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <span class="material-symbols-outlined text-3xl">close</span>
                            </button>
                        </div>
                        
                        <div class="p-6 space-y-6">
                            <!-- Status e Prioridade -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                                    <span class="px-3 py-2 text-sm font-medium rounded-lg ${statusColor} inline-block">
                                        ${statusLabels[report.status] || report.status}
                                    </span>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prioridade</label>
                                    <span class="px-3 py-2 text-sm font-medium rounded-lg ${priorityColor} inline-block">
                                        ${priorityLabels[report.priority] || report.priority}
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Chave PIX e Valor -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chave PIX</label>
                                    <p class="text-gray-900 dark:text-white font-mono bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        ${report.pix_key}
                                    </p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor da Transação</label>
                                    <p class="text-gray-900 dark:text-white font-bold text-lg bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        ${formatCurrency(report.amount)}
                                    </p>
                                </div>
                            </div>
                            
                            <!-- Banco e ID da Transação -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Banco/Instituição</label>
                                    <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        ${report.reporter_bank || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ID da Transação</label>
                                    <p class="text-gray-900 dark:text-white font-mono text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        ${report.transaction_id || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            
                            <!-- Descrição -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição da Fraude</label>
                                <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-4 rounded-lg whitespace-pre-wrap">
                                    ${report.description}
                                </p>
                            </div>
                            
                            <!-- Informações da Vítima -->
                            ${report.victim_info ? `
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Informações da Vítima</label>
                                <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-4 rounded-lg whitespace-pre-wrap">
                                    ${report.victim_info}
                                </p>
                            </div>
                            ` : ''}
                            
                            <!-- Datas -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data de Criação</label>
                                    <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        ${createdDate}
                                    </p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Última Atualização</label>
                                    <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        ${updatedDate}
                                    </p>
                                </div>
                            </div>
                            
                            <!-- ID do Relatório -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ID do Relatório</label>
                                <p class="text-gray-500 dark:text-gray-400 font-mono text-xs bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                    ${report.id}
                                </p>
                            </div>
                        </div>
                        
                        <div class="sticky bottom-0 bg-gray-50 dark:bg-gray-900 p-6 border-t border-gray-200 dark:border-gray-700">
                            <button onclick="document.getElementById('reportDetailsModal').remove()" 
                                    class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition">
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add modal to page
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            
        } catch (error) {
            console.error('Erro ao visualizar detalhes:', error);
            alert('Erro ao carregar detalhes da denúncia');
        }
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
            console.log('📥 Carregando notificações para userId:', this.userId);
            const response = await fetch(`${this.apiUrl}/notifications?userId=${this.userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await response.json();
            console.log('📥 Resposta das notificações:', result);
            
            if (result.success) {
                console.log('✅ Notificações recebidas:', result.notifications?.length || 0);
                this.displayNotifications(result.notifications || []);
            } else {
                console.warn('⚠️ Falha ao carregar notificações:', result.message);
                this.displayNotifications([]);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar notificações:', error);
            this.displayNotifications([]);
        }
    }

    // Load recent notifications for dropdown
    async loadRecentNotifications() {
        try {
            const response = await fetch(`${this.apiUrl}/notifications?userId=${this.userId}&limit=5`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                const notificationsList = document.getElementById('notifications-list');
                const notifications = result.notifications || [];
                
                if (result.success && notifications.length > 0) {
                    notificationsList.innerHTML = notifications.map(notif => `
                        <div class="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${notif.read_at ? 'opacity-60' : ''}">
                            <div class="flex items-start gap-3">
                                <div class="flex-shrink-0 w-10 h-10 rounded-full ${notif.color || 'bg-blue-500'} flex items-center justify-center">
                                    <span class="material-symbols-outlined text-white">${notif.icon || 'notifications'}</span>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 dark:text-white">${notif.title || 'Notificação'}</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${notif.message}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        ${new Date(notif.created_at).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                                ${!notif.read_at ? '<div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>' : ''}
                            </div>
                        </div>
                    `).join('');
                } else {
                    notificationsList.innerHTML = `
                        <div class="p-8 text-center text-gray-500 dark:text-gray-400">
                            <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-2">notifications_off</span>
                            <p>Nenhuma notificação recente</p>
                        </div>
                    `;
                }
            }
        } catch (error) {
            console.error('Erro ao carregar notificações recentes:', error);
        }
    }

    displayNotifications(notifications) {
        console.log('Exibindo notificações:', notifications);
        
        const container = document.getElementById('notifications-table-body');
        if (!container) {
            console.warn('Container de notificações não encontrado');
            return;
        }
        
        if (!notifications || notifications.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="7" class="px-6 py-12 text-center">
                        <div class="flex flex-col items-center justify-center">
                            <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">notifications_off</span>
                            <p class="text-gray-500 dark:text-gray-400 text-lg mb-2">Nenhuma notificação encontrada</p>
                            <p class="text-gray-400 dark:text-gray-500 text-sm">As notificações aparecerão aqui quando forem enviadas</p>
                        </div>
                    </td>
                </tr>
            `;
            
            // Update stats
            document.getElementById('notifications-sent').textContent = '0';
            document.getElementById('notifications-success').textContent = '0';
            document.getElementById('notifications-failed').textContent = '0';
            return;
        }
        
        // Update stats
        const sent = notifications.length;
        const success = notifications.filter(n => n.read_at).length;
        const failed = 0; // No failed status in current implementation
        
        document.getElementById('notifications-sent').textContent = sent;
        document.getElementById('notifications-success').textContent = success;
        document.getElementById('notifications-failed').textContent = failed;
        
        // Render table
        container.innerHTML = notifications.map(notif => {
            const statusClass = notif.read_at ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            const statusText = notif.read_at ? 'Lida' : 'Não lida';
            const iconColor = notif.color || 'bg-blue-500';
            
            return `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 ${iconColor} rounded-full flex items-center justify-center flex-shrink-0">
                                <span class="material-symbols-outlined text-white">${notif.icon || 'notifications'}</span>
                            </div>
                            <div>
                                <p class="font-medium text-gray-900 dark:text-white">${notif.title || 'Notificação'}</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">${notif.type || 'info'}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <p class="text-sm text-gray-900 dark:text-white max-w-md">${notif.message || '-'}</p>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        ${new Date(notif.created_at || notif.time).toLocaleString('pt-BR', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </td>
                    <td class="px-6 py-4">
                        <span class="px-3 py-1 text-xs font-medium rounded-full ${statusClass}">
                            ${statusText}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        ${!notif.read_at ? `
                            <button onclick="markAsRead('${notif.id}')" class="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                                Marcar como lida
                            </button>
                        ` : `
                            <span class="text-gray-400 text-sm">-</span>
                        `}
                    </td>
                </tr>
            `;
        }).join('');
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

// Toggle notifications dropdown
function toggleNotifications() {
    const dropdown = document.getElementById('notifications-dropdown');
    dropdown.classList.toggle('hidden');
    
    if (!dropdown.classList.contains('hidden')) {
        window.dashboard.loadRecentNotifications();
    }
}

// Mark all notifications as read
async function markAllAsRead() {
    try {
        const response = await fetch(`${window.dashboard.apiUrl}/notifications/read-all`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            window.dashboard.updateNotificationBadge();
            window.dashboard.loadRecentNotifications();
            window.dashboard.showNotification('Todas as notificações foram marcadas como lidas', 'success');
        }
    } catch (error) {
        console.error('Erro ao marcar notificações como lidas:', error);
    }
}

// View all notifications
function viewAllNotifications() {
    document.getElementById('notifications-dropdown').classList.add('hidden');
    showPage('notifications');
}

// Mark single notification as read
async function markAsRead(notificationId) {
    try {
        const response = await fetch(`${window.dashboard.apiUrl}/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            window.dashboard.showNotification('Notificação marcada como lida', 'success');
            window.dashboard.loadNotifications();
            window.dashboard.updateNotificationBadge();
        }
    } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error);
    }
}

// Toggle user menu
function toggleUserMenu() {
    // Implementation for user menu
    console.log('Toggle user menu');
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new SentinelaPixDashboard();
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        const notificationDropdown = document.getElementById('notifications-dropdown');
        const notificationButton = e.target.closest('button[onclick="toggleNotifications()"]');
        
        if (!notificationButton && !notificationDropdown.contains(e.target)) {
            notificationDropdown.classList.add('hidden');
        }
    });
    
    // Update notification badge every 30 seconds
    setInterval(() => {
        window.dashboard.updateNotificationBadge();
    }, 30000);
});