# 🚀 Guia Completo de Deploy - Sentinela PIX

## 📋 Visão Geral

Este guia mostra como hospedar o **backend** (Node.js + Express) e conectá-lo ao **frontend** já hospedado no Firebase Hosting.

---

## 🎯 Opções de Hospedagem para o Backend

### 1. **Railway** (Recomendado) ⭐
- ✅ Gratuito: 500h/mês (suficiente para projetos pequenos)
- ✅ Deploy automático via GitHub
- ✅ Suporte para SQLite
- ✅ SSL automático
- 🔗 https://railway.app/

### 2. **Render**
- ✅ Gratuito com limitações
- ✅ Deploy via GitHub
- ⚠️ SQLite funciona mas recomenda PostgreSQL
- 🔗 https://render.com/

### 3. **Fly.io**
- ✅ Gratuito com créditos iniciais
- ✅ Excelente performance
- ⚠️ Configuração mais técnica
- 🔗 https://fly.io/

---

## 🚂 Deploy no Railway (Passo a Passo)

### Passo 1: Preparar o Código

✅ **Já feito!** Os arquivos necessários já foram criados:
- `backend/Procfile` - Comando de inicialização
- `backend/server.js` - CORS configurado para Firebase
- `frontend/backend-config.js` - Configuração de URL dinâmica

### Passo 2: Fazer Deploy no Railway

1. **Acesse Railway**: https://railway.app/

2. **Login com GitHub**:
   - Clique em "Login"
   - Escolha "Login with GitHub"
   - Autorize o Railway

3. **Criar Novo Projeto**:
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha: `MatheusGino71/A3-sistemas`

4. **Configurar Root Directory**:
   - Após selecionar o repositório, clique em "Settings"
   - Em "Root Directory", digite: `sentinela-pix/backend`
   - Salve as alterações

5. **Adicionar Variáveis de Ambiente** (Opcional):
   - Vá em "Variables"
   - Adicione:
     ```
     JWT_SECRET=seu-secret-super-seguro-12345
     NODE_ENV=production
     ```

6. **Deploy Automático**:
   - Railway detecta automaticamente o `package.json`
   - O deploy começa automaticamente
   - Aguarde 2-5 minutos

7. **Obter a URL**:
   - Clique em "Settings" > "Domains"
   - Clique em "Generate Domain"
   - Copie a URL gerada (ex: `https://sentinela-pix-backend.railway.app`)

### Passo 3: Configurar o Frontend

1. **Execute o script de configuração**:
   ```bash
   cd "C:\Users\adm\OneDrive\Área de Trabalho\PROJETOS\a3 - quinta\sentinela-pix"
   python configure-backend.py
   ```

2. **Digite a URL do Railway** quando solicitado

3. **Ou edite manualmente**:
   - Abra `frontend/backend-config.js`
   - Altere a linha:
     ```javascript
     PRODUCTION: 'https://sentinela-pix-backend.railway.app', // SUA URL AQUI
     ```

### Passo 4: Atualizar o Dashboard

Adicione o `backend-config.js` no `dashboard.html`:

```html
<!-- ANTES de dashboard.js -->
<script src="backend-config.js"></script>
<script src="dashboard.js"></script>
```

### Passo 5: Fazer Deploy do Frontend

```bash
cd "C:\Users\adm\OneDrive\Área de Trabalho\PROJETOS\a3 - quinta\sentinela-pix"
firebase deploy --only hosting
```

### Passo 6: Testar

1. Acesse: https://a3-quinta-1a763.web.app
2. Crie uma conta ou faça login
3. Verifique se o dashboard carrega os dados
4. Teste criar um relatório de fraude

---

## 🔧 Troubleshooting

### Erro: CORS blocked
**Solução**: Verifique se o `server.js` tem:
```javascript
origin: [
    'https://a3-quinta-1a763.web.app',
    'https://a3-quinta-1a763.firebaseapp.com'
]
```

### Erro: Cannot connect to backend
**Solução**: 
1. Abra o Console do navegador (F12)
2. Verifique se a URL está correta em `backend-config.js`
3. Teste acessar a URL do backend diretamente no navegador
4. Verifique se o Railway está rodando (veja logs no painel)

### Banco de dados vazio após deploy
**Solução**: Isso é normal! O SQLite cria um novo banco vazio. Os dados locais não são transferidos automaticamente. Considere:
- Aceitar que é um banco novo
- Ou migrar para PostgreSQL (recomendado para produção)

---

## 🗄️ Migrar para PostgreSQL (Opcional)

Para produção profissional, recomenda-se PostgreSQL:

1. No Railway, adicione um serviço PostgreSQL
2. Copie a `DATABASE_URL`
3. Instale o driver: `npm install pg`
4. Adapte o código para usar PostgreSQL em vez de SQLite

---

## 📊 Monitoramento

### Railway:
- Acesse o dashboard do projeto
- Veja logs em tempo real
- Monitore uso de recursos
- Configure alertas

### Logs do Backend:
```bash
# No Railway, vá em "Deployments" e clique no último deploy
# Os logs aparecem em tempo real
```

---

## 💰 Custos

### Railway Free Tier:
- 500 horas/mês grátis
- $5 de crédito por mês
- Suficiente para projetos pequenos/médios

### Render Free Tier:
- 750 horas/mês grátis
- App hiberna após 15min de inatividade
- Reinicia automaticamente no primeiro acesso

---

## ✅ Checklist Final

- [ ] Backend hospedado no Railway/Render
- [ ] URL do backend copiada
- [ ] `backend-config.js` atualizado com a URL
- [ ] `dashboard.html` inclui `backend-config.js`
- [ ] CORS configurado no `server.js`
- [ ] Frontend re-deployado no Firebase
- [ ] Testado: criação de conta
- [ ] Testado: login
- [ ] Testado: dashboard carregando dados
- [ ] Testado: criar relatório de fraude

---

## 🎉 Resultado Final

Após completar todos os passos:

- ✅ **Frontend**: https://a3-quinta-1a763.web.app (Firebase Hosting)
- ✅ **Backend**: https://seu-projeto.railway.app (Railway)
- ✅ **Banco de Dados**: SQLite (hospedado no Railway)
- ✅ **Autenticação**: Firebase Auth + Firestore
- ✅ **Sistema 100% na nuvem!**

---

## 📞 Suporte

Se precisar de ajuda:
1. Verifique os logs no Railway
2. Teste a URL do backend no navegador
3. Verifique o Console do navegador (F12)
4. Revise o arquivo `backend-config.js`
