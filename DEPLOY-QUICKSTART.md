# 🚀 DEPLOY DO SENTINELA PIX - GUIA RÁPIDO

## ✅ Passo 1: CORS Configurado no Backend
```
✓ server.js atualizado com domínios Firebase
✓ CORS permite requisições de a3-quinta-1a763.web.app
```

## ✅ Passo 2: Arquivos de Deploy Criados
```
✓ backend/Procfile - Railway/Heroku
✓ backend/DEPLOY.md - Instruções detalhadas
✓ frontend/backend-config.js - Config de URL
✓ configure-backend.py - Script de automação
✓ DEPLOY-GUIDE.md - Guia completo
```

## 🎯 PRÓXIMOS PASSOS (Você precisa fazer):

### 1️⃣ HOSPEDAR O BACKEND NO RAILWAY

**Acesse:** https://railway.app/

**Passos:**
1. Login com GitHub
2. New Project → Deploy from GitHub repo
3. Escolha: `MatheusGino71/A3-sistemas`
4. Settings → Root Directory: `sentinela-pix/backend`
5. Settings → Domains → Generate Domain
6. **COPIE A URL GERADA!** Ex: `https://sentinela-pix-production.railway.app`

### 2️⃣ CONFIGURAR A URL NO FRONTEND

**Opção A - Script Automático:**
```bash
cd "C:\Users\adm\OneDrive\Área de Trabalho\PROJETOS\a3 - quinta\sentinela-pix"
python configure-backend.py
# Cole a URL do Railway quando solicitado
```

**Opção B - Manual:**
1. Abra: `frontend/backend-config.js`
2. Linha 10, altere:
   ```javascript
   PRODUCTION: 'COLE-A-URL-DO-RAILWAY-AQUI',
   ```

### 3️⃣ FAZER DEPLOY DO FRONTEND

```bash
cd "C:\Users\adm\OneDrive\Área de Trabalho\PROJETOS\a3 - quinta\sentinela-pix"
firebase deploy --only hosting
```

### 4️⃣ TESTAR

1. Acesse: https://a3-quinta-1a763.web.app
2. Crie uma conta ou faça login
3. Verifique se o dashboard carrega
4. Teste criar um relatório de fraude

---

## 📊 ALTERNATIVAS DE HOSPEDAGEM

| Serviço | Gratuito | Deploy | SQLite | Recomendação |
|---------|----------|--------|--------|--------------|
| Railway | 500h/mês | GitHub | ✅ | ⭐⭐⭐⭐⭐ |
| Render  | 750h/mês | GitHub | ⚠️ | ⭐⭐⭐⭐ |
| Fly.io  | Créditos | CLI    | ✅ | ⭐⭐⭐ |

---

## 🆘 TROUBLESHOOTING

**Erro: CORS blocked**
→ Verifique se deployou o server.js atualizado

**Erro: Cannot connect**
→ Verifique URL no backend-config.js
→ Teste a URL do Railway no navegador

**Erro: 404 Not Found**
→ Verifique Root Directory no Railway: `sentinela-pix/backend`

**Banco vazio após deploy**
→ Normal! É um novo banco. Use Firebase Firestore para persistência.

---

## 📝 CHECKLIST FINAL

- [ ] Backend deployado no Railway
- [ ] URL do Railway copiada
- [ ] backend-config.js atualizado
- [ ] Frontend re-deployado no Firebase
- [ ] Teste: Login funciona
- [ ] Teste: Dashboard carrega dados
- [ ] Teste: Criar relatório funciona

---

## 🎉 RESULTADO ESPERADO

```
Frontend (Firebase): https://a3-quinta-1a763.web.app
Backend (Railway):   https://seu-projeto.railway.app
Auth (Firebase):     Firebase Authentication
Database:            Firestore + SQLite (Railway)
Status:              🟢 100% na nuvem!
```

---

## 📞 PRECISA DE AJUDA?

1. Revise o arquivo `DEPLOY-GUIDE.md` (guia detalhado)
2. Verifique os logs no Railway (painel do projeto)
3. Abra o Console do navegador (F12) e veja os erros
4. Teste a URL do backend diretamente no navegador

**Boa sorte com o deploy! 🚀**
