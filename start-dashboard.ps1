# Sentinela PIX - Dashboard Startup Script
# Executa o frontend dashboard em servidor local

Write-Host "🛡️  Iniciando Sentinela PIX Dashboard..." -ForegroundColor Cyan
Write-Host ""

# Verificar se está na pasta correta
$currentPath = Get-Location
$frontendPath = Join-Path $currentPath "frontend"

if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Pasta 'frontend' não encontrada!" -ForegroundColor Red
    Write-Host "   Execute este script a partir da pasta raiz do projeto sentinela-pix" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para continuar..."
    exit 1
}

# Navegar para a pasta frontend
Set-Location $frontendPath

Write-Host "📂 Diretório atual: $frontendPath" -ForegroundColor Green
Write-Host ""

# Verificar se os arquivos existem
$requiredFiles = @("index.html", "dashboard.html", "dashboard.js", "styles.css")
$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "❌ Arquivos necessários não encontrados:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "   - $file" -ForegroundColor Yellow
    }
    Write-Host ""
    Read-Host "Pressione Enter para continuar..."
    exit 1
}

Write-Host "✅ Todos os arquivos necessários encontrados!" -ForegroundColor Green
Write-Host ""

# Tentar diferentes métodos para servir o dashboard
Write-Host "🚀 Tentando iniciar o servidor web..." -ForegroundColor Cyan
Write-Host ""

# Método 1: Python
try {
    $pythonVersion = python --version 2>$null
    if ($pythonVersion) {
        Write-Host "🐍 Python encontrado: $pythonVersion" -ForegroundColor Green
        Write-Host "   Iniciando servidor Python HTTP..." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📡 Dashboard disponível em:" -ForegroundColor Green
        Write-Host "   👉 http://localhost:8080" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "⚠️  Para parar o servidor, pressione Ctrl+C" -ForegroundColor Yellow
        Write-Host ""
        
        # Tentar abrir o navegador automaticamente
        try {
            Start-Process "http://localhost:8080"
            Write-Host "🌐 Abrindo navegador automaticamente..." -ForegroundColor Green
        }
        catch {
            Write-Host "🌐 Abra manualmente: http://localhost:8080" -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "                SENTINELA PIX DASHBOARD                " -ForegroundColor White
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host ""
        
        # Executar servidor Python
        python -m http.server 8080
        exit 0
    }
}
catch {
    Write-Host "❌ Python não encontrado, tentando alternativas..." -ForegroundColor Yellow
}

# Método 2: Node.js/npm
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "🟢 Node.js encontrado: $nodeVersion" -ForegroundColor Green
        
        # Verificar se http-server está instalado
        $httpServer = npx --version 2>$null
        if ($httpServer) {
            Write-Host "   Iniciando servidor Node.js HTTP..." -ForegroundColor Cyan
            Write-Host ""
            Write-Host "📡 Dashboard disponível em:" -ForegroundColor Green
            Write-Host "   👉 http://localhost:8080" -ForegroundColor Yellow
            Write-Host ""
            
            # Tentar abrir o navegador
            try {
                Start-Process "http://localhost:8080"
                Write-Host "🌐 Abrindo navegador automaticamente..." -ForegroundColor Green
            }
            catch {
                Write-Host "🌐 Abra manualmente: http://localhost:8080" -ForegroundColor Yellow
            }
            
            Write-Host ""
            Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
            Write-Host "                SENTINELA PIX DASHBOARD                " -ForegroundColor White
            Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
            Write-Host ""
            
            # Executar servidor Node
            npx http-server -p 8080 --cors
            exit 0
        }
    }
}
catch {
    Write-Host "❌ Node.js não encontrado ou erro na execução" -ForegroundColor Yellow
}

# Método 3: Instruções manuais
Write-Host ""
Write-Host "❌ Não foi possível iniciar um servidor automaticamente" -ForegroundColor Red
Write-Host ""
Write-Host "📋 Para executar o dashboard manualmente:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Opção 1 - Python:" -ForegroundColor White
Write-Host "   1. Instale o Python (https://python.org)" -ForegroundColor Gray
Write-Host "   2. Execute: python -m http.server 8080" -ForegroundColor Gray
Write-Host ""
Write-Host "   Opção 2 - Node.js:" -ForegroundColor White
Write-Host "   1. Instale o Node.js (https://nodejs.org)" -ForegroundColor Gray
Write-Host "   2. Execute: npx http-server -p 8080" -ForegroundColor Gray
Write-Host ""
Write-Host "   Opção 3 - VS Code:" -ForegroundColor White
Write-Host "   1. Instale a extensão 'Live Server'" -ForegroundColor Gray
Write-Host "   2. Clique direito em index.html > Open with Live Server" -ForegroundColor Gray
Write-Host ""
Write-Host "   Opção 4 - Arquivo Local:" -ForegroundColor White
Write-Host "   1. Abra o arquivo index.html diretamente no navegador" -ForegroundColor Gray
Write-Host "   2. Algumas funcionalidades podem não funcionar via file://" -ForegroundColor Yellow
Write-Host ""

# Tentar abrir o arquivo local como fallback
$indexFile = Join-Path $frontendPath "index.html"
Write-Host "🔗 Tentando abrir arquivo local..." -ForegroundColor Cyan
try {
    Start-Process $indexFile
    Write-Host "✅ Arquivo aberto no navegador padrão" -ForegroundColor Green
}
catch {
    Write-Host "❌ Erro ao abrir arquivo: $_" -ForegroundColor Red
}

Write-Host ""
Read-Host "Pressione Enter para continuar..."