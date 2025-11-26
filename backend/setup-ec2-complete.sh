#!/bin/bash
# ZENIT Backend - Complete Setup Script for EC2
# Run this in CloudShell to fix PM2 and start the server

echo " ZENIT Backend - Setup Completo"
echo "=================================="

# 1. Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo " Instalando Node.js..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs
fi

echo " Node.js version: $(node -v)"
echo " NPM version: $(npm -v)"

# 2. Install PM2 globally
echo " Instalando PM2..."
sudo npm install -g pm2

# 3. Navigate to backend
cd ~/A3-sistemas/backend

# 4. Install dependencies
echo " Instalando dependências do backend..."
npm install

# 5. Check Firebase credentials
if [ ! -f "firebase-service-account.json" ]; then
    echo "  ATENÇÃO: firebase-service-account.json não encontrado!"
    echo "Crie o arquivo com suas credenciais do Firebase Console"
else
    echo " Firebase credentials encontrado"
fi

# 6. Stop any existing PM2 processes
pm2 delete zenit-backend 2>/dev/null || true

# 7. Start the server
echo " Iniciando servidor..."
pm2 start server-firebase.js --name zenit-backend

# 8. Save PM2 config
pm2 save

# 9. Configure PM2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

echo ""
echo "=================================="
echo " Setup completo!"
echo "=================================="
echo ""
pm2 status
echo ""
echo " Testando servidor..."
sleep 2
curl http://localhost:3001/health
echo ""
