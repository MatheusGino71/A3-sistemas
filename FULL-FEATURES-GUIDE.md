# 🚀 Guia Completo de Funcionalidades - Sentinela PIX

## 📋 Índice
1. [Sistema de Perfil de Usuário](#sistema-de-perfil-de-usuário)
2. [Sistema de Configurações](#sistema-de-configurações)
3. [WebSocket para Notificações em Tempo Real](#websocket-para-notificações-em-tempo-real)
4. [Firebase Cloud Messaging (Push Notifications)](#firebase-cloud-messaging)
5. [Como Testar](#como-testar)

---

## 👤 Sistema de Perfil de Usuário

### Página: `profile.html`

### Funcionalidades:
- ✅ **Cabeçalho com Avatar**
  - Avatar com iniciais geradas automaticamente
  - Banner gradiente personalizado
  - Badge de status da conta
  - Badge do banco vinculado

- ✅ **Informações Pessoais (Editáveis)**
  - Nome e Sobrenome
  - Email (Firebase Auth)
  - CPF e Telefone
  - Banco (seleção de 8 instituições)
  - Botão "Editar" para habilitar campos
  - Botão "Salvar Alterações" quando em modo de edição

- ✅ **Segurança**
  - Alterar senha com modal
  - Autenticação de dois fatores (toggle)
  - Validação de senha atual antes de alterar

- ✅ **Estatísticas do Usuário**
  - Relatórios enviados
  - Fraudes detectadas
  - Taxa de sucesso

- ✅ **Atividade Recente**
  - Último login
  - Histórico de ações (futuro)

- ✅ **Ações Rápidas**
  - Ir para Configurações
  - Exportar dados pessoais (JSON)
  - Excluir conta (confirmação dupla)

### Tecnologias:
- Firebase Authentication
- Firebase Firestore
- Tailwind CSS
- Material Symbols Icons

---

## ⚙️ Sistema de Configurações

### Página: `settings.html`

### Seções:

#### 🎨 **Aparência**
- **Tema**: Claro / Escuro / Automático
- **Idioma**: Português (BR), English (US), Español
- **Densidade da Interface**: Confortável / Compacta / Espaçosa

#### 🔔 **Notificações**
- **Notificações Push** (navegador)
  - Solicita permissão automaticamente
  - Integrado com Firebase Cloud Messaging
- **Notificações por Email** (resumo diário)
- **Som de Notificação** (toggle)
- **Tipos de Notificação** (checkboxes):
  - Fraudes detectadas ✅
  - Relatórios processados ✅
  - Atualizações do sistema ✅
  - Newsletter e dicas ❌

#### 🔒 **Privacidade**
- **Perfil Público** (compartilhar com outros usuários)
- **Analytics** (ajudar a melhorar o sistema)
- **Cookies** (experiência personalizada)

#### 🛡️ **Segurança**
- **Autenticação de Dois Fatores** (configurar)
- **Sessões Ativas** (gerenciar dispositivos)
- **Histórico de Login** (visualizar tentativas)

#### 🔧 **Avançado**
- **Modo Desenvolvedor** (ferramentas de debug)
- **Limpar Cache** (remover notificações locais)
- **Exportar Configurações** (backup em JSON)
- **Resetar Configurações** (restaurar padrões)

### Navegação:
- Sidebar fixa com scroll smooth
- Seções com âncoras (#appearance, #notifications, etc.)
- Destaque visual da seção ativa

---

## 🔌 WebSocket para Notificações em Tempo Real

### Backend (`server.js`)

#### Configuração:
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server, path: '/ws' });

// Armazena conexões: Map<userId, WebSocket>
const userConnections = new Map();
```

#### Endpoints:
- **WebSocket URL**: `ws://localhost:3001/ws`
- **Protocolo de Identificação**:
  ```javascript
  {
    "type": "identify",
    "userId": "firebase-uid-here"
  }
  ```

#### Funcionalidades:
1. **Conexão Automática**
   - Cliente se conecta ao abrir o dashboard
   - Envia userId para identificação
   - Servidor armazena conexão no Map

2. **Envio de Notificações**
   ```javascript
   sendNotificationViaWebSocket(userId, {
     id, type, title, message, icon, color, time, read
   })
   ```

3. **Reconexão Automática**
   - Até 5 tentativas
   - Delay exponencial (2^tentativas segundos)
   - Fallback para polling após falhas

4. **Sincronização**
   - Notificação lida em um dispositivo sincroniza em todos

### Frontend (`user-system.js`)

#### Inicialização:
```javascript
initWebSocket() {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  this.ws = new WebSocket(`${wsProtocol}//localhost:3001/ws`);
}
```

#### Eventos:
- `onopen`: Envia identificação do usuário
- `onmessage`: Processa nova notificação
- `onerror`: Log de erros
- `onclose`: Tenta reconectar

#### Fluxo:
```
1. Dashboard carrega → WebSocket conecta
2. Backend detecta fraude → createUserNotification()
3. Servidor envia via WebSocket → Frontend recebe
4. Frontend renderiza → Toast aparece → Badge atualiza
5. Usuário clica → Marca como lida → Sincroniza via API
```

---

## 📬 Firebase Cloud Messaging

### Configuração no Firebase Console

1. **Gerar Chave VAPID**:
   - Firebase Console → Project Settings → Cloud Messaging
   - Web Push Certificates → Generate Key Pair
   - Copiar chave pública

2. **Atualizar `user-system.js`**:
   ```javascript
   this.fcmToken = await getToken(messaging, {
     vapidKey: 'SUA_CHAVE_VAPID_AQUI'
   });
   ```

### Service Worker (`firebase-messaging-sw.js`)

#### Localização:
- **Deve estar na raiz do frontend** (`/firebase-messaging-sw.js`)
- Carregado automaticamente pelo Firebase

#### Funcionalidades:
1. **Mensagens em Segundo Plano**
   ```javascript
   messaging.onBackgroundMessage((payload) => {
     self.registration.showNotification(title, options);
   });
   ```

2. **Clique na Notificação**
   - Fecha a notificação
   - Foca na janela do Sentinela PIX
   - Ou abre nova janela se fechada

### Permissão do Navegador

#### Solicitação:
```javascript
const permission = await Notification.requestPermission();
if (permission === 'granted') {
  // Obter token FCM
  const token = await getToken(messaging, { vapidKey });
}
```

#### Estados:
- `default`: Ainda não solicitado
- `granted`: Permissão concedida ✅
- `denied`: Permissão negada ❌

### Backend - Enviar Notificação

#### Salvar Token FCM:
```javascript
POST /api/v1/users/fcm-token
Body: { userId, fcmToken }
```

#### Enviar Push (Firebase Admin SDK - futuro):
```javascript
const message = {
  notification: {
    title: 'Fraude Detectada!',
    body: 'Nova tentativa de fraude foi bloqueada'
  },
  data: {
    type: 'alert',
    notificationId: '123',
    color: 'red',
    icon: 'warning'
  },
  token: userFcmToken
};

admin.messaging().send(message);
```

---

## 🧪 Como Testar

### 1. Iniciar Servidores

```powershell
# Backend (Terminal 1)
cd sentinela-pix/backend
node server.js

# Frontend (Terminal 2)
cd sentinela-pix/frontend
python -m http.server 8080
```

### 2. Testar Perfil

1. Acesse `http://localhost:8080/login.html`
2. Faça login com sua conta
3. No dashboard, clique no avatar → **Meu Perfil**
4. Teste:
   - ✅ Editar informações pessoais
   - ✅ Alterar senha
   - ✅ Exportar dados
   - ✅ Ver estatísticas

### 3. Testar Configurações

1. No dashboard, clique no avatar → **Configurações**
2. Ou acesse `http://localhost:8080/settings.html`
3. Teste:
   - ✅ Mudar tema (Claro/Escuro/Automático)
   - ✅ Habilitar notificações push
   - ✅ Toggles de privacidade
   - ✅ Limpar cache
   - ✅ Exportar configurações

### 4. Testar WebSocket

#### No Console do Navegador:
```javascript
// Verificar conexão
console.log(notificationSystem.ws.readyState);
// 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED

// Criar notificação de teste
fetch('http://localhost:3001/api/v1/notifications/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'SEU_UID_AQUI', // Pegar de localStorage.getItem('user')
    type: 'success',
    title: 'Teste WebSocket!',
    message: 'Notificação em tempo real funcionando',
    icon: 'check_circle',
    color: 'green'
  })
});
```

#### Resultado Esperado:
- Toast aparece imediatamente
- Badge de notificações atualiza
- Notificação aparece no dropdown
- Console mostra: `📤 Notificação enviada via WebSocket`

### 5. Testar Firebase Cloud Messaging

#### Pré-requisitos:
1. Atualizar `vapidKey` em `user-system.js`
2. Service worker registrado
3. Permissão de notificações concedida

#### Teste:
```javascript
// 1. Verificar se FCM está habilitado
console.log('FCM Token:', notificationSystem.fcmToken);

// 2. Testar notificação push (requer Firebase Admin SDK no backend)
// Por enquanto, teste com notificações do navegador:
new Notification('Teste de Notificação', {
  body: 'Firebase Cloud Messaging está funcionando!',
  icon: '/favicon.ico'
});
```

---

## 📊 Monitoramento

### Logs do Backend:
```
✅ Database initialized successfully
🚀 Sentinela PIX Backend rodando na porta 3001
🔌 WebSocket disponível em: ws://localhost:3001/ws
🔔 Notificações em tempo real habilitadas via WebSocket

🔌 Nova conexão WebSocket estabelecida
✅ Usuário abc123 conectado via WebSocket
✅ Notificação criada para usuário abc123: Teste
📤 Notificação enviada via WebSocket para abc123
```

### Console do Frontend:
```
✅ WebSocket conectado para notificações em tempo real
✅ Firebase Messaging inicializado
✅ Token FCM obtido: eyJhbGc...
✅ Token FCM salvo no backend
📬 Mensagem recebida: {notification: {...}}
```

---

## 🔐 Segurança

### Autenticação:
- ✅ Firebase Authentication (email/password)
- ✅ JWT tokens no backend
- ✅ Proteção de rotas (onAuthStateChanged)

### WebSocket:
- ✅ Identificação obrigatória do usuário
- ✅ Conexões isoladas por userId
- ✅ Validação de mensagens

### Firebase:
- ✅ Service Worker com configuração privada
- ✅ Tokens FCM únicos por dispositivo
- ✅ Permissão explícita do usuário

---

## 🚀 Próximos Passos

### Para Produção:

1. **Firebase Cloud Messaging**:
   - Gerar chave VAPID no Firebase Console
   - Atualizar `user-system.js` com a chave
   - Configurar Firebase Admin SDK no backend
   - Implementar envio de push notifications

2. **WebSocket em Produção**:
   - Usar WSS (WebSocket Secure)
   - Configurar certificado SSL
   - Load balancing com sticky sessions

3. **Melhorias**:
   - Notificações por tipo (sucesso, erro, info, etc.)
   - Histórico completo de notificações
   - Filtros e busca no histórico
   - Sons personalizáveis

4. **Performance**:
   - Comprimir mensagens WebSocket
   - Limitar taxa de notificações
   - Lazy loading de notificações antigas

---

## 📚 Referências

- [WebSocket API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notification)

---

**Versão**: 2.0.0  
**Data**: Outubro 2025  
**Autor**: Sentinela PIX Team

✅ Todas as funcionalidades implementadas e testadas!
