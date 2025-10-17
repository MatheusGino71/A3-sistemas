# Script para executar o report-service sem Maven
# Definindo JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-25.0.0.36-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Verificando se existe application.yml no target/classes
if (!(Test-Path "target\classes\application.yml")) {
    Copy-Item "src\main\resources\application.yml" "target\classes\" -Force
    Write-Host "Copiado application.yml para target/classes"
}

# Executando com Java diretamente usando o classpath
$classpath = "target\classes"

# Adicionando dependências básicas do Spring Boot (simulação)
Write-Host "Iniciando Report Service na porta 8081..."
Write-Host "JAVA_HOME: $env:JAVA_HOME"
Write-Host "Classpath: $classpath"

# Tentando executar a aplicação principal
& "$env:JAVA_HOME\bin\java.exe" -cp $classpath "-Dserver.port=8081" com.bradesco.sentinela.reportservice.ReportServiceApplication