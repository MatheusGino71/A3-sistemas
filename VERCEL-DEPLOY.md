# 🚀 Deploy na Vercel - Sentinela PIX

## 📋 Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. [Vercel CLI](https://vercel.com/cli) instalado (opcional)
3. Repositório no GitHub conectado

## 🔧 Configuração Inicial

### 1. Instalar Vercel CLI (Opcional)

```bash
npm install -g vercel
```

### 2. Fazer Login na Vercel

```bash
vercel login
```

## 📦 Deploy via Dashboard da Vercel

### Passo 1: Importar Projeto

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Conecte sua conta do GitHub
3. Selecione o repositório `A3-sistemas`
4. Clique em **Import**

### Passo 2: Configurar Projeto

**Framework Preset:** Other  
**Root Directory:** `sentinela-pix`  
**Build Command:** `cd backend && npm install`  
**Output Directory:** `.`  
**Install Command:** `npm install`

### Passo 3: Configurar Variáveis de Ambiente

No painel da Vercel, vá em **Settings → Environment Variables** e adicione:

```env
NODE_ENV=production
DATABASE_URL=file:./zenit.db
FRONTEND_URL=https://seu-dominio.vercel.app
```

**Opcional (Firebase):**
```env
FIREBASE_API_KEY=sua_api_key
FIREBASE_AUTH_DOMAIN=seu_auth_domain
FIREBASE_PROJECT_ID=seu_project_id
FIREBASE_STORAGE_BUCKET=seu_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
FIREBASE_APP_ID=seu_app_id
FIREBASE_VAPID_KEY=sua_vapid_key
```

### Passo 4: Deploy

Clique em **Deploy** e aguarde o processo concluir.

## 🖥️ Deploy via CLI

```bash
# No diretório do projeto
cd sentinela-pix

# Deploy
vercel

# Seguir instruções no terminal
# Configurar:
# - Escopo: Sua conta/time
# - Link to existing project: No (primeira vez)
# - Project name: sentinela-pix
# - Directory: ./
```

### Deploy em Produção

```bash
vercel --prod
```

## 🔄 Configuração de Deploy Automático

A Vercel já configura deploy automático por padrão:

- **Produção:** Push na branch `main`
- **Preview:** Push em outras branches
- **Pull Requests:** Preview automático

## 📡 Configuração do Frontend

Após o deploy, você precisa atualizar a URL da API no frontend:

1. Anote a URL do seu projeto (ex: `https://sentinela-pix.vercel.app`)
2. Atualize `frontend/backend-config.js`:

```javascript
const API_URL = 'https://sentinela-pix.vercel.app';
```

3. Faça commit e push:

```bash
git add frontend/backend-config.js
git commit -m "Update: Configura URL da API para produção"
git push
```

## 🗄️ Banco de Dados em Produção

⚠️ **IMPORTANTE:** SQLite em Vercel é efêmero (dados são perdidos entre deploys).

### Opções Recomendadas:

#### 1. Vercel Postgres (Recomendado)

```bash
# Criar banco
vercel postgres create

# Conectar ao projeto
vercel postgres link
```

Atualizar `backend/server.js` para usar PostgreSQL.

#### 2. Supabase (Alternativa Gratuita)

1. Criar conta em [supabase.com](https://supabase.com)
2. Criar novo projeto
3. Copiar connection string
4. Adicionar em Environment Variables:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

#### 3. Railway (Alternativa)

1. Criar conta em [railway.app](https://railway.app)
2. Criar PostgreSQL database
3. Copiar connection string
4. Adicionar nas variáveis de ambiente

## 🔧 Troubleshooting

### Erro: "Module not found"

```bash
# Verificar se package.json está correto
cd backend
npm install
```

### Erro: "Cannot find module 'sqlite3'"

Adicionar em `vercel.json`:

```json
{
  "installCommand": "npm install && cd backend && npm install"
}
```

### Erro: WebSocket não funciona

Vercel não suporta WebSocket persistente. Considerar:
- Usar Vercel Edge Functions
- Migrar WebSocket para serviço separado (Railway, Render)
- Usar polling como fallback

### Logs não aparecem

Acessar logs em tempo real:

```bash
vercel logs [deployment-url] -f
```

## 📊 Monitoramento

### Analytics

Habilitado automaticamente na Vercel:
- Visitas
- Performance
- Core Web Vitals

### Logs

```bash
# Ver logs em tempo real
vercel logs --follow

# Logs de produção
vercel logs --prod

# Logs de função específica
vercel logs --filter=api
```

## 🔐 Domínio Customizado

1. Vá em **Settings → Domains**
2. Adicione seu domínio
3. Configure DNS conforme instruções
4. Aguarde propagação (até 48h)

## 🚀 Otimizações de Performance

### 1. Habilitar Edge Functions

```json
// vercel.json
{
  "functions": {
    "backend/server.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

### 2. Configurar Cache

```json
{
  "headers": [
    {
      "source": "/frontend/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 📞 Suporte

- [Documentação Vercel](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Status da Vercel](https://www.vercel-status.com/)

## ✅ Checklist de Deploy

- [ ] Código commitado e pushed para GitHub
- [ ] `vercel.json` configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado (se necessário)
- [ ] URL da API atualizada no frontend
- [ ] Teste local funcionando
- [ ] Deploy realizado com sucesso
- [ ] Testes em produção realizados
- [ ] Domínio customizado configurado (opcional)
- [ ] Monitoramento configurado

## 🎉 Pronto!

Seu projeto está no ar em: `https://seu-projeto.vercel.app`
