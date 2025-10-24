# Sistema de Notificações - Sentinela PIX

## Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Canais de Entrega](#canais-de-entrega)
4. [Implementação WebSocket](#implementação-websocket)
5. [Firebase Cloud Messaging](#firebase-cloud-messaging)
6. [Tipos de Notificação](#tipos-de-notificação)
7. [Fluxo de Notificações](#fluxo-de-notificações)
8. [Tratamento de Falhas](#tratamento-de-falhas)
9. [Segurança](#segurança)
10. [Testes](#testes)

## Visão Geral

O sistema de notificações do Sentinela PIX fornece comunicação em tempo real entre o backend e os clientes, permitindo que usuários recebam alertas instantâneos sobre fraudes, atualizações de relatórios e eventos do sistema.

### Características Principais

- Entrega em tempo real via WebSocket
- Notificações push nativas via Firebase Cloud Messaging
- Suporte a múltiplos dispositivos por usuário
- Reconexão automática com backoff exponencial
- Fallback para polling quando WebSocket não disponível
- Persistência de notificações no banco de dados
- Centro de notificações com histórico completo

## Arquitetura

### Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────┐
│              Aplicação Cliente                  │
│  ┌──────────────┐      ┌──────────────┐        │
│  │ WebSocket    │      │   Service    │        │
│  │   Client     │      │   Worker     │        │
│  └──────┬───────┘      └──────┬───────┘        │
└─────────┼──────────────────────┼────────────────┘
          │                      │
          │ WS/WSS               │ HTTPS (FCM)
          │                      │
┌─────────▼──────────────────────▼────────────────┐
│              Servidor Backend                   │
│  ┌──────────────┐      ┌──────────────┐        │
│  │ WebSocket    │      │   Firebase   │        │
│  │   Server     │      │     Admin    │        │
│  └──────┬───────┘      └──────┬───────┘        │
│         │                     │                 │
│  ┌──────▼─────────────────────▼───────┐        │
│  │    Sistema de Notificações         │        │
│  │  - Roteamento                      │        │
│  │  - Enfileiramento                  │        │
│  │  - Persistência                    │        │
│  └──────┬─────────────────────────────┘        │
└─────────┼──────────────────────────────────────┘
          │
┌─────────▼──────────────────────────────────────┐
│         Banco de Dados SQLite                  │
│  - Notificações                                │
│  - Tokens FCM                                  │
│  - Status de entrega                           │
└────────────────────────────────────────────────┘
```

## Canais de Entrega

### 1. WebSocket (Primário)

Canal principal para comunicação em tempo real.

**Características**:
- Latência sub-segundo
- Conexão bidirecional persistente
- Baixo overhead de dados
- Ideal para atualizações frequentes

**Quando usar**:
- Alertas de fraude urgentes
- Atualizações de status em tempo real
- Notificações do sistema
- Sincronização de estado

### 2. Firebase Cloud Messaging (Backup)

Notificações push nativas do navegador.

**Características**:
- Funciona com aba fechada
- Notificações persistentes
- Ícones e ações customizadas
- Suporte multiplataforma

**Quando usar**:
- Usuário não está na aplicação
- Conexão WebSocket não disponível
- Notificações críticas que exigem atenção
- Lembretes e alertas programados

### 3. Centro de Notificações (Fallback)

Interface in-app para visualização de histórico.

**Características**:
- Persistência de longo prazo
- Histórico completo
- Filtros e busca
- Indicadores de leitura

**Quando usar**:
- Revisão de notificações antigas
- Auditoria de eventos
- Quando canais em tempo real falham

## Implementação WebSocket

### Servidor (Backend)

Arquivo: `backend/server.js`

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

// Mapa de conexões ativas: userId -> WebSocket
const activeConnections = new Map();

// Upgrade de conexão HTTP para WebSocket
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Gerenciar nova conexão
wss.on('connection', (ws) => {
  console.log('Nova conexão WebSocket estabelecida');
  
  let userId = null;
  
  // Receber mensagens do cliente
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Identificação do usuário
      if (data.type === 'identify' && data.userId) {
        userId = data.userId;
        activeConnections.set(userId, ws);
        console.log(`Usuário ${userId} conectado via WebSocket`);
        
        // Confirmar identificação
        ws.send(JSON.stringify({
          type: 'identified',
          userId: userId,
          timestamp: new Date().toISOString()
        }));
      }
      
      // Responder ping com pong
      if (data.type === 'ping') {
        ws.send(JSON.stringify({
          type: 'pong',
          timestamp: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Erro ao processar mensagem WebSocket:', error);
    }
  });
  
  // Gerenciar desconexão
  ws.on('close', () => {
    if (userId) {
      activeConnections.delete(userId);
      console.log(`Usuário ${userId} desconectado`);
    }
  });
  
  // Gerenciar erros
  ws.on('error', (error) => {
    console.error('Erro no WebSocket:', error);
  });
});

// Enviar notificação para usuário específico
function sendNotificationViaWebSocket(userId, notification) {
  const ws = activeConnections.get(userId);
  
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'notification',
      data: notification
    }));
    console.log(`Notificação enviada via WebSocket para usuário ${userId}`);
    return true;
  }
  
  return false;
}

// Broadcast para todos os usuários conectados
function broadcastNotification(notification) {
  activeConnections.forEach((ws, userId) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'notification',
        data: notification
      }));
    }
  });
}
```

### Cliente (Frontend)

Arquivo: `frontend/user-system.js`

```javascript
class NotificationSystem {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.baseReconnectDelay = 1000;
    this.heartbeatInterval = null;
  }
  
  // Conectar ao WebSocket
  connectWebSocket(userId, token) {
    const wsUrl = `ws://localhost:3001/ws`;
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected for real-time notifications');
      this.reconnectAttempts = 0;
      
      // Identificar usuário
      this.ws.send(JSON.stringify({
        type: 'identify',
        userId: userId,
        token: token
      }));
      
      // Iniciar heartbeat
      this.startHeartbeat();
    };
    
    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleWebSocketMessage(message);
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      this.stopHeartbeat();
      this.attemptReconnect(userId, token);
    };
  }
  
  // Processar mensagens recebidas
  handleWebSocketMessage(message) {
    switch (message.type) {
      case 'identified':
        console.log('User identified:', message.userId);
        break;
        
      case 'notification':
        this.displayNotification(message.data);
        this.updateNotificationBadge();
        break;
        
      case 'fraud_alert':
        this.handleFraudAlert(message.data);
        break;
        
      case 'status_update':
        this.handleStatusUpdate(message.data);
        break;
        
      case 'pong':
        // Heartbeat recebido
        break;
        
      default:
        console.log('Mensagem desconhecida:', message);
    }
  }
  
  // Tentar reconectar
  attemptReconnect(userId, token) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts);
      console.log(`Tentando reconectar em ${delay}ms (tentativa ${this.reconnectAttempts + 1})`);
      
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connectWebSocket(userId, token);
      }, delay);
    } else {
      console.error('Máximo de tentativas de reconexão alcançado');
      this.startPollingFallback();
    }
  }
  
  // Heartbeat (ping/pong)
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // A cada 30 segundos
  }
  
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  
  // Fallback para polling
  startPollingFallback() {
    console.log('Iniciando fallback para polling');
    
    this.pollingInterval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/notifications?unread=true`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.notifications && data.notifications.length > 0) {
            data.notifications.forEach(notification => {
              this.displayNotification(notification);
            });
          }
        }
      } catch (error) {
        console.error('Erro no polling:', error);
      }
    }, 30000); // A cada 30 segundos
  }
  
  // Exibir notificação na UI
  displayNotification(notification) {
    // Toast notification
    this.showToast(notification);
    
    // Adicionar ao centro de notificações
    this.addToNotificationCenter(notification);
    
    // Atualizar badge
    this.updateNotificationBadge();
  }
  
  showToast(notification) {
    const toast = document.createElement('div');
    toast.className = `notification-toast ${notification.color || 'blue'}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <span class="material-symbols-rounded">${notification.icon || 'info'}</span>
      </div>
      <div class="toast-content">
        <div class="toast-title">${notification.title}</div>
        <div class="toast-message">${notification.message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <span class="material-symbols-rounded">close</span>
      </button>
    `;
    
    document.body.appendChild(toast);
    
    // Remover após 5 segundos
    setTimeout(() => toast.remove(), 5000);
  }
}
```

## Firebase Cloud Messaging

### Configuração

Arquivo: `frontend/firebase-config.js`

```javascript
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "sua_api_key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "seu_sender_id",
  appId: "seu_app_id"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
```

### Solicitar Permissão

```javascript
async requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Permissão de notificação concedida');
      
      // Obter token FCM
      const token = await getToken(messaging, {
        vapidKey: 'SUA_CHAVE_VAPID_PUBLICA'
      });
      
      if (token) {
        console.log('Token FCM:', token);
        await this.saveFCMToken(userId, token);
      }
    } else {
      console.log('Permissão de notificação negada');
    }
  } catch (error) {
    console.error('Erro ao solicitar permissão:', error);
  }
}
```

### Service Worker

Arquivo: `frontend/firebase-messaging-sw.js`

```javascript
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "sua_api_key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "seu_sender_id",
  appId: "seu_app_id"
});

const messaging = firebase.messaging();

// Notificações em background
messaging.onBackgroundMessage((payload) => {
  console.log('Notificação recebida em background:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: payload.data,
    actions: [
      { action: 'view', title: 'Ver Detalhes' },
      { action: 'dismiss', title: 'Dispensar' }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    clients.openWindow('/dashboard.html');
  }
});
```

## Tipos de Notificação

### 1. Alerta de Fraude

```json
{
  "type": "fraud_alert",
  "title": "Novo Alerta de Fraude",
  "message": "Fraude detectada na chave PIX: exemplo@email.com",
  "icon": "warning",
  "color": "red",
  "priority": "high",
  "data": {
    "reportId": "report_id",
    "pixKey": "exemplo@email.com",
    "amount": 5000.00
  }
}
```

### 2. Atualização de Status

```json
{
  "type": "status_update",
  "title": "Status do Relatório Atualizado",
  "message": "Seu relatório foi confirmado como fraude",
  "icon": "check_circle",
  "color": "green",
  "priority": "medium",
  "data": {
    "reportId": "report_id",
    "oldStatus": "pending",
    "newStatus": "confirmed"
  }
}
```

### 3. Anúncio do Sistema

```json
{
  "type": "system",
  "title": "Manutenção Programada",
  "message": "Sistema ficará offline para manutenção em 24/10 às 22:00",
  "icon": "info",
  "color": "blue",
  "priority": "low"
}
```

### 4. Alerta de Segurança

```json
{
  "type": "security",
  "title": "Novo Login Detectado",
  "message": "Login detectado de novo dispositivo em São Paulo",
  "icon": "security",
  "color": "orange",
  "priority": "high",
  "data": {
    "location": "São Paulo, Brasil",
    "device": "Chrome on Windows",
    "timestamp": "2024-10-24T10:30:00Z"
  }
}
```

## Fluxo de Notificações

### Diagrama de Sequência

```
Cliente          WebSocket          Backend          Banco           Firebase
  │                 │                  │               │                │
  │─────Connect────>│                  │               │                │
  │                 │                  │               │                │
  │<────Connected───│                  │               │                │
  │                 │                  │               │                │
  │─────Identify───>│                  │               │                │
  │     (userId)    │                  │               │                │
  │                 │                  │               │                │
  │                 │───Validate──────>│               │                │
  │                 │     Token        │               │                │
  │                 │<────OK───────────│               │                │
  │                 │                  │               │                │
  │<──Identified────│                  │               │                │
  │                 │                  │               │                │
  │                 │                  │<──Event──────┤                │
  │                 │                  │  (Fraude)     │                │
  │                 │                  │               │                │
  │                 │                  │───Save──────>│                │
  │                 │                  │   Notif       │                │
  │                 │                  │<────OK───────│                │
  │                 │                  │               │                │
  │<────Notification│<─────Send────────│               │                │
  │   (WebSocket)   │                  │               │                │
  │                 │                  │               │                │
  │                 │                  │───Send FCM──────────────────>│
  │                 │                  │               │                │
  │<──────────────────────────────────────────────Push Notification───│
  │                 │                  │               │                │
  │────Mark Read───────────────────────>│               │                │
  │                 │                  │───Update────>│                │
  │                 │                  │<────OK───────│                │
  │<─────────────────────────OK─────────│               │                │
```

## Tratamento de Falhas

### Estratégias de Retry

1. **Backoff Exponencial**: Aumenta tempo entre tentativas
2. **Máximo de Tentativas**: Limite de 5 tentativas
3. **Fallback para Polling**: Após falhas de WebSocket
4. **Queue de Mensagens**: Enfileira durante desconexão

### Persistência

Todas as notificações são salvas no banco de dados:
- Garantia de entrega
- Histórico completo
- Recuperação após reconexão
- Auditoria

## Segurança

### Autenticação WebSocket

- Validação de token JWT na identificação
- Verificação de usuário existe no banco
- Timeout de conexões não autenticadas

### Autorização

- Usuários recebem apenas suas notificações
- Admin pode broadcast para todos
- Validação de permissões no backend

### Prevenção de Ataques

- Rate limiting de conexões por IP
- Validação de origem (CORS)
- Sanitização de dados de notificação
- Limite de tamanho de mensagem

## Testes

### Teste Manual

```javascript
// Console do navegador
fetch('http://localhost:3001/api/v1/notifications/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    userId: localStorage.getItem('userId'),
    type: 'test',
    title: 'Teste de Notificação',
    message: 'Esta é uma notificação de teste',
    icon: 'info',
    color: 'blue'
  })
})
.then(r => r.json())
.then(d => console.log(d));
```

### Teste de Reconexão

1. Abrir dashboard
2. Parar servidor backend
3. Observar tentativas de reconexão no console
4. Reiniciar servidor
5. Verificar reconexão automática

### Teste de FCM

1. Fechar aba do navegador
2. Enviar notificação teste do Firebase Console
3. Verificar notificação nativa aparece
4. Clicar na notificação
5. Verificar redirecionamento para aplicação

---

**Última Atualização**: Outubro de 2024
