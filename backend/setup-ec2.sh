#!/bin/bash

# Script de Setup Automático - ZENIT Backend no AWS EC2
# Execute com: bash setup-ec2.sh

set -e

echo "🚀 Iniciando setup do ZENIT Backend no EC2..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Atualizar sistema
echo -e "${YELLOW}📦 Atualizando sistema...${NC}"
sudo apt-get update -y
sudo apt-get upgrade -y

# Instalar Node.js 18.x
echo -e "${YELLOW}📦 Instalando Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node_version=$(node --version)
npm_version=$(npm --version)
echo -e "${GREEN}✅ Node.js ${node_version} instalado${NC}"
echo -e "${GREEN}✅ npm ${npm_version} instalado${NC}"

# Instalar PM2 globalmente
echo -e "${YELLOW}📦 Instalando PM2...${NC}"
sudo npm install -g pm2

# Instalar Git (se não estiver instalado)
echo -e "${YELLOW}📦 Instalando Git...${NC}"
sudo apt-get install -y git

# Criar diretório para o projeto
echo -e "${YELLOW}📁 Criando diretório do projeto...${NC}"
cd ~
if [ ! -d "zenit-backend" ]; then
    mkdir zenit-backend
fi
cd zenit-backend

# Verificar se já existe o repositório
if [ -d "A3-sistemas" ]; then
    echo -e "${YELLOW}📂 Repositório já existe, atualizando...${NC}"
    cd A3-sistemas
    git pull origin main
    cd sentinela-pix/backend
else
    echo -e "${YELLOW}📥 Clonando repositório...${NC}"
    git clone https://github.com/MatheusGino71/A3-sistemas.git
    cd A3-sistemas/sentinela-pix/backend
fi

# Instalar dependências
echo -e "${YELLOW}📦 Instalando dependências do projeto...${NC}"
npm install

# Verificar se firebase-service-account.json existe
if [ ! -f "firebase-service-account.json" ]; then
    echo -e "${RED}⚠️  ATENÇÃO: Arquivo firebase-service-account.json NÃO encontrado!${NC}"
    echo -e "${YELLOW}Por favor, crie o arquivo com suas credenciais Firebase:${NC}"
    echo ""
    echo "nano firebase-service-account.json"
    echo ""
    echo "Cole o conteúdo JSON do Firebase e salve (Ctrl+O, Enter, Ctrl+X)"
    echo ""
    echo -e "${YELLOW}Após criar o arquivo, execute novamente este script.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Arquivo firebase-service-account.json encontrado${NC}"
fi

# Configurar PM2
echo -e "${YELLOW}🔧 Configurando PM2...${NC}"

# Parar processo existente (se houver)
pm2 delete zenit-backend 2>/dev/null || true

# Iniciar aplicação
echo -e "${YELLOW}🚀 Iniciando aplicação...${NC}"
pm2 start server-firebase.js --name zenit-backend

# Configurar PM2 para iniciar automaticamente no boot
echo -e "${YELLOW}⚙️  Configurando PM2 para iniciar no boot...${NC}"
pm2 startup systemd -u $USER --hp $HOME
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
pm2 save

# Configurar firewall (permitir porta 3001)
echo -e "${YELLOW}🔥 Configurando firewall...${NC}"
sudo ufw allow 3001/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw --force enable

# Instalar e configurar Nginx (opcional - proxy reverso)
echo ""
echo -e "${YELLOW}Deseja instalar Nginx como proxy reverso? (recomendado) [y/N]${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${YELLOW}📦 Instalando Nginx...${NC}"
    sudo apt-get install -y nginx
    
    echo -e "${YELLOW}🔧 Configurando Nginx...${NC}"
    sudo tee /etc/nginx/sites-available/zenit > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:3001/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

    # Ativar configuração
    sudo ln -sf /etc/nginx/sites-available/zenit /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Testar e reiniciar Nginx
    sudo nginx -t
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    # Abrir porta 80
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    
    echo -e "${GREEN}✅ Nginx configurado com sucesso!${NC}"
    echo -e "${GREEN}   Seu backend agora está acessível na porta 80${NC}"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Setup concluído com sucesso!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📊 Status da aplicação:${NC}"
pm2 status
echo ""
echo -e "${YELLOW}📝 Comandos úteis:${NC}"
echo "  pm2 logs zenit-backend      # Ver logs em tempo real"
echo "  pm2 status                  # Ver status"
echo "  pm2 restart zenit-backend   # Reiniciar"
echo "  pm2 stop zenit-backend      # Parar"
echo "  pm2 monit                   # Monitoramento"
echo ""
echo -e "${YELLOW}🌐 URLs do backend:${NC}"

# Obter IP público
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "SEU_IP_PUBLICO")

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "  http://${PUBLIC_IP}/health"
    echo "  http://${PUBLIC_IP}/api/v1/dashboard/stats"
else
    echo "  http://${PUBLIC_IP}:3001/health"
    echo "  http://${PUBLIC_IP}:3001/api/v1/dashboard/stats"
fi

echo ""
echo -e "${YELLOW}⚠️  PRÓXIMOS PASSOS:${NC}"
echo "1. Configure o Security Group do EC2 para permitir:"
echo "   - Porta 3001 (ou 80/443 se usar Nginx)"
echo "   - Origem: 0.0.0.0/0 (ou o IP do Vercel)"
echo ""
echo "2. Atualize o frontend (backend-config.js) com a URL:"
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "   AWS_BACKEND: 'http://${PUBLIC_IP}'"
else
    echo "   AWS_BACKEND: 'http://${PUBLIC_IP}:3001'"
fi
echo ""
echo "3. Teste o backend:"
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "   curl http://${PUBLIC_IP}/health"
else
    echo "   curl http://${PUBLIC_IP}:3001/health"
fi
echo ""
echo -e "${GREEN}🎉 Seu backend está rodando!${NC}"
