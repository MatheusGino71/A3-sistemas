# 🛡️ ZENIT - Plataforma de Detecção de Fraudes PIX

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)](https://github.com/MatheusGino71/A3-sistemas)

**ZENIT** é uma plataforma moderna e escalável para detecção e prevenção de fraudes em transações PIX, utilizando Firebase como banco de dados principal e oferecendo notificações em tempo real via WebSocket.

---

## 📋 Sobre o Projeto

Sistema completo de detecção de fraudes PIX que permite:
- 🚨 Registro e gerenciamento de denúncias de fraude
- 📊 Dashboard em tempo real com estatísticas
- 🔔 Notificações instantâneas via WebSocket
- 🔥 **100% Firebase** - Firestore como único banco de dados
- 🎯 Análise e classificação automática de riscos
- 👥 Autenticação segura com Firebase Auth

---

## 🏗️ Arquitetura

```
┌──────────────────────────────────────────────────┐
│                   ZENIT System                    │
├──────────────────────────────────────────────────┤
│                                                   │
│  Frontend (PWA)          Backend (Node.js)       │
│       ↓                        ↓                  │
│       └────────────────────────┘                  │
│                  ↓                                │
│         Firebase Platform                         │
│    ┌─────────────────────────────┐               │
│    │  • Firestore (Database)     │               │
│    │  • Authentication           │               │
│    │  • Cloud Messaging (FCM)    │               │
│    └─────────────────────────────┘               │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## 🚀 Tecnologias

### Backend
- **Node.js 18+** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **Firebase Admin SDK** - Conexão com Firebase
- **WebSocket (ws)** - Comunicação em tempo real
- **Winston** - Sistema de logs avançado

### Frontend
- **HTML5 + CSS3 + JavaScript** - Interface moderna
- **Tailwind CSS** - Framework CSS utility-first
- **Firebase SDK** - Cliente Firebase
- **PWA** - Progressive Web App

### Infraestrutura
- **Firebase Firestore** - Banco de dados NoSQL em tempo real
- **Firebase Authentication** - Sistema de autenticação completo
- **Firebase Cloud Messaging** - Notificações push (opcional)
- **Firebase Hosting** - Hospedagem de aplicação web

---

## 📦 Instalação Rápida

### 1. Pré-requisitos
- Node.js 18+ ([Download](https://nodejs.org/))
- Conta Firebase gratuita ([Firebase Console](https://console.firebase.google.com/))
- Python 3.8+ (para dev server do frontend)

### 2. Clone e Configure

```bash
# Clone o repositório
git clone https://github.com/MatheusGino71/A3-sistemas.git
cd A3-sistemas/sentinela-pix

# Instale dependências
cd backend
npm install
```

### 3. Configurar Firebase

**A. No Firebase Console:**
1. Crie um projeto Firebase
2. Ative **Firestore Database** (modo teste)
3. Ative **Authentication** → Email/Password
4. Baixe o Service Account (Project Settings → Service Accounts)
5. Salve como `backend/firebase-service-account.json`

**B. Configure o Frontend:**

Edite `frontend/firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "seu-app-id"
};
```

### 4. Inicie o Sistema

```bash
# Terminal 1 - Backend
cd backend
node server-firebase.js

# Terminal 2 - Frontend  
cd frontend
python -m http.server 8080
```

Acesse: **http://localhost:8080**

---

## 🔥 Estrutura do Firebase

### Coleções do Firestore

#### `fraudReports` - Denúncias de Fraude
```javascript
{
  id: "uuid",
  pixKey: "email@example.com",
  reporterBank: "Banco do Brasil",
  description: "Descrição da fraude",
  amount: 1500.00,
  transactionId: "TXN123",
  status: "PENDING", // PENDING | INVESTIGATING | RESOLVED
  priority: "HIGH",  // LOW | MEDIUM | HIGH | CRITICAL
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `notifications` - Notificações do Sistema
```javascript
{
  id: "uuid",
  type: "fraud_report",
  title: "Nova Denúncia",
  message: "Denúncia registrada para chave PIX",
  fraudReportId: "uuid",
  read_at: null | Timestamp,
  created_at: Timestamp
}
```

### Security Rules

Configure no Firebase Console (Firestore → Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /fraudReports/{reportId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    match /notifications/{notifId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🌐 API Endpoints

### Fraud Reports
```http
POST   /api/v1/fraud-reports      # Criar denúncia
GET    /api/v1/fraud-reports      # Listar todas
GET    /api/v1/fraud-reports/:id  # Buscar por ID
```

### Notifications  
```http
GET    /api/v1/notifications           # Listar notificações
PUT    /api/v1/notifications/:id/read  # Marcar como lida
PUT    /api/v1/notifications/read-all  # Marcar todas
```

### Dashboard
```http
GET    /api/v1/dashboard/stats   # Estatísticas gerais
```

### Sistema
```http
GET    /health    # Health check
GET    /metrics   # Métricas Prometheus
```

---

## 🔌 WebSocket - Tempo Real

O sistema usa WebSocket para notificações instantâneas:

```javascript
// Conectar ao WebSocket
const ws = new WebSocket('ws://localhost:3001/ws');

// Identificar usuário
ws.send(JSON.stringify({
    type: 'identify',
    userId: 'user-firebase-uid'
}));

// Receber notificações
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'notification') {
        console.log('Nova notificação!', data.notification);
    }
};
```

---

## 📁 Estrutura do Projeto

```
sentinela-pix/
├── backend/
│   ├── server-firebase.js           # Servidor Firebase (NOVO)
│   ├── package.json                 # Dependências atualizadas
│   ├── firebase-service-account.json # Credenciais Firebase
│   ├── middleware/
│   │   ├── validation.js
│   │   └── rateLimiter.js
│   └── utils/
│       ├── metrics.js
│       └── logger.js
├── frontend/
│   ├── index.html                   # Landing page
│   ├── dashboard.html               # Dashboard principal
│   ├── dashboard.js                 # Lógica do dashboard
│   ├── firebase-config.js           # Config Firebase
│   └── user-system.js               # Autenticação
├── docs/
│   └── API-DOCUMENTATION.md
└── README.md                         # Este arquivo
```

---

## 🚀 Deploy para Produção

### Opção 1: Firebase Hosting (Recomendado)

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar
firebase init

# Deploy
firebase deploy
```

### Opção 2: Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel
```

---

## 🔐 Segurança

- ✅ Firebase Authentication com tokens JWT
- ✅ Firestore Security Rules configuradas
- ✅ Rate limiting em todos os endpoints
- ✅ Validação e sanitização de inputs
- ✅ CORS restrito a domínios específicos
- ✅ HTTPS obrigatório em produção

---

## 📊 Monitoramento

O sistema expõe métricas Prometheus em `/metrics`:

```bash
curl http://localhost:3001/metrics
```

**Métricas disponíveis:**
- `http_requests_total` - Total de requisições
- `http_request_duration_ms` - Duração das requests
- `ws_connections_total` - Conexões WebSocket ativas
- `fraud_reports_total` - Denúncias por prioridade
- `errors_total` - Erros por tipo

---

## 🧪 Testes

```bash
# Testes unitários
npm test

# Coverage
npm run test:coverage
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT.

---

## 👥 Equipe

**ZENIT Team** - [MatheusGino71](https://github.com/MatheusGino71)

---

## 🎯 Roadmap

- [ ] Machine Learning para detecção automática
- [ ] App mobile React Native
- [ ] Relatórios PDF exportáveis
- [ ] Integração com APIs bancárias
- [ ] Dashboard de analytics avançado
- [ ] Multi-idioma (i18n)

---

## 📞 Suporte

- 🐛 [Issues](https://github.com/MatheusGino71/A3-sistemas/issues)
- 📖 [Wiki](https://github.com/MatheusGino71/A3-sistemas/wiki)
- 📧 Email: suporte@zenit.com

---

<div align="center">

**[⬆ Voltar ao topo](#-zenit---plataforma-de-detecção-de-fraudes-pix)**

Desenvolvido com ❤️ pela equipe **ZENIT**

![ZENIT](https://img.shields.io/badge/Powered%20by-Firebase-FFCA28?style=flat-square&logo=firebase)

</div>
