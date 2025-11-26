# ZENIT Backend - Deploy na AWS

## 📋 Pré-requisitos

- Conta AWS ativa
- AWS CLI instalado e configurado
- Node.js 18+ instalado localmente
- Credenciais Firebase (firebase-service-account.json)

## 🚀 Opção 1: Deploy com AWS Elastic Beanstalk

### Instalação do EB CLI

```bash
pip install awsebcli --upgrade --user
```

### Passo 1: Inicializar aplicação

```bash
cd backend
eb init
```

Selecione:
- Região: us-east-1 (ou sua preferência)
- Plataforma: Node.js 18
- SSH: Sim (para debug)

### Passo 2: Criar ambiente

```bash
eb create zenit-backend-prod
```

### Passo 3: Configurar variáveis de ambiente

```bash
eb setenv NODE_ENV=production
eb setenv FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"...","private_key":"..."}'
```

**IMPORTANTE**: Cole todo o conteúdo do arquivo `firebase-service-account.json` como string JSON.

### Passo 4: Deploy

```bash
eb deploy
```

### Passo 5: Abrir aplicação

```bash
eb open
```

### Verificar logs

```bash
eb logs
```

### Verificar status

```bash
eb status
```

## 🚀 Opção 2: Deploy com EC2 (Manual)

### Passo 1: Criar instância EC2

1. Acesse AWS Console → EC2
2. Launch Instance:
   - AMI: Ubuntu Server 22.04 LTS
   - Instance type: t2.micro (Free Tier) ou t3.small (recomendado)
   - Security Group: Abrir portas 22 (SSH), 80 (HTTP), 443 (HTTPS), 3001 (API)

### Passo 2: Conectar via SSH

```bash
ssh -i sua-chave.pem ubuntu@seu-ip-publico
```

### Passo 3: Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

### Passo 4: Clonar e configurar projeto

```bash
git clone https://github.com/MatheusGino71/A3-sistemas.git
cd A3-sistemas/sentinela-pix/backend
npm install
```

### Passo 5: Configurar Firebase

Criar arquivo `firebase-service-account.json`:

```bash
nano firebase-service-account.json
```

Cole as credenciais Firebase e salve (Ctrl+O, Enter, Ctrl+X).

### Passo 6: Iniciar com PM2

```bash
pm2 start server-firebase.js --name zenit-backend
pm2 startup
pm2 save
```

### Passo 7: Configurar Nginx (Opcional - Proxy reverso)

```bash
sudo apt-get install nginx -y
sudo nano /etc/nginx/sites-available/zenit
```

Adicione:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:3001/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Ativar configuração:

```bash
sudo ln -s /etc/nginx/sites-available/zenit /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Comandos úteis PM2

```bash
pm2 status          # Ver status
pm2 logs            # Ver logs
pm2 restart zenit-backend  # Reiniciar
pm2 stop zenit-backend     # Parar
pm2 delete zenit-backend   # Remover
```

## 🚀 Opção 3: Deploy com Docker na AWS ECS

### Passo 1: Build da imagem

```bash
cd backend
docker build -t zenit-backend .
```

### Passo 2: Tag e Push para ECR

```bash
aws ecr create-repository --repository-name zenit-backend
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin SEU_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker tag zenit-backend:latest SEU_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/zenit-backend:latest
docker push SEU_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/zenit-backend:latest
```

### Passo 3: Criar Task Definition e Service no ECS

1. Acesse AWS Console → ECS
2. Crie um Cluster
3. Crie Task Definition com a imagem do ECR
4. Crie Service e configure Load Balancer

## 🔧 Configuração do Frontend (Vercel)

Após deploy do backend, atualize a variável de ambiente no frontend:

1. Acesse Vercel Dashboard → seu-projeto → Settings → Environment Variables
2. Adicione:
   - `VITE_API_URL` = `https://seu-backend-aws.com/api/v1`
   - Ou configure no `frontend/backend-config.js`

## 📊 Monitoramento

### CloudWatch (AWS)

- Logs automáticos via EB ou EC2
- Criar alarmes para CPU, memória, erros

### Métricas customizadas

O backend expõe endpoint `/metrics` (Prometheus format):

```bash
curl https://seu-backend-aws.com/metrics
```

## 🔒 Segurança

### SSL/TLS

Para Elastic Beanstalk:

```bash
eb create --platform "Node.js 18" --cname zenit-backend --ssl
```

Para EC2 + Nginx, use Certbot:

```bash
sudo apt-get install certbot python3-certbot-nginx -y
sudo certbot --nginx -d seu-dominio.com
```

## 💰 Custos Estimados

- **t2.micro EC2**: ~$8/mês (Free Tier: 750h/mês grátis por 12 meses)
- **Elastic Beanstalk**: Sem custo adicional (paga pelos recursos EC2, RDS, etc.)
- **t3.small EC2**: ~$15/mês
- **Elastic IP**: Grátis se anexado, $0.005/hora se não usado
- **Data Transfer**: Primeiros 100GB grátis/mês

## 🔄 CI/CD (GitHub Actions)

Criar arquivo `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy Backend to AWS

on:
  push:
    branches: [main]
    paths:
      - 'sentinela-pix/backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Elastic Beanstalk
        uses: einaregilsson/beanstalk-deploy@v21
        with:
          aws_access_key: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          application_name: zenit-backend
          environment_name: zenit-backend-prod
          version_label: ${{ github.sha }}
          region: us-east-1
          deployment_package: sentinela-pix/backend
```

## 📝 Variáveis de Ambiente Necessárias

```bash
NODE_ENV=production
PORT=3001
FIREBASE_SERVICE_ACCOUNT='{...}'  # JSON das credenciais
FIREBASE_DATABASE_URL=https://seu-projeto.firebaseio.com
```

## 🆘 Troubleshooting

### Backend não inicia

```bash
eb logs --all  # Ver todos os logs
pm2 logs       # Ver logs do PM2
```

### Erro de conexão Firebase

Verificar se `FIREBASE_SERVICE_ACCOUNT` está corretamente configurado:

```bash
eb printenv  # Verificar variáveis
```

### WebSocket não funciona

Certifique-se que o Security Group permite conexões WebSocket na porta configurada.

## 🔗 Links Úteis

- [AWS Elastic Beanstalk Docs](https://docs.aws.amazon.com/elasticbeanstalk/)
- [AWS EC2 Docs](https://docs.aws.amazon.com/ec2/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Configuration](https://nginx.org/en/docs/)
