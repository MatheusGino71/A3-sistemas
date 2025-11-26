# 🚀 Deploy no Vercel - ZENIT

## 📋 Pré-requisitos

1. ✅ Conta na [Vercel](https://vercel.com)
2. ✅ Repositório no GitHub (já configurado!)
3. ✅ Credenciais Firebase (service account JSON)

## 🔧 Deploy Rápido

### 1. Criar Conta/Login no Vercel

1. Acesse: https://vercel.com
2. Clique em **"Sign Up"** ou **"Login"**
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel

### 2. Importar Projeto do GitHub

1. No dashboard, clique em **"Add New Project"**
2. Selecione o repositório **"A3-sistemas"**
3. Clique em **"Import"**

## 📦 Deploy via Dashboard da Vercel

### Passo 1: Importar Projeto

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Conecte sua conta do GitHub
3. Selecione o repositório `A3-sistemas`
4. Clique em **Import**

### 3. Configurar Projeto

Configure os seguintes parâmetros:

- **Framework Preset:** `Other`
- **Root Directory:** `sentinela-pix`
- **Build Command:** `cd backend && npm install`
- **Output Directory:** `frontend`

### 4. Configurar Variáveis de Ambiente ⚠️ CRÍTICO

No painel da Vercel, vá em **Settings → Environment Variables** e adicione:

**Variável Obrigatória:**

```
FIREBASE_SERVICE_ACCOUNT
```

**Valor:** Cole o conteúdo COMPLETO do arquivo `firebase-service-account.json` (todo o JSON)

**Como obter:**
1. Acesse: https://console.firebase.google.com/project/a3-quinta-1a763/settings/serviceaccounts/adminsdk
2. Clique em "Gerar nova chave privada"
3. Copie TODO o conteúdo do arquivo JSON baixado
4. Cole no campo Value no Vercel

**Outras variáveis:**

```env
NODE_ENV=production
PORT=3001
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
