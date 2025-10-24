# Sentinela PIX Backend - Deploy Guide

## 🚀 Deploy no Railway

### Passos:

1. **Acesse Railway**: https://railway.app/
2. **Faça login** com sua conta GitHub
3. **Clique em "New Project"**
4. **Selecione "Deploy from GitHub repo"**
5. **Escolha o repositório**: MatheusGino71/A3-sistemas
6. **Configure o Root Directory**: `/sentinela-pix/backend`
7. **Railway vai detectar automaticamente** o Node.js e package.json
8. **Adicione variáveis de ambiente** (se necessário):
   - `PORT` (Railway define automaticamente)
   - `JWT_SECRET` (opcional, use um valor seguro)

### Variáveis de Ambiente Recomendadas:

```env
JWT_SECRET=seu-secret-super-seguro-aqui-12345
NODE_ENV=production
```

### Após o Deploy:

Railway vai gerar uma URL como: `https://seu-projeto.railway.app`

Você precisa atualizar o `dashboard.js` com essa URL.

## 🔄 Alternativa: Deploy via CLI do Railway

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar projeto
cd backend
railway init

# Deploy
railway up
```

## 🌐 URLs de Deploy:

- **Railway**: https://railway.app/
- **Render**: https://render.com/ (alternativa gratuita)
- **Fly.io**: https://fly.io/ (alternativa gratuita)

## ⚙️ Configuração Pós-Deploy:

Depois de obter a URL do backend hospedado:

1. Atualizar `frontend/dashboard.js` com a nova URL
2. Fazer deploy do frontend novamente no Firebase
3. Testar todas as funcionalidades

## 📝 Notas:

- O SQLite funciona no Railway, mas para produção considere usar PostgreSQL
- Railway oferece 500h/mês grátis
- O banco de dados SQLite será criado automaticamente no primeiro acesso
