# 🔥 Guia de Configuração do Firebase

## Você já tem o projeto Firebase configurado! ✅

Projeto ID: `a3-quinta-1a763`

Agora falta apenas **1 passo** para o backend funcionar:

---

## 📋 Passo Único: Baixar Credenciais do Service Account

### 1. Acesse o Firebase Console
👉 https://console.firebase.google.com/project/a3-quinta-1a763/settings/serviceaccounts/adminsdk

### 2. Baixe a Chave Privada

1. Clique no botão **"Gerar nova chave privada"**
2. Confirme clicando em **"Gerar chave"**
3. Um arquivo JSON será baixado automaticamente

### 3. Instale o Arquivo

1. **Renomeie** o arquivo baixado para: `   `
2. **Mova** o arquivo para a pasta: `backend/`
3. O caminho final deve ser: `backend/firebase-service-account.json`

### 4. Exemplo do arquivo (NÃO use este, baixe o real!)

```json
{
  "type": "service_account",
  "project_id": "a3-quinta-1a763",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@a3-quinta-1a763.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

---

## ✅ Verificação de Instalação

Depois de instalar o arquivo, verifique:

```powershell
# Confirme que o arquivo existe
Test-Path backend\firebase-service-account.json
# Deve retornar: True
```

---

## 🚀 Iniciar o Projeto

Após configurar o Firebase, execute:

```powershell
# Instalar dependências (se ainda não instalou)
cd backend
npm install

# Iniciar o backend
npm start

# Em outro terminal, iniciar o frontend
cd ../frontend
python -m http.server 8080
```

---

## 🔒 Segurança

⚠️ **IMPORTANTE:** O arquivo `firebase-service-account.json` contém credenciais sensíveis!

- ✅ **NUNCA** commite este arquivo no Git
- ✅ Já está no `.gitignore`
- ✅ Mantenha este arquivo privado

---

## 📚 Estrutura do Firestore

Seu banco de dados terá estas coleções:

### Collection: `fraudReports`
```javascript
{
  id: "uuid",
  pixKey: "string",
  reporterBank: "string",
  description: "string",
  amount: number,
  status: "pending" | "investigating" | "confirmed" | "rejected",
  priority: "low" | "medium" | "high" | "critical",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Collection: `notifications`
```javascript
{
  id: "uuid",
  type: "fraud_report" | "status_update",
  title: "string",
  message: "string",
  fraudReportId: "string",
  read_at: timestamp | null,
  created_at: timestamp
}
```

---

## 🔍 Troubleshooting

### Erro: "ENOENT: no such file or directory"
➡️ Você não baixou o arquivo `firebase-service-account.json`

### Erro: "Invalid service account"
➡️ O arquivo está corrompido ou não é o correto

### Erro: "Permission denied"
➡️ Verifique as permissões do Firestore no Console do Firebase

---

## 📞 Próximos Passos

1. ✅ Baixar `firebase-service-account.json`
2. ✅ Colocar na pasta `backend/`
3. ✅ Executar `npm start` no backend
4. ✅ Testar a API: http://localhost:3001/health

**Tudo pronto!** 🎉
