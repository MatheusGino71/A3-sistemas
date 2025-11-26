# 🚀 ZENIT - Guia de Deploy Completo

## Arquitetura: Frontend (Vercel) + Backend (AWS)

```
┌─────────────────────────────────────────────────────────────┐
│                        USUÁRIO                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend)                         │
│  - HTML, CSS, JavaScript estático                            │
│  - CDN Global                                                │
│  - HTTPS automático                                          │
│  URL: https://a3-sistemas.vercel.app                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ API Calls
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    AWS (Backend)                             │
│  - Node.js + Express + Firebase Admin                       │
│  - WebSocket para tempo real                                │
│  - Elastic Beanstalk ou EC2                                 │
│  URL: https://zenit-backend.elasticbeanstalk.com            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Firebase (Database)                         │
│  - Firestore (NoSQL)                                        │
│  - Authentication                                            │
│  - Real-time Updates                                         │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Pré-requisitos

- [x] Conta GitHub (já tem)
- [ ] Conta Vercel (vincular com GitHub)
- [ ] Conta AWS
- [ ] AWS CLI instalado
- [ ] Credenciais Firebase configuradas

---

## PARTE 1️⃣: Deploy do Backend na AWS

### Opção A: Elastic Beanstalk (Recomendado - Mais Fácil)

#### 1. Instalar EB CLI

```powershell
pip install awsebcli --upgrade --user
```

#### 2. Configurar AWS Credentials

```powershell
aws configure
```

Preencha:
- AWS Access Key ID
- AWS Secret Access Key
- Default region: us-east-1
- Default output format: json

#### 3. Navegar para pasta backend

```powershell
cd "c:\Users\adm\OneDrive\Área de Trabalho\PROJETOS\a3 - quinta\sentinela-pix\backend"
```

#### 4. Inicializar Elastic Beanstalk

```powershell
eb init
```

Responda:
- Select a default region: `10` (us-east-1)
- Application name: `zenit-backend`
- Platform: `Node.js`
- Platform branch: `Node.js 18`
- CodeCommit: `n` (não)
- SSH: `y` (sim, para debug)

#### 5. Criar ambiente de produção

```powershell
eb create zenit-backend-prod --single --instance-type t2.micro
```

Aguarde ~5-10 minutos...

#### 6. Configurar variáveis de ambiente

Abra seu arquivo `firebase-service-account.json` e copie TODO o conteúdo.

```powershell
# Substitua o conteúdo abaixo pelo seu JSON completo (em uma linha)
eb setenv FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"seu-projeto",...}'
eb setenv NODE_ENV=production
```

#### 7. Fazer deploy

```powershell
eb deploy
```

#### 8. Obter URL do backend

```powershell
eb status
```

Copie a URL exibida (ex: `zenit-backend-prod.us-east-1.elasticbeanstalk.com`)

#### 9. Testar backend

```powershell
curl https://zenit-backend-prod.us-east-1.elasticbeanstalk.com/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"...","firebase":"connected"}
```

### Opção B: EC2 Manual (Mais Controle)

Ver instruções detalhadas em `AWS-DEPLOY.md`

---

## PARTE 2️⃣: Configurar Frontend para usar Backend AWS

### 1. Editar backend-config.js

Abra o arquivo:
```
sentinela-pix/frontend/backend-config.js
```

Localize a linha:
```javascript
AWS_BACKEND: 'https://seu-backend-aws.elasticbeanstalk.com',
```

Substitua pela URL real do seu backend AWS (obtida no passo 1.8):
```javascript
AWS_BACKEND: 'https://zenit-backend-prod.us-east-1.elasticbeanstalk.com',
```

### 2. Commit e Push

```powershell
cd "c:\Users\adm\OneDrive\Área de Trabalho\PROJETOS\a3 - quinta\sentinela-pix"
git add .
git commit -m "config: Configure AWS backend URL for production"
git push origin main
```

---

## PARTE 3️⃣: Deploy do Frontend na Vercel

O frontend **já está** na Vercel! O próximo push vai atualizar automaticamente.

### Verificar deploy

1. Acesse https://vercel.com/dashboard
2. Selecione o projeto `a3-sistemas`
3. Aguarde o deploy terminar (~2 minutos)
4. Clique em "Visit" para abrir o site

### URL do frontend:
```
https://a3-sistemas.vercel.app
```

---

## ✅ CHECKLIST - Arquitetura Completa

### Backend (AWS)
- [ ] EB CLI instalado
- [ ] Aplicação criada no Elastic Beanstalk
- [ ] Variável `FIREBASE_SERVICE_ACCOUNT` configurada
- [ ] Deploy realizado com sucesso
- [ ] URL obtida e testada
- [ ] Endpoint `/health` retorna 200 OK

### Frontend (Vercel)
- [ ] Código commitado no GitHub
- [ ] URL do backend AWS configurada em `backend-config.js`
- [ ] Push realizado
- [ ] Deploy automático na Vercel
- [ ] Site acessível via https://a3-sistemas.vercel.app

### Integração
- [ ] Frontend consegue se comunicar com backend AWS
- [ ] Dashboard carrega estatísticas
- [ ] Denúncias são criadas com sucesso
- [ ] Notificações funcionam

---

## 🧪 Testando a Integração

### 1. Abrir Developer Tools (F12)

### 2. Acessar o Dashboard
```
https://a3-sistemas.vercel.app/dashboard.html
```

### 3. Verificar console

Deve aparecer:
```
🔧 Backend configurado para: https://zenit-backend-prod.us-east-1.elasticbeanstalk.com
✅ Firebase Admin inicializado
📊 Estatísticas carregadas
```

### 4. Testar criação de denúncia

Preencha o formulário e envie. Deve aparecer notificação de sucesso.

---

## 📊 Monitoramento

### Backend (AWS)

```powershell
# Ver logs em tempo real
eb logs --all

# Ver status do ambiente
eb status

# Ver métricas
eb health
```

### Frontend (Vercel)

1. Acesse Vercel Dashboard
2. Clique no projeto
3. Vá em "Analytics" para ver métricas de acesso

---

## 💰 Custos

### AWS Elastic Beanstalk (t2.micro)
- **Free Tier**: 750 horas/mês GRÁTIS por 12 meses
- **Depois do Free Tier**: ~$8/mês

### Vercel
- **Hobby Plan**: GRÁTIS (ilimitado)
- Limite: 100 GB bandwidth/mês

### Firebase
- **Spark Plan (Grátis)**:
  - 50K leituras/dia
  - 20K escritas/dia
  - 1 GB armazenamento

**TOTAL (primeiros 12 meses)**: GRÁTIS ✅  
**TOTAL (depois)**: ~$8/mês

---

## 🔧 Configurações Adicionais

### Habilitar CORS no Backend

O backend já tem CORS configurado, mas caso precise ajustar:

```javascript
// backend/server-firebase.js
app.use(cors({
    origin: [
        'http://localhost:8080',
        'https://a3-sistemas.vercel.app',
        'https://*.vercel.app'
    ],
    credentials: true
}));
```

### Configurar Domínio Personalizado

#### Frontend (Vercel):
1. Vercel Dashboard → Settings → Domains
2. Adicione seu domínio (ex: `zenit.com.br`)
3. Configure DNS conforme instruções

#### Backend (AWS):
1. Route 53 → Create Hosted Zone
2. Adicione record `api.zenit.com.br` → ALB do EB
3. Configure SSL via ACM

---

## 🆘 Troubleshooting

### Frontend não conecta ao backend

**Sintoma**: Erro CORS ou CONNECTION_REFUSED no console

**Solução**:
1. Verificar se URL em `backend-config.js` está correta
2. Verificar se backend está rodando: `eb health`
3. Verificar logs do backend: `eb logs`

### Backend retorna 503

**Sintoma**: Service Unavailable

**Solução**:
```powershell
eb logs --all
```

Verificar se Firebase está inicializado corretamente.

### Erro "rate-limit-redis"

**Solução**: Já resolvido! A pasta `backend/middleware` não é mais incluída no deploy da Vercel.

---

## 🔄 Atualizações Futuras

### Atualizar Backend

```powershell
cd backend
git pull
eb deploy
```

### Atualizar Frontend

```powershell
git add .
git commit -m "feat: Nova funcionalidade"
git push origin main
```

O Vercel faz deploy automático! 🎉

---

## 📚 Próximos Passos

1. [ ] Configurar domínio personalizado
2. [ ] Configurar CI/CD com GitHub Actions
3. [ ] Configurar monitoramento com CloudWatch
4. [ ] Configurar backup automático do Firestore
5. [ ] Implementar autenticação JWT
6. [ ] Adicionar testes E2E
7. [ ] Configurar CDN para assets estáticos

---

## 🎯 Comandos Rápidos

```powershell
# Ver status do backend
eb status

# Ver logs do backend
eb logs

# Restartar backend
eb restart

# Deploy do backend
eb deploy

# Deploy do frontend (automático via push)
git push origin main

# Ver ambientes
eb list

# Abrir backend no navegador
eb open
```

---

## 📞 Suporte

- AWS Support: https://console.aws.amazon.com/support
- Vercel Support: https://vercel.com/support
- Firebase Support: https://firebase.google.com/support

---

**✅ Deploy Completo! Frontend na Vercel + Backend na AWS + Database no Firebase**
