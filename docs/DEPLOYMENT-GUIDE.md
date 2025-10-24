# Guia de Deployment - Sentinela PIX

## Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Preparação para Deploy](#preparação-para-deploy)
4. [Deploy do Backend](#deploy-do-backend)
5. [Deploy do Frontend](#deploy-do-frontend)
6. [Configuração do Firebase](#configuração-do-firebase)
7. [Checklist de Produção](#checklist-de-produção)
8. [Monitoramento](#monitoramento)
9. [Troubleshooting](#troubleshooting)

## Visão Geral

Este guia fornece instruções detalhadas para fazer deploy da plataforma Sentinela PIX em ambiente de produção.

### Arquitetura de Deployment

```
┌─────────────────────────────────────────────────┐
│          Usuários / Navegadores Web            │
└──────────────────┬──────────────────────────────┘
                   │
         ┌─────────▼──────────┐
         │  Firebase Hosting  │
         │  (Frontend Estático)│
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │  Railway / Heroku  │
         │  (Backend Node.js) │
         └─────────┬──────────┘
                   │
    ┌──────────────┼──────────────┐
    ▼              ▼              ▼
┌────────┐  ┌──────────┐  ┌──────────┐
│ SQLite │  │ Firebase │  │  Cloud   │
│   DB   │  │ Services │  │ Storage  │
└────────┘  └──────────┘  └──────────┘
```

## Pré-requisitos

### Contas Necessárias

- Conta Firebase (gratuita)
- Conta Railway.app ou Heroku (gratuita para começar)
- Conta GitHub (para CI/CD)
- Domínio customizado (opcional)

### Software Local

- Node.js 18+ instalado
- npm 8+ instalado
- Git instalado
- Firebase CLI instalado
- Railway CLI ou Heroku CLI instalado

### Instalação das Ferramentas

```powershell
# Firebase CLI
npm install -g firebase-tools

# Railway CLI
npm install -g @railway/cli

# Heroku CLI (alternativa)
npm install -g heroku
```

## Preparação para Deploy

### 1. Clonar Repositório

```powershell
git clone https://github.com/MatheusGino71/A3-sistemas.git
cd A3-sistemas/sentinela-pix
```

### 2. Instalar Dependências Backend

```powershell
cd backend
npm install --production
```

### 3. Configurar Variáveis de Ambiente

Criar arquivo `.env` no diretório `backend/`:

```env
# Configurações do Servidor
PORT=3001
NODE_ENV=production

# Segurança
JWT_SECRET=sua_chave_secreta_jwt_minimo_32_caracteres_aqui

# Banco de Dados
DATABASE_PATH=./database.sqlite

# CORS
CORS_ORIGIN=https://seu-dominio.com

# Firebase Admin (opcional)
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY=sua-chave-privada
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-projeto.iam.gserviceaccount.com
```

### 4. Gerar JWT Secret Seguro

```powershell
# PowerShell
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

## Deploy do Backend

### Opção 1: Railway.app (Recomendado)

#### Passo 1: Login no Railway

```powershell
railway login
```

#### Passo 2: Criar Novo Projeto

```powershell
cd backend
railway init
```

#### Passo 3: Vincular ao Projeto

```powershell
railway link
```

#### Passo 4: Configurar Variáveis de Ambiente

No dashboard da Railway (https://railway.app):
1. Selecione seu projeto
2. Clique em "Variables"
3. Adicione todas as variáveis do arquivo `.env`
4. Não defina PORT (Railway define automaticamente)

#### Passo 5: Deploy

```powershell
railway up
```

#### Passo 6: Obter URL de Produção

```powershell
railway domain
```

A URL será algo como: `https://sentinela-pix-production.up.railway.app`

### Opção 2: Heroku

#### Passo 1: Login no Heroku

```powershell
heroku login
```

#### Passo 2: Criar Aplicação

```powershell
cd backend
heroku create sentinela-pix-backend
```

#### Passo 3: Configurar Variáveis

```powershell
heroku config:set JWT_SECRET=sua_chave_secreta
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://seu-dominio.com
```

#### Passo 4: Deploy

```powershell
git push heroku main
```

#### Passo 5: Verificar Logs

```powershell
heroku logs --tail
```

### Opção 3: Azure App Service

#### Passo 1: Login no Azure

```powershell
az login
```

#### Passo 2: Criar Resource Group

```powershell
az group create --name sentinela-pix-rg --location brazilsouth
```

#### Passo 3: Criar App Service Plan

```powershell
az appservice plan create --name sentinela-pix-plan --resource-group sentinela-pix-rg --sku B1 --is-linux
```

#### Passo 4: Criar Web App

```powershell
az webapp create --resource-group sentinela-pix-rg --plan sentinela-pix-plan --name sentinela-pix-backend --runtime "NODE|18-lts"
```

#### Passo 5: Configurar Variáveis

```powershell
az webapp config appsettings set --resource-group sentinela-pix-rg --name sentinela-pix-backend --settings JWT_SECRET=sua_chave NODE_ENV=production
```

#### Passo 6: Deploy via Git

```powershell
az webapp deployment source config-local-git --name sentinela-pix-backend --resource-group sentinela-pix-rg
git remote add azure <deployment_url>
git push azure main
```

## Deploy do Frontend

### Firebase Hosting

#### Passo 1: Login no Firebase

```powershell
firebase login
```

#### Passo 2: Inicializar Projeto

```powershell
cd sentinela-pix
firebase init hosting
```

Configurações:
- Diretório público: `frontend`
- SPA (Single Page App): `Não`
- Builds automáticos: `Não`

#### Passo 3: Configurar firebase.json

```json
{
  "hosting": {
    "public": "frontend",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=604800"
          }
        ]
      }
    ]
  }
}
```

#### Passo 4: Atualizar URLs da API

Editar `frontend/backend-config.js`:

```javascript
const BACKEND_CONFIG = {
  API_BASE_URL: 'https://sua-url-railway.up.railway.app/api/v1',
  WS_BASE_URL: 'wss://sua-url-railway.up.railway.app/ws'
};
```

#### Passo 5: Deploy

```powershell
firebase deploy --only hosting
```

#### Passo 6: Obter URL

O Firebase fornecerá uma URL como: `https://seu-projeto.web.app`

### Configurar Domínio Customizado

#### No Firebase Console

1. Acesse https://console.firebase.google.com
2. Selecione seu projeto
3. Vá para Hosting
4. Clique em "Add custom domain"
5. Siga as instruções para adicionar registros DNS

## Configuração do Firebase

### 1. Criar Projeto Firebase

1. Acesse https://console.firebase.google.com
2. Clique em "Add project"
3. Nomeie o projeto: "Sentinela PIX"
4. Siga o wizard de criação

### 2. Habilitar Authentication

1. No console, vá para Authentication
2. Clique em "Get Started"
3. Habilite "Email/Password"
4. Opcionalmente habilite outros provedores

### 3. Configurar Firestore

1. No console, vá para Firestore Database
2. Clique em "Create database"
3. Selecione "Start in production mode"
4. Escolha localização: `southamerica-east1` (São Paulo)

#### Deploy de Regras Firestore

```powershell
firebase deploy --only firestore:rules
```

Conteúdo de `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /reports/{reportId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.createdBy == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

### 4. Configurar Cloud Messaging

1. No console, vá para Project Settings
2. Clique na aba "Cloud Messaging"
3. Gere um novo par de chaves Web Push
4. Copie a chave VAPID pública

Atualizar `frontend/user-system.js` linha 133:

```javascript
this.fcmToken = await getToken(messaging, {
  vapidKey: 'SUA_CHAVE_VAPID_PUBLICA_AQUI'
});
```

### 5. Configurar Service Worker

Verificar `frontend/firebase-messaging-sw.js`:

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

messaging.onBackgroundMessage((payload) => {
  console.log('Mensagem recebida em background:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png',
    badge: '/badge.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

## Checklist de Produção

### Segurança

- [ ] Alterar todas as senhas e secrets padrão
- [ ] Gerar JWT secret forte (32+ caracteres)
- [ ] Habilitar HTTPS/SSL em todos os endpoints
- [ ] Configurar WebSocket seguro (WSS)
- [ ] Configurar CORS com origens específicas
- [ ] Habilitar rate limiting
- [ ] Remover console.log do código de produção
- [ ] Configurar headers de segurança (Helmet.js)
- [ ] Validar todas as entradas do usuário
- [ ] Implementar proteção contra CSRF

### Performance

- [ ] Habilitar compressão gzip/brotli
- [ ] Configurar CDN para assets estáticos
- [ ] Otimizar queries de banco de dados
- [ ] Habilitar caching
- [ ] Minificar JavaScript e CSS
- [ ] Otimizar imagens
- [ ] Configurar headers de cache adequados
- [ ] Habilitar HTTP/2

### Monitoramento

- [ ] Configurar rastreamento de erros (Sentry)
- [ ] Configurar monitoramento de aplicação
- [ ] Configurar agregação de logs
- [ ] Configurar alertas para erros críticos
- [ ] Configurar monitoramento de uptime
- [ ] Configurar backup automático de banco de dados
- [ ] Configurar métricas de performance

### Banco de Dados

- [ ] Criar backup inicial do banco de dados
- [ ] Configurar backups automáticos diários
- [ ] Testar restauração de backup
- [ ] Otimizar índices do banco de dados
- [ ] Configurar retenção de dados
- [ ] Implementar limpeza de dados antigos

## Monitoramento

### Health Check

Endpoint para verificação de saúde:

```http
GET /health

Resposta: 200 OK
{
  "status": "healthy",
  "timestamp": "2024-10-24T10:30:00Z",
  "uptime": 86400,
  "services": {
    "database": "connected",
    "websocket": "running",
    "firebase": "connected"
  }
}
```

### Logs

#### Ver Logs Railway

```powershell
railway logs
```

#### Ver Logs Heroku

```powershell
heroku logs --tail
```

### Métricas

Monitorar:
- Taxa de requisições por segundo
- Tempo de resposta médio
- Taxa de erro
- Conexões WebSocket ativas
- Uso de memória
- Uso de CPU

## Troubleshooting

### Backend não inicia

**Problema**: Servidor não inicia ou crasheia

**Soluções**:
1. Verificar logs: `railway logs` ou `heroku logs --tail`
2. Verificar variáveis de ambiente estão configuradas
3. Verificar PORT não está hardcoded (usar `process.env.PORT`)
4. Verificar dependências instaladas: `npm install`

### WebSocket não conecta

**Problema**: Conexão WebSocket falha

**Soluções**:
1. Verificar URL usa `wss://` em produção (não `ws://`)
2. Verificar CORS está configurado corretamente
3. Verificar firewall/proxy não bloqueia WebSocket
4. Testar com ferramentas: `wscat -c wss://sua-url.com/ws`

### Notificações push não funcionam

**Problema**: Notificações FCM não são recebidas

**Soluções**:
1. Verificar chave VAPID está configurada corretamente
2. Verificar Service Worker está registrado
3. Verificar permissões de notificação concedidas
4. Testar no console do Firebase (Cloud Messaging > Send test message)
5. Verificar token FCM está sendo salvo no backend

### Erro CORS

**Problema**: Requisições bloqueadas por CORS

**Soluções**:
1. Verificar `CORS_ORIGIN` inclui URL do frontend
2. Em desenvolvimento, usar `*` (NUNCA em produção)
3. Verificar headers CORS no backend:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

### Banco de dados não persiste

**Problema**: Dados são perdidos após restart

**Soluções**:
1. Railway: Adicionar volume persistente
2. Heroku: Usar add-on de banco de dados
3. Verificar `DATABASE_PATH` aponta para volume persistente
4. Considerar migrar para PostgreSQL em produção

### Alto uso de memória

**Problema**: Aplicação consome muita memória

**Soluções**:
1. Implementar pool de conexões
2. Limitar conexões WebSocket simultâneas
3. Implementar limpeza de conexões inativas
4. Habilitar garbage collection: `node --max-old-space-size=512 server.js`

## Manutenção

### Backups Regulares

```powershell
# Backup manual do SQLite
cp backend/database.sqlite backend/backups/database-$(date +%Y%m%d).sqlite

# Backup automatizado (adicionar ao cron/task scheduler)
# Diário às 3:00 AM
0 3 * * * /caminho/para/backup-script.sh
```

### Atualizações de Segurança

```powershell
# Verificar vulnerabilidades
npm audit

# Corrigir automaticamente
npm audit fix

# Atualizar dependências
npm update
```

### Rotação de Logs

Configure rotação de logs para evitar enchimento de disco:
- Manter logs por 30 dias
- Comprimir logs antigos
- Implementar limpeza automática

---

**Última Atualização**: Outubro de 2024
