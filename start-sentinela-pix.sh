#!/bin/bash
# Script para inicializar o Sentinela PIX

echo "🚀 Iniciando Sentinela PIX - Sistema Anti-Fraude PIX"
echo "==============================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js primeiro."
    exit 1
fi

# Verificar se Python está instalado
if ! command -v python &> /dev/null; then
    echo "❌ Python não encontrado. Instale Python primeiro."
    exit 1
fi

echo "✅ Dependências verificadas"

# Navegar para o diretório do backend
cd backend

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    npm install
fi

echo "🔧 Iniciando backend..."
# Iniciar backend em background
node server.js &
BACKEND_PID=$!

# Aguardar backend inicializar
sleep 3

# Verificar se backend está rodando
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend iniciado com sucesso na porta 3001"
else
    echo "❌ Erro ao iniciar backend"
    kill $BACKEND_PID
    exit 1
fi

# Navegar para o frontend
cd ../frontend

echo "🖥️ Iniciando frontend..."
# Iniciar frontend em background
python -m http.server 8080 &
FRONTEND_PID=$!

# Aguardar frontend inicializar
sleep 2

echo ""
echo "🎉 Sentinela PIX está rodando!"
echo "================================"
echo "🖥️ Dashboard Frontend: http://localhost:8080"
echo "🔧 API Backend: http://localhost:3001/api/v1"
echo "❤️ Health Check: http://localhost:3001/health"
echo ""
echo "💡 Para parar os serviços:"
echo "   - Backend PID: $BACKEND_PID"
echo "   - Frontend PID: $FRONTEND_PID"
echo "   - Use: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📊 Acesse o dashboard em: http://localhost:8080"

# Aguardar Ctrl+C
trap "echo 'Parando serviços...'; kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT
wait