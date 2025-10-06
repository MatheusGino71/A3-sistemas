#!/bin/bash

# Script para executar testes do Sentinela PIX
# Usage: ./run-tests.sh [report|query|all]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

run_report_service_tests() {
    print_status "Executando testes do Report Service..."
    cd report-service
    mvn clean test
    cd ..
}

run_query_service_tests() {
    print_status "Executando testes do Query Service..."
    cd query-service
    mvn clean test
    cd ..
}

run_all_tests() {
    print_status "Executando todos os testes..."
    run_report_service_tests
    run_query_service_tests
    print_status "Todos os testes foram executados com sucesso!"
}

check_dependencies() {
    if ! command -v mvn &> /dev/null; then
        print_error "Maven não está instalado. Por favor, instale o Maven primeiro."
        exit 1
    fi
    
    if ! command -v java &> /dev/null; then
        print_error "Java não está instalado. Por favor, instale o Java 17+ primeiro."
        exit 1
    fi
}

show_help() {
    echo "Uso: $0 [report|query|all]"
    echo ""
    echo "Opções:"
    echo "  report    Executa apenas os testes do Report Service"
    echo "  query     Executa apenas os testes do Query Service" 
    echo "  all       Executa todos os testes (padrão)"
    echo "  help      Mostra esta ajuda"
}

main() {
    check_dependencies
    
    case "${1:-all}" in
        "report")
            run_report_service_tests
            ;;
        "query")
            run_query_service_tests
            ;;
        "all")
            run_all_tests
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Opção inválida: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$@"