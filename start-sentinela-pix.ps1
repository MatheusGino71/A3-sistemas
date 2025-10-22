# Script PowerShell para inicializar o Sentinela PIX
# Uso: .\start-sentinela-pix.ps1

Write-Host "🚀 Iniciando Sentinela PIX - Sistema Anti-Fraude PIX" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Verificar se Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Instale Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se Python está instalado
try {
    $pythonVersion = python --version
    Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python não encontrado. Instale Python primeiro." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependências verificadas" -ForegroundColor Green

# Navegar para o diretório do backend
Set-Location backend

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
    npm install
}

Write-Host "🔧 Iniciando backend..." -ForegroundColor Blue

# Iniciar backend em background
$backendProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -NoNewWindow

# Aguardar backend inicializar
Start-Sleep -Seconds 3

# Verificar se backend está rodando
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend iniciado com sucesso na porta 3001" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Erro ao iniciar backend" -ForegroundColor Red
    Stop-Process -Id $backendProcess.Id -Force
    exit 1
}

# Navegar para o frontend
Set-Location ../frontend

Write-Host "🖥️ Iniciando frontend..." -ForegroundColor Blue

# Iniciar frontend em background
$frontendProcess = Start-Process -FilePath "python" -ArgumentList "-m", "http.server", "8080" -PassThru -NoNewWindow

# Aguardar frontend inicializar
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "🎉 Sentinela PIX está rodando!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "🖥️ Dashboard Frontend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "🔧 API Backend: http://localhost:3001/api/v1" -ForegroundColor Cyan
Write-Host "❤️ Health Check: http://localhost:3001/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Para parar os serviços:" -ForegroundColor Yellow
Write-Host "   - Backend PID: $($backendProcess.Id)" -ForegroundColor Yellow
Write-Host "   - Frontend PID: $($frontendProcess.Id)" -ForegroundColor Yellow
Write-Host "   - Use Ctrl+C neste terminal" -ForegroundColor Yellow
Write-Host ""
Write-Host "📊 Acesse o dashboard em: http://localhost:8080" -ForegroundColor Magenta

# Aguardar Ctrl+C
try {
    Write-Host "Pressione Ctrl+C para parar os serviços..." -ForegroundColor Gray
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Verificar se os processos ainda estão rodando
        if ($backendProcess.HasExited) {
            Write-Host "⚠️ Backend parou inesperadamente!" -ForegroundColor Red
            break
        }
        if ($frontendProcess.HasExited) {
            Write-Host "⚠️ Frontend parou inesperadamente!" -ForegroundColor Red
            break
        }
    }
} finally {
    Write-Host "🛑 Parando serviços..." -ForegroundColor Yellow
    
    if (-not $backendProcess.HasExited) {
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Backend parado" -ForegroundColor Green
    }
    
    if (-not $frontendProcess.HasExited) {
        Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Frontend parado" -ForegroundColor Green
    }
    
    Write-Host "👋 Sentinela PIX encerrado!" -ForegroundColor Green
}