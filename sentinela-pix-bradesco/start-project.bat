@echo off
echo =========================================
echo    SENTINELA PIX - INICIANDO PROJETO
echo =========================================
echo.

set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.0.36-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo [1/3] Iniciando Report Service (porta 8081)...
start /B cmd /c "cd report-service && mvn spring-boot:run"

echo [2/3] Aguardando 15 segundos...
timeout /t 15 /nobreak > nul

echo [3/3] Iniciando Query Service (porta 8082)...
start /B cmd /c "cd query-service && mvn spring-boot:run"

echo [4/4] Aguardando mais 15 segundos...
timeout /t 15 /nobreak > nul

echo [5/5] Iniciando Interface Web (porta 8080)...
start /B cmd /c "cd web-interface && python -m http.server 8080"

echo.
echo =========================================
echo     TODOS OS SERVIÇOS INICIADOS!
echo =========================================
echo.
echo URLs de acesso:
echo  - Capa: http://localhost:8080/cover.html
echo  - Sistema: http://localhost:8080/index.html
echo  - Report API: http://localhost:8081/actuator/health
echo  - Query API: http://localhost:8082/actuator/health
echo.
echo Pressione qualquer tecla para sair...
pause > nul