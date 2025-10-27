# 🚀 Guia de Deploy - ZENIT

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Deploy Local com Docker](#deploy-local-com-docker)
3. [Deploy em Produção](#deploy-em-produção)
4. [CI/CD com GitHub Actions](#cicd-com-github-actions)
5. [Monitoramento](#monitoramento)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

### Software Necessário

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Node.js** 18.x (para desenvolvimento local)
- **Git**

### Secrets Necessários

Configure os seguintes secrets no GitHub (Settings > Secrets and variables > Actions):

```bash
# Docker Hub
DOCKER_USERNAME=seu_usuario
DOCKER_PASSWORD=sua_senha

# SSH para Deploy
STAGING_HOST=staging.zenit.com.br
STAGING_USER=deploy
STAGING_SSH_KEY=sua_chave_privada_ssh

# Email para notificações
MAIL_USERNAME=ci@zenit.com.br
MAIL_PASSWORD=senha_email
NOTIFY_EMAIL=equipe@zenit.com.br

# Aplicação
JWT_SECRET=chave_secreta_jwt_minimo_32_caracteres
REDIS_PASSWORD=senha_redis
```

---

## 🐳 Deploy Local com Docker

### 1. Clone o repositório

```bash
git clone https://github.com/MatheusGino71/A3-sistemas.git
cd A3-sistemas/sentinela-pix
```

### 2. Configure variáveis de ambiente

```bash
cp backend/.env.example backend/.env
```

Edite `backend/.env` com suas configurações.

### 3. Build e start dos containers

```bash
# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Iniciar todos os serviços
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 4. Verificar status

```bash
# Verificar containers
docker-compose -f docker-compose.prod.yml ps

# Health check do backend
curl http://localhost:3001/health

# Health check do frontend
curl http://localhost:8080/health
```

### 5. Acessar aplicação

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001/api/v1
- **Documentação API**: http://localhost:3001/api/docs
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090

---

## 🌐 Deploy em Produção

### Opção 1: Docker em Servidor VPS

#### 1. Preparar servidor

```bash
# SSH no servidor
ssh user@seu-servidor.com

# Instalar Docker e Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. Configurar aplicação

```bash
# Criar diretório
sudo mkdir -p /var/www/zenit
cd /var/www/zenit

# Clone o repositório
git clone https://github.com/MatheusGino71/A3-sistemas.git .

# Configurar variáveis de ambiente
cp backend/.env.example backend/.env
sudo nano backend/.env
```

#### 3. Deploy

```bash
# Build e start
docker-compose -f docker-compose.prod.yml up -d --build

# Configurar Nginx como proxy reverso (opcional)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/zenit
```

Configuração Nginx sugerida:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/zenit /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com
```

### Opção 2: Azure App Service

#### 1. Criar recursos no Azure

```bash
# Login
az login

# Criar resource group
az group create --name zenit-rg --location brazilsouth

# Criar App Service Plan
az appservice plan create --name zenit-plan --resource-group zenit-rg --is-linux --sku B1

# Criar Web App
az webapp create --resource-group zenit-rg --plan zenit-plan --name zenit-app --runtime "NODE|18-lts"
```

#### 2. Configurar deployment

```bash
# Configurar deployment a partir do GitHub
az webapp deployment source config --name zenit-app --resource-group zenit-rg --repo-url https://github.com/MatheusGino71/A3-sistemas --branch main --manual-integration

# Configurar variáveis de ambiente
az webapp config appsettings set --resource-group zenit-rg --name zenit-app --settings JWT_SECRET="sua_chave" NODE_ENV="production"
```

---

## 🔄 CI/CD com GitHub Actions

O pipeline CI/CD é ativado automaticamente em:

- **Push** para branch `main` ou `develop`
- **Pull Requests** para `main` ou `develop`

### Pipeline Stages

1. **🔍 Lint e Validação** (5 min)
   - Validação OpenAPI
   - Audit de dependências
   - Verificação de vulnerabilidades

2. **🧪 Testes** (10 min)
   - Testes do backend
   - Validação do frontend
   - Cobertura de código

3. **🏗️ Build** (5 min)
   - Build do backend
   - Criação de artefatos

4. **🔒 Segurança** (15 min)
   - Análise CodeQL
   - Verificação de secrets expostos

5. **🐳 Docker** (10 min)
   - Build de imagens Docker
   - Push para Docker Hub

6. **🚀 Deploy** (5 min)
   - Deploy automático para staging
   - Verificação de health

### Monitorar Pipeline

Acesse: https://github.com/MatheusGino71/A3-sistemas/actions

---

## 📊 Monitoramento

### Grafana Dashboards

1. Acesse: http://localhost:3000
2. Login: admin / admin
3. Dashboards disponíveis:
   - API Performance
   - Sistema Overview
   - Error Rates
   - Rate Limiting

### Prometheus Queries

Exemplos de queries úteis:

```promql
# Taxa de requisições por segundo
rate(http_requests_total[5m])

# Latência média
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))

# Taxa de erro
rate(http_requests_total{status=~"5.."}[5m])

# Uso de memória
process_resident_memory_bytes
```

### Logs

```bash
# Ver logs do backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Ver logs específicos
tail -f backend/logs/combined-2024-01-15.log
tail -f backend/logs/error-2024-01-15.log
tail -f backend/logs/security-2024-01-15.log
```

---

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose -f docker-compose.prod.yml logs backend

# Verificar configuração
docker-compose -f docker-compose.prod.yml config

# Rebuild forçado
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate
```

### Banco de dados corrompido

```bash
# Fazer backup
docker exec zenit-backend sqlite3 /app/data/sentinela_pix.db ".backup /app/data/backup.db"

# Restaurar backup
docker exec zenit-backend sqlite3 /app/data/sentinela_pix.db ".restore /app/data/backup.db"
```

### Alto uso de memória

```bash
# Ver uso de recursos
docker stats

# Limitar memória do container
docker update --memory="512m" --memory-swap="1g" zenit-backend
```

### Problemas de rede

```bash
# Verificar rede Docker
docker network ls
docker network inspect zenit-network

# Recrear rede
docker-compose -f docker-compose.prod.yml down
docker network prune
docker-compose -f docker-compose.prod.yml up -d
```

### Limpar espaço em disco

```bash
# Remover containers parados
docker container prune

# Remover imagens não utilizadas
docker image prune -a

# Remover volumes não utilizados
docker volume prune

# Limpeza completa (CUIDADO!)
docker system prune -a --volumes
```

---

## 🔐 Segurança em Produção

### Checklist de Segurança

- [ ] JWT_SECRET configurado com chave forte
- [ ] HTTPS habilitado com certificado válido
- [ ] Rate limiting ativo
- [ ] Logs de segurança habilitados
- [ ] Firewall configurado
- [ ] Backups automáticos configurados
- [ ] Dependências atualizadas
- [ ] Secrets não expostos no código
- [ ] CORS configurado corretamente
- [ ] Database com senha forte

### Atualizar aplicação

```bash
# Pull últimas mudanças
git pull origin main

# Rebuild e restart
docker-compose -f docker-compose.prod.yml up -d --build

# Verificar logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 📞 Suporte

- **Email**: suporte@zenit.com.br
- **GitHub Issues**: https://github.com/MatheusGino71/A3-sistemas/issues
- **Documentação**: http://localhost:3001/api/docs

---

**🌟 ZENIT** - Sistema Anti-Fraude PIX  
*Deploy com confiança!*
