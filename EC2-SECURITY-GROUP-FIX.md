# 🔧 Configurar Security Group do EC2 para Permitir Acesso Externo

## ⚠️ PROBLEMA ATUAL

O frontend na Vercel **NÃO consegue** conectar ao backend EC2 porque a porta 3001 está bloqueada pelo Security Group.

Erro típico no navegador:
```
Failed to load resource: net::ERR_CONNECTION_TIMED_OUT
http://3.148.105.205:3001/api/v1/reports
```

---

## ✅ SOLUÇÃO: Adicionar Regra no Security Group

### **Passo 1: Abrir AWS EC2 Console**
1. Acesse: https://us-east-2.console.aws.amazon.com/ec2/home?region=us-east-2
2. Clique em **"Instances (running)"**
3. Selecione sua instância: `i-0ace2463254d03533`

### **Passo 2: Editar Security Group**
1. Na seção **"Security"** (aba inferior), clique no link do **Security Group** (ex: `sg-xxxxxxxxx`)
2. Clique na aba **"Inbound rules"**
3. Clique em **"Edit inbound rules"**

### **Passo 3: Adicionar Regra para Porta 3001**
Clique em **"Add rule"** e configure:

| Type       | Protocol | Port Range | Source    | Description                    |
|------------|----------|------------|-----------|--------------------------------|
| Custom TCP | TCP      | 3001       | 0.0.0.0/0 | ZENIT Backend API (Vercel)     |

**OU adicione também IPv6:**

| Type       | Protocol | Port Range | Source    | Description                    |
|------------|----------|------------|-----------|--------------------------------|
| Custom TCP | TCP      | 3001       | ::/0      | ZENIT Backend API (IPv6)       |

### **Passo 4: Salvar**
1. Clique em **"Save rules"**
2. Aguarde 10 segundos

---

## 🧪 TESTAR SE FUNCIONOU

### **Teste 1: No CloudShell (servidor local)**
```bash
curl http://localhost:3001/health
```
**Esperado:** `{"status":"ok","timestamp":"..."}`

### **Teste 2: No CloudShell (IP público)**
```bash
curl http://3.148.105.205:3001/health
```
**Esperado:** `{"status":"ok","timestamp":"..."}`

### **Teste 3: No seu navegador (Windows)**
Abra: http://3.148.105.205:3001/health

**Esperado:** JSON aparece na tela

### **Teste 4: Frontend Vercel**
1. Acesse: https://a3-sistemas.vercel.app
2. Abra o Console (F12)
3. Veja se aparece: `🔧 Backend configurado para: http://3.148.105.205:3001`
4. **NÃO** deve aparecer erros de conexão

---

## 📋 CHECKLIST COMPLETO PARA O BACKEND FUNCIONAR

### ✅ No EC2 (CloudShell):
- [ ] Servidor PM2 rodando (`pm2 status` = **online**)
- [ ] Firebase credentials correto (`firebase-service-account.json` válido)
- [ ] Rate limiter fixado (código atualizado do GitHub)
- [ ] Porta 3001 respondendo localmente (`curl localhost:3001/health`)

**Comandos para verificar:**
```bash
cd ~/A3-sistemas/backend
pm2 status
curl http://localhost:3001/health
```

### ✅ No AWS Console:
- [ ] Security Group permite porta 3001 de `0.0.0.0/0`
- [ ] Instância EC2 está **running**
- [ ] IP público é `3.148.105.205`

### ✅ No Frontend (Vercel):
- [ ] `backend-config.js` tem IP `3.148.105.205:3001`
- [ ] Código commitado e pushed para GitHub
- [ ] Vercel fez auto-deploy (webhook do GitHub)

---

## 🚨 SE AINDA NÃO FUNCIONAR

### Problema 1: PM2 Continua Crashando
```bash
# Ver logs detalhados
pm2 logs zenit-backend --lines 50 --nostream

# Se o Firebase ainda está com erro, recrie o arquivo
cat > ~/A3-sistemas/backend/firebase-service-account.json << 'EOF'
{
  "type": "service_account",
  "project_id": "SEU_PROJECT_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----\nSUA_CHAVE\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk@SEU_PROJECT_ID.iam.gserviceaccount.com"
}
EOF

# Restart
pm2 restart zenit-backend
```

### Problema 2: CORS Error no Frontend
Se o servidor funcionar mas der erro de CORS, adicione isto no `server-firebase.js`:

```javascript
app.use(cors({
    origin: [
        'http://localhost:5500',
        'https://a3-sistemas.vercel.app'
    ],
    credentials: true
}));
```

### Problema 3: IP do EC2 Mudou
EC2 muda o IP quando reinicia. Para IP fixo:
1. AWS Console → EC2 → Elastic IPs
2. Allocate Elastic IP Address
3. Associate com sua instância
4. Atualize `backend-config.js` com o novo IP

---

## 📞 PRÓXIMOS PASSOS

**Agora no CloudShell, execute:**

```bash
# 1. Ir para o backend
cd ~/A3-sistemas/backend

# 2. Puxar código com fix do rate limiter
git pull origin main

# 3. Verificar se Firebase credentials está correto
cat firebase-service-account.json

# 4. Se estiver errado, recrie com dados reais do Firebase Console

# 5. Restart PM2
pm2 restart zenit-backend

# 6. Verificar status
pm2 status

# 7. Testar localmente
curl http://localhost:3001/health

# 8. Testar com IP público (só funciona SE Security Group foi configurado)
curl http://3.148.105.205:3001/health
```

**Depois disso:**
- Configure o Security Group (Passo 2 acima)
- Teste no navegador: http://3.148.105.205:3001/health
- Abra o site: https://a3-sistemas.vercel.app

✅ **Tudo deve funcionar!**
