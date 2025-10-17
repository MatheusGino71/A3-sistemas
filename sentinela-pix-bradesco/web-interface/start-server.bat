@echo off
echo Iniciando servidor web para interface Sentinela PIX...
echo.
echo Interface disponível em: http://localhost:3000
echo Para parar o servidor, pressione Ctrl+C
echo.

cd /d "%~dp0"

REM Tenta usar Python
python --version >nul 2>&1
if %errorlevel%==0 (
    echo Usando Python como servidor web...
    python -m http.server 3000
    goto :end
)

REM Tenta usar Python3
python3 --version >nul 2>&1
if %errorlevel%==0 (
    echo Usando Python3 como servidor web...
    python3 -m http.server 3000
    goto :end
)

REM Tenta usar Node.js
node --version >nul 2>&1
if %errorlevel%==0 (
    echo Instalando e usando live-server...
    npx live-server --port=3000 --no-browser
    goto :end
)

REM Tenta usar PHP
php --version >nul 2>&1
if %errorlevel%==0 (
    echo Usando PHP como servidor web...
    php -S localhost:3000
    goto :end
)

echo ERRO: Nenhum servidor web encontrado!
echo Por favor, instale Python, Node.js ou PHP para executar a interface.
echo.
echo Ou abra o arquivo index.html diretamente no navegador.
pause

:end