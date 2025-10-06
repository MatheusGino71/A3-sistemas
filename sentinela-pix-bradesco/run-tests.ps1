# Script PowerShell para executar testes do Sentinela PIX
# Usage: .\run-tests.ps1 [report|query|all]

param(
    [Parameter(Position=0)]
    [ValidateSet("report", "query", "all", "help")]
    [string]$Target = "all"
)

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Test-Dependencies {
    $mvnExists = Get-Command mvn -ErrorAction SilentlyContinue
    if ($null -eq $mvnExists) {
        Write-Error "Maven não está instalado. Por favor, instale o Maven primeiro."
        exit 1
    }
    
    $javaExists = Get-Command java -ErrorAction SilentlyContinue
    if ($null -eq $javaExists) {
        Write-Error "Java não está instalado. Por favor, instale o Java 17+ primeiro."
        exit 1
    }
}

function Invoke-ReportServiceTests {
    Write-Status "Executando testes do Report Service..."
    Set-Location report-service
    try {
        mvn clean test
        if ($LASTEXITCODE -ne 0) {
            throw "Testes do Report Service falharam"
        }
    }
    finally {
        Set-Location ..
    }
}

function Invoke-QueryServiceTests {
    Write-Status "Executando testes do Query Service..."
    Set-Location query-service
    try {
        mvn clean test
        if ($LASTEXITCODE -ne 0) {
            throw "Testes do Query Service falharam"
        }
    }
    finally {
        Set-Location ..
    }
}

function Invoke-AllTests {
    Write-Status "Executando todos os testes..."
    Invoke-ReportServiceTests
    Invoke-QueryServiceTests
    Write-Status "Todos os testes foram executados com sucesso!"
}

function Show-Help {
    Write-Host "Uso: .\run-tests.ps1 [report|query|all]"
    Write-Host ""
    Write-Host "Opções:"
    Write-Host "  report    Executa apenas os testes do Report Service"
    Write-Host "  query     Executa apenas os testes do Query Service"
    Write-Host "  all       Executa todos os testes (padrão)"
    Write-Host "  help      Mostra esta ajuda"
}

function Main {
    Test-Dependencies
    
    try {
        switch ($Target) {
            "report" {
                Invoke-ReportServiceTests
            }
            "query" {
                Invoke-QueryServiceTests
            }
            "all" {
                Invoke-AllTests
            }
            "help" {
                Show-Help
            }
            default {
                Write-Error "Opção inválida: $Target"
                Show-Help
                exit 1
            }
        }
    }
    catch {
        Write-Error $_.Exception.Message
        exit 1
    }
}

Main