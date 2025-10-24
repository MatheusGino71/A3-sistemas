# Documentação da API - Sentinela PIX

## Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Endpoints de Autenticação](#endpoints-de-autenticação)
4. [Endpoints de Usuários](#endpoints-de-usuários)
5. [Endpoints de Relatórios de Fraude](#endpoints-de-relatórios-de-fraude)
6. [Endpoints de Notificações](#endpoints-de-notificações)
7. [Endpoints de Análise de Risco](#endpoints-de-análise-de-risco)
8. [Protocolo WebSocket](#protocolo-websocket)
9. [Códigos de Erro](#códigos-de-erro)
10. [Limitação de Taxa](#limitação-de-taxa)

## Visão Geral

A API REST do Sentinela PIX fornece acesso programático à plataforma de detecção e prevenção de fraudes. Todas as respostas da API são retornadas em formato JSON.

**Versão da API**: v1.0
**Protocolo Base**: REST
**Autenticação**: Token JWT Bearer
**Content-Type**: application/json

### URL Base

**Desenvolvimento**: `http://localhost:3001/api/v1`

**Produção**: `https://seu-dominio.com/api/v1`

### Formato de Resposta Padrão

Respostas de sucesso:
```json
{
  "success": true,
  "data": {},
  "message": "Operação concluída com sucesso",
  "timestamp": "2024-10-24T10:30:00Z"
}
```

Respostas de erro:
```json
{
  "success": false,
  "error": {
    "code": "ERRO_CODIGO",
    "message": "Descrição do erro",
    "details": {}
  },
  "timestamp": "2024-10-24T10:30:00Z"
}
```

## Autenticação

A API utiliza JSON Web Tokens (JWT) para autenticação. Inclua o token no header Authorization de todas as requisições protegidas.

### Obter Token

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senhaSegura123"
}
```

### Usar Token em Requisições

```http
GET /api/v1/reports
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Endpoints de Autenticação

### Registrar Usuário

Cria uma nova conta de usuário.

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senhaSegura123",
  "full_name": "João da Silva",
  "cpf": "12345678901",
  "phone": "+5511999999999",
  "bank": "Banco do Brasil"
}
```

**Resposta**: 201 Created

### Login

Autentica o usuário e retorna token de acesso.

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senhaSegura123"
}
```

**Resposta**: 200 OK com token JWT

### Logout

Invalida o token atual.

```http
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

## Endpoints de Usuários

### Obter Perfil

Retorna informações do perfil do usuário autenticado.

```http
GET /api/v1/users/profile
Authorization: Bearer {token}
```

### Atualizar Perfil

Atualiza informações do perfil.

```http
PUT /api/v1/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "full_name": "João da Silva Santos",
  "phone": "+5511988888888",
  "bank": "Bradesco"
}
```

### Registrar Token FCM

Registra token para notificações push.

```http
POST /api/v1/users/fcm-token
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id",
  "fcmToken": "firebase_token"
}
```

## Endpoints de Relatórios de Fraude

### Criar Relatório

Submete novo relatório de fraude.

```http
POST /api/v1/reports
Authorization: Bearer {token}
Content-Type: application/json

{
  "pixKey": "fraudador@email.com",
  "pixKeyType": "email",
  "amount": 5000.00,
  "transactionId": "E12345678",
  "victimBank": "Banco do Brasil",
  "description": "Descrição da fraude"
}
```

**Resposta**: 201 Created

### Listar Relatórios

Retorna lista paginada de relatórios.

```http
GET /api/v1/reports?status=pending&limit=20&offset=0
Authorization: Bearer {token}
```

**Parâmetros de Query**:
- `status`: Filtrar por status
- `limit`: Resultados por página (máximo: 100)
- `offset`: Paginação
- `sortBy`: Campo de ordenação
- `order`: Ordem (asc, desc)

### Obter Relatório

Retorna detalhes de um relatório específico.

```http
GET /api/v1/reports/{reportId}
Authorization: Bearer {token}
```

### Atualizar Status

Atualiza status do relatório.

```http
PUT /api/v1/reports/{reportId}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "confirmed",
  "notes": "Fraude confirmada"
}
```

## Endpoints de Notificações

### Criar Notificação

Cria nova notificação para usuário.

```http
POST /api/v1/notifications/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id",
  "type": "fraud_alert",
  "title": "Novo Alerta",
  "message": "Mensagem da notificação",
  "icon": "warning",
  "color": "red"
}
```

### Listar Notificações

Retorna notificações do usuário.

```http
GET /api/v1/notifications?unread=true&limit=20
Authorization: Bearer {token}
```

### Marcar como Lida

Marca notificação como lida.

```http
PUT /api/v1/notifications/{notificationId}/read
Authorization: Bearer {token}
```

## Endpoints de Análise de Risco

### Consultar Risco

Consulta nível de risco de uma chave PIX.

```http
GET /api/v1/keys/{chavePix}/risk
Authorization: Bearer {token}
```

**Resposta**: 200 OK
```json
{
  "pixKey": "fraudador@email.com",
  "riskLevel": "HIGH_RISK",
  "riskScore": 85,
  "reportCount": 5,
  "totalAmount": 25000.00,
  "recommendation": "BLOCK_TRANSACTION"
}
```

## Protocolo WebSocket

### Conexão

Conectar em `ws://localhost:3001/ws` (dev) ou `wss://seu-dominio.com/ws` (prod).

### Identificação

```json
{
  "type": "identify",
  "userId": "user_id",
  "token": "jwt_token"
}
```

### Tipos de Mensagem

**Notificação**:
```json
{
  "type": "notification",
  "data": {
    "notificationId": "id",
    "title": "Título",
    "message": "Mensagem",
    "type": "fraud_alert"
  }
}
```

**Heartbeat**:
```json
{
  "type": "ping"
}
```

Resposta:
```json
{
  "type": "pong",
  "timestamp": "2024-10-24T10:30:00Z"
}
```

## Códigos de Erro

### Códigos HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

### Códigos Customizados

| Código | Descrição |
|--------|-----------|
| AUTH_001 | Token inválido ou expirado |
| AUTH_002 | Credenciais inválidas |
| USER_001 | Usuário não encontrado |
| USER_002 | Email já cadastrado |
| REPORT_001 | Relatório não encontrado |
| REPORT_002 | Chave PIX inválida |

## Limitação de Taxa

| Endpoint | Limite |
|----------|--------|
| Geral | 100 req/min |
| Login | 3 req/5min |
| Relatórios | 10 req/min |

**Headers de Resposta**:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1698148200
```

---

**Última Atualização**: Outubro de 2024
**Versão**: 1.0.0
