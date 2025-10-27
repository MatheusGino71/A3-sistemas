# 📚 Documentação da API ZENIT

## 📖 Visão Geral

Esta pasta contém a documentação completa da API REST do ZENIT utilizando o padrão OpenAPI 3.0.

## 🚀 Como Acessar

### Desenvolvimento Local

Com o backend rodando (`node server.js` na pasta `backend`), acesse:

```
http://localhost:3001/api/docs
```

Você será automaticamente redirecionado para a interface Swagger UI.

### Produção

```
https://api.zenit.com.br/api/docs
```

## 📄 Arquivos

### `openapi.yaml`
Especificação completa da API no formato OpenAPI 3.0.3, incluindo:
- ✅ Todos os endpoints da API
- ✅ Schemas de requisição e resposta
- ✅ Modelos de dados
- ✅ Exemplos de uso
- ✅ Códigos de erro
- ✅ Informações de autenticação (JWT)
- ✅ Rate limiting documentado

### `swagger.html`
Interface visual interativa (Swagger UI) para:
- 🔍 Explorar todos os endpoints
- 🧪 Testar requisições diretamente no navegador
- 📋 Ver exemplos de requisições/respostas
- 🔐 Autenticar com JWT
- 📥 Baixar a especificação OpenAPI

## 🎯 Principais Funcionalidades

### 1. Autenticação e Registro
- `POST /api/v1/auth/register` - Criar nova conta
- `POST /api/v1/auth/login` - Login e obtenção de token JWT

### 2. Denúncias de Fraude
- `GET /api/v1/reports` - Listar denúncias
- `POST /api/v1/reports` - Criar nova denúncia
- `GET /api/v1/reports/{id}` - Obter detalhes da denúncia

### 3. Análise de Risco
- `GET /api/v1/keys/{pixKey}/risk` - Consultar risco de uma chave PIX

### 4. Gerenciamento de Perfil
- `GET /api/v1/users/me` - Obter perfil do usuário
- `PUT /api/v1/users/me` - Atualizar perfil

### 5. Notificações
- `POST /api/v1/users/fcm-token` - Registrar token para notificações push

### 6. Sistema
- `GET /api/v1/health` - Health check

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação.

### Fluxo de Autenticação:

1. **Registrar** ou fazer **login** para obter o token:
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senhaSegura123"
  }'
```

2. **Incluir o token** nas requisições protegidas:
```bash
curl -X GET http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

### No Swagger UI:

1. Clique no botão **"Authorize"** 🔓 no topo da página
2. Digite: `Bearer SEU_TOKEN_JWT`
3. Clique em **"Authorize"**
4. Agora você pode testar endpoints protegidos!

## ⚡ Rate Limiting

A API implementa rate limiting para proteger contra abuso:

| Endpoint | Limite |
|----------|--------|
| Autenticação (login/register) | 5 requisições / 15 minutos |
| API Geral | 100 requisições / 15 minutos |
| Denúncias | 10 por hora |
| Consulta de Risco | 30 por minuto |

Quando o limite é excedido, você receberá:
- Status: `429 Too Many Requests`
- Header: `Retry-After` (tempo em segundos até poder tentar novamente)

## 📝 Exemplos de Uso

### Exemplo 1: Registrar Usuário

**Requisição:**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "joao@exemplo.com",
  "password": "senhaSegura123",
  "full_name": "João da Silva",
  "cpf": "12345678901",
  "phone": "+5511999999999",
  "bank": "Bradesco"
}
```

**Resposta (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "joao@exemplo.com",
    "full_name": "João da Silva"
  },
  "expiresIn": 86400
}
```

### Exemplo 2: Criar Denúncia de Fraude

**Requisição:**
```http
POST /api/v1/reports
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "pixKey": "fraudador@email.com",
  "pixKeyType": "email",
  "amount": 5000.00,
  "transactionId": "E12345678",
  "victimBank": "Bradesco",
  "fraudsterBank": "Nubank",
  "description": "Golpe do falso suporte técnico"
}
```

**Resposta (201 Created):**
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440001",
  "pixKey": "fraudador@email.com",
  "amount": 5000.00,
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Exemplo 3: Consultar Risco de Chave PIX

**Requisição:**
```http
GET /api/v1/keys/fraudador@email.com/risk
Authorization: Bearer SEU_TOKEN
```

**Resposta (200 OK):**
```json
{
  "pixKey": "fraudador@email.com",
  "riskLevel": "HIGH_RISK",
  "riskScore": 85,
  "reportCount": 3,
  "lastReportDate": "2024-01-15T10:30:00Z",
  "affectedInstitutions": ["Bradesco", "Itaú", "Santander"]
}
```

## 🛠️ Códigos de Status HTTP

| Código | Significado | Quando Ocorre |
|--------|-------------|---------------|
| **200** | OK | Requisição bem-sucedida |
| **201** | Created | Recurso criado com sucesso |
| **400** | Bad Request | Dados inválidos na requisição |
| **401** | Unauthorized | Autenticação necessária ou token inválido |
| **404** | Not Found | Recurso não encontrado |
| **409** | Conflict | Conflito (ex: email já cadastrado) |
| **429** | Too Many Requests | Limite de requisições excedido |
| **500** | Internal Server Error | Erro interno do servidor |

## 📊 Schemas de Dados

### User (Usuário)
```json
{
  "id": "uuid",
  "email": "string",
  "full_name": "string",
  "cpf": "string (11 dígitos)",
  "phone": "string",
  "bank": "string",
  "created_at": "datetime"
}
```

### FraudReport (Denúncia)
```json
{
  "id": "uuid",
  "pixKey": "string",
  "pixKeyType": "cpf|cnpj|email|phone|random",
  "amount": "number",
  "transactionId": "string",
  "victimBank": "string",
  "fraudsterBank": "string",
  "description": "string",
  "status": "pending|confirmed|false_positive|investigating",
  "created_at": "datetime"
}
```

### RiskAnalysis (Análise de Risco)
```json
{
  "pixKey": "string",
  "riskLevel": "LOW|SUSPICIOUS|HIGH_RISK|CRITICAL",
  "riskScore": "number (0-100)",
  "reportCount": "number",
  "lastReportDate": "datetime"
}
```

## 🔄 Versionamento

A API atual está na versão **v1** (`/api/v1/*`).

Mudanças futuras:
- Versões novas serão criadas como `/api/v2/*`, `/api/v3/*`, etc.
- Versões antigas serão mantidas por compatibilidade
- Deprecações serão comunicadas com antecedência

## 📞 Suporte

- **Email**: suporte@zenit.com.br
- **GitHub**: [MatheusGino71/A3-sistemas](https://github.com/MatheusGino71/A3-sistemas)
- **Issues**: [Reportar Problemas](https://github.com/MatheusGino71/A3-sistemas/issues)

## 🤝 Contribuindo

Encontrou um erro na documentação? Ajude-nos a melhorar:

1. Fork o repositório
2. Edite `openapi.yaml` ou outros arquivos de documentação
3. Envie um Pull Request

## 📜 Licença

Esta documentação faz parte do projeto ZENIT e está sob licença acadêmica.

---

**🌟 ZENIT** - Sistema Anti-Fraude PIX  
*Protegendo transações, construindo confiança*
