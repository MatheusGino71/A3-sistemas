// Sistema de Notificações e Perfil de Usuário - Sentinela PIX

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.fcmToken = null;
        
        // Auto-detecção do ambiente
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            this.apiUrl = 'http://localhost:3001/api/v1';
            this.wsEnabled = true;
        } else {
            this.apiUrl = `${window.location.origin}/api/v1`;
            this.wsEnabled = false; // No WebSocket on Vercel
        }
        
        this.init();
    }

    init() {
        this.loadNotifications();
        this.updateNotificationBadge();
        this.setupEventListeners();
        this.initWebSocket();
        this.initFirebaseMessaging();
        // Fallback: Verificar novas notificações a cada 30 segundos se WebSocket falhar
        setInterval(() => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                this.checkNewNotifications();
            }
        }, 30000);
    }

    // WebSocket para notificações em tempo real
    initWebSocket() {
        // WebSocket não disponível no Vercel
        if (!this.wsEnabled) {
            console.log('⚠️ WebSocket não disponível em ambiente de produção (Vercel)');
            return;
        }
        
        try {
            const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsHost = window.location.hostname === 'localhost' ? 'localhost:3001' : window.location.host;
            
            this.ws = new WebSocket(`${wsProtocol}//${wsHost}/ws`);
            
            this.ws.onopen = () => {
                console.log('✅ WebSocket conectado para notificações em tempo real');
                this.reconnectAttempts = 0;
                
                // Enviar identificação do usuário
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user.uid || user.id) {
                    this.ws.send(JSON.stringify({
                        type: 'identify',
                        userId: user.uid || user.id
                    }));
                }
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    if (data.type === 'notification') {
                        // Nova notificação recebida
                        this.addNotification(data.notification);
                    } else if (data.type === 'notification_read') {
                        // Notificação marcada como lida em outro dispositivo
                        this.syncNotificationRead(data.notificationId);
                    }
                } catch (error) {
                    console.error('Erro ao processar mensagem WebSocket:', error);
                }
            };
            
            this.ws.onerror = (error) => {
                console.error('❌ Erro no WebSocket:', error);
            };
            
            this.ws.onclose = () => {
                console.log('🔌 WebSocket desconectado');
                this.reconnectWebSocket();
            };
        } catch (error) {
            console.error('Erro ao inicializar WebSocket:', error);
        }
    }
    
    reconnectWebSocket() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            console.log(`🔄 Reconectando WebSocket em ${delay/1000}s (tentativa ${this.reconnectAttempts})`);
            setTimeout(() => this.initWebSocket(), delay);
        } else {
            console.log('⚠️ Máximo de tentativas de reconexão atingido. Usando polling como fallback.');
        }
    }
    
    syncNotificationRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            localStorage.setItem('notifications', JSON.stringify(this.notifications));
            this.renderNotifications();
        }
    }

    // Firebase Cloud Messaging para notificações push
    async initFirebaseMessaging() {
        try {
            // Verificar suporte a notificações
            if (!('Notification' in window)) {
                console.log('Este navegador não suporta notificações');
                return;
            }

            // Verificar se já tem permissão
            const permission = Notification.permission;
            if (permission === 'denied') {
                console.log('Permissão de notificações negada pelo usuário');
                return;
            }

            // Solicitar permissão se ainda não foi concedida
            if (permission === 'default') {
                const result = await Notification.requestPermission();
                if (result === 'denied') {
                    console.log('Usuário negou permissão de notificações');
                    return;
                }
            }

            // Importar Firebase Messaging dinamicamente
            const { messaging } = await import('./firebase-config.js');
            const { getToken, onMessage } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');
            
            if (!messaging) {
                console.log('Firebase Messaging não configurado');
                return;
            }

            // Obter token FCM
            try {
                this.fcmToken = await getToken(messaging, {
                    vapidKey: 'BMIX1YvRCm7sT6SnajO-GaK6sj_BftbmOxBYQOTs5rcrKHAjAUlIP02Ojg1wxuZQP-3qyoj5meHkxkSnI-HDhBY'
                });
                
                if (this.fcmToken) {
                    console.log('✅ Token FCM obtido:', this.fcmToken.substring(0, 20) + '...');
                    // Salvar token no backend para envio de notificações
                    this.saveFCMToken(this.fcmToken);
                }
            } catch (error) {
                console.log('Erro ao obter token FCM:', error);
            }

            // Listener para mensagens em primeiro plano
            onMessage(messaging, (payload) => {
                console.log('📬 Mensagem recebida:', payload);
                
                const notification = {
                    type: payload.data?.type || 'info',
                    title: payload.notification?.title || 'Nova Notificação',
                    message: payload.notification?.body || '',
                    icon: payload.data?.icon || 'info',
                    color: payload.data?.color || 'blue'
                };
                
                this.addNotification(notification);
            });

        } catch (error) {
            console.error('Erro ao inicializar Firebase Messaging:', error);
        }
    }
    
    async saveFCMToken(token) {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const response = await fetch(`${this.apiUrl}/users/fcm-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.uid || user.id,
                    fcmToken: token
                })
            });
            
            if (response.ok) {
                console.log('✅ Token FCM salvo no backend');
            }
        } catch (error) {
            console.log('Erro ao salvar token FCM:', error);
        }
    }

    setupEventListeners() {
        // Fechar dropdowns ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#notifications-dropdown') && !e.target.closest('[onclick="toggleNotifications()"]')) {
                document.getElementById('notifications-dropdown')?.classList.add('hidden');
            }
            if (!e.target.closest('#user-menu-dropdown') && !e.target.closest('[onclick="toggleUserMenu()"]')) {
                document.getElementById('user-menu-dropdown')?.classList.add('hidden');
            }
        });
    }

    async loadNotifications() {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            
            // Carregar notificações do localStorage (cache)
            const cachedNotifications = localStorage.getItem('notifications');
            if (cachedNotifications) {
                this.notifications = JSON.parse(cachedNotifications);
                this.renderNotifications();
            }

            // Buscar notificações do backend
            const response = await fetch(`${this.apiUrl}/notifications?userId=${user.uid || user.id}`);
            if (response.ok) {
                const data = await response.json();
                this.notifications = data.notifications || [];
                localStorage.setItem('notifications', JSON.stringify(this.notifications));
                this.renderNotifications();
            }
        } catch (error) {
            console.log('Usando notificações em cache ou criando notificações de exemplo');
            this.createSampleNotifications();
        }
        
        this.updateNotificationBadge();
    }

    createSampleNotifications() {
        if (this.notifications.length === 0) {
            this.notifications = [
                {
                    id: 1,
                    type: 'alert',
                    title: 'Nova tentativa de fraude detectada',
                    message: 'Chave PIX suspeita foi bloqueada automaticamente',
                    time: new Date(Date.now() - 5 * 60000).toISOString(),
                    read: false,
                    icon: 'warning',
                    color: 'red'
                },
                {
                    id: 2,
                    type: 'success',
                    title: 'Relatório processado com sucesso',
                    message: 'Seu relatório de fraude #12345 foi analisado',
                    time: new Date(Date.now() - 30 * 60000).toISOString(),
                    read: false,
                    icon: 'check_circle',
                    color: 'green'
                },
                {
                    id: 3,
                    type: 'info',
                    title: 'Atualização do sistema',
                    message: 'Novas funcionalidades foram adicionadas ao dashboard',
                    time: new Date(Date.now() - 2 * 3600000).toISOString(),
                    read: false,
                    icon: 'info',
                    color: 'blue'
                }
            ];
            localStorage.setItem('notifications', JSON.stringify(this.notifications));
        }
    }

    renderNotifications() {
        const container = document.getElementById('notifications-list');
        if (!container) return;

        if (this.notifications.length === 0) {
            container.innerHTML = `
                <div class="p-8 text-center text-gray-500 dark:text-gray-400">
                    <span class="material-symbols-outlined text-5xl mb-2">notifications_off</span>
                    <p>Nenhuma notificação</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.notifications
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .map(notification => this.createNotificationHTML(notification))
            .join('');

        this.unreadCount = this.notifications.filter(n => !n.read).length;
        this.updateNotificationBadge();
    }

    createNotificationHTML(notification) {
        const timeAgo = this.getTimeAgo(notification.time);
        const colorClasses = {
            red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
            green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
            blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
            yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
        };

        return `
            <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border-b border-gray-200 dark:border-gray-700 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}"
                 onclick="notificationSystem.markAsRead(${notification.id})">
                <div class="flex gap-3">
                    <div class="flex-shrink-0">
                        <div class="w-10 h-10 rounded-full ${colorClasses[notification.color]} flex items-center justify-center">
                            <span class="material-symbols-outlined text-xl">${notification.icon}</span>
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-2">
                            <p class="text-sm font-medium text-gray-900 dark:text-white">
                                ${notification.title}
                                ${!notification.read ? '<span class="inline-block w-2 h-2 bg-blue-600 rounded-full ml-2"></span>' : ''}
                            </p>
                            <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">${timeAgo}</span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">${notification.message}</p>
                    </div>
                </div>
            </div>
        `;
    }

    getTimeAgo(dateString) {
        const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
        
        if (seconds < 60) return 'Agora';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}min atrás`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d atrás`;
        
        return new Date(dateString).toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'short' 
        });
    }

    updateNotificationBadge() {
        const badge = document.getElementById('notification-badge');
        const count = document.getElementById('notification-count');
        
        if (badge && count) {
            if (this.unreadCount > 0) {
                badge.classList.remove('hidden');
                count.textContent = this.unreadCount > 9 ? '9+' : this.unreadCount;
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            notification.read = true;
            localStorage.setItem('notifications', JSON.stringify(this.notifications));
            this.renderNotifications();
            
            // Enviar para o backend
            fetch(`${this.apiUrl}/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            }).catch(err => console.log('Backend offline, mantendo estado local'));
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
        this.renderNotifications();
        
        // Enviar para o backend
        fetch(`${this.apiUrl}/notifications/read-all`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }).catch(err => console.log('Backend offline, mantendo estado local'));
    }

    async checkNewNotifications() {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const response = await fetch(`${this.apiUrl}/notifications/check?userId=${user.uid || user.id}`);
            
            if (response.ok) {
                const data = await response.json();
                if (data.hasNew) {
                    await this.loadNotifications();
                    this.showNewNotificationToast();
                }
            }
        } catch (error) {
            console.log('Verificação de notificações em background falhou');
        }
    }

    showNewNotificationToast() {
        // Toast de nova notificação
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-4 flex items-center gap-3 z-50 animate-slide-in';
        toast.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span class="material-symbols-outlined text-blue-600 dark:text-blue-400">notifications</span>
            </div>
            <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Nova notificação</p>
                <p class="text-xs text-gray-600 dark:text-gray-300">Você tem novas atualizações</p>
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    addNotification(notification) {
        const newNotification = {
            id: Date.now(),
            ...notification,
            time: new Date().toISOString(),
            read: false
        };
        
        this.notifications.unshift(newNotification);
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
        this.renderNotifications();
        this.showNewNotificationToast();
    }
}

// Sistema de Perfil de Usuário
class UserProfileSystem {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.updateUserDisplay();
    }

    loadUserData() {
        const userData = localStorage.getItem('user');
        if (userData) {
            this.user = JSON.parse(userData);
        }
    }

    updateUserDisplay() {
        if (!this.user) return;

        // Atualizar nome e email
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        
        if (userName) userName.textContent = this.user.nome || this.user.displayName || 'Usuário';
        if (userEmail) userEmail.textContent = this.user.email || 'usuario@email.com';

        // Atualizar iniciais
        const initials = this.getInitials(this.user.nome || this.user.displayName || 'Usuário');
        const initialsElements = document.querySelectorAll('#user-initials, #user-avatar span');
        initialsElements.forEach(el => el.textContent = initials);
    }

    getInitials(name) {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0].substring(0, 2).toUpperCase();
    }
}

// Funções globais para os botões
function toggleNotifications() {
    const dropdown = document.getElementById('notifications-dropdown');
    const userMenu = document.getElementById('user-menu-dropdown');
    
    userMenu?.classList.add('hidden');
    dropdown?.classList.toggle('hidden');
}

function toggleUserMenu() {
    const dropdown = document.getElementById('user-menu-dropdown');
    const notifications = document.getElementById('notifications-dropdown');
    
    notifications?.classList.add('hidden');
    dropdown?.classList.toggle('hidden');
}

function markAllAsRead() {
    notificationSystem?.markAllAsRead();
}

function viewAllNotifications() {
    alert('Visualizar todas as notificações - Funcionalidade em desenvolvimento');
    toggleNotifications();
}

function openUserProfile() {
    window.location.href = 'profile.html';
}

function openSettings() {
    window.location.href = 'settings.html';
}

function viewNotificationSettings() {
    window.location.href = 'settings.html#notifications';
}

async function handleLogout() {
    try {
        // Importar Firebase Auth dinamicamente
        const { auth } = await import('./firebase-config.js');
        const { signOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        // Fazer logout do Firebase
        await signOut(auth);
        
        // Limpar localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('notifications');
        
        // Redirecionar para login
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        // Mesmo com erro, limpar dados locais e redirecionar
        localStorage.clear();
        window.location.href = 'login.html';
    }
}

// Inicializar sistemas ao carregar a página
let notificationSystem;
let userProfileSystem;

document.addEventListener('DOMContentLoaded', () => {
    notificationSystem = new NotificationSystem();
    userProfileSystem = new UserProfileSystem();
});

// Exportar para uso global
window.notificationSystem = notificationSystem;
window.userProfileSystem = userProfileSystem;
