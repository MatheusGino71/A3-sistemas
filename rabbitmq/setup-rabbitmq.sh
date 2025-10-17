#!/bin/bash

# Script para configurar filas, exchanges e bindings do RabbitMQ
# Sentinela PIX - Sistema de Prevenção à Fraude PIX

set -e

# Configurações
RABBITMQ_HOST=${RABBITMQ_HOST:-localhost}
RABBITMQ_PORT=${RABBITMQ_PORT:-15672}
RABBITMQ_USER=${RABBITMQ_USER:-sentinelapix_user}
RABBITMQ_PASS=${RABBITMQ_PASS:-sentinelapix_pass}
RABBITMQ_VHOST=${RABBITMQ_VHOST:-/}

echo "🐰 Configurando RabbitMQ para Sentinela PIX..."
echo "📍 Host: $RABBITMQ_HOST:$RABBITMQ_PORT"
echo "👤 Usuário: $RABBITMQ_USER"

# Função para fazer requisições HTTP para RabbitMQ API
rabbitmq_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    curl -s -u "$RABBITMQ_USER:$RABBITMQ_PASS" \
         -H "Content-Type: application/json" \
         -X "$method" \
         "http://$RABBITMQ_HOST:$RABBITMQ_PORT/api/$endpoint" \
         ${data:+-d "$data"}
}

echo ""
echo "🔧 Criando Exchanges..."

# Exchange principal para denúncias de fraude
echo "  📨 fraud.reports.topic (topic)"
rabbitmq_api PUT "exchanges/$RABBITMQ_VHOST/fraud.reports.topic" '{
    "type": "topic",
    "durable": true,
    "auto_delete": false
}'

# Exchange para Dead Letter Queues
echo "  💀 fraud.reports.dlx (direct)"
rabbitmq_api PUT "exchanges/$RABBITMQ_VHOST/fraud.reports.dlx" '{
    "type": "direct",
    "durable": true,
    "auto_delete": false
}'

echo ""
echo "🗂️  Criando Filas..."

# Fila para notificações
echo "  📬 fraud.reports.notification"
rabbitmq_api PUT "queues/$RABBITMQ_VHOST/fraud.reports.notification" '{
    "durable": true,
    "auto_delete": false,
    "arguments": {
        "x-message-ttl": 86400000,
        "x-dead-letter-exchange": "fraud.reports.dlx",
        "x-dead-letter-routing-key": "fraud.reports.notification.dlq"
    }
}'

# Fila para análise de risco
echo "  🎯 fraud.reports.risk.analysis"
rabbitmq_api PUT "queues/$RABBITMQ_VHOST/fraud.reports.risk.analysis" '{
    "durable": true,
    "auto_delete": false,
    "arguments": {
        "x-message-ttl": 86400000,
        "x-dead-letter-exchange": "fraud.reports.dlx",
        "x-dead-letter-routing-key": "fraud.reports.risk.analysis.dlq"
    }
}'

# Fila para auditoria
echo "  📋 fraud.reports.audit"
rabbitmq_api PUT "queues/$RABBITMQ_VHOST/fraud.reports.audit" '{
    "durable": true,
    "auto_delete": false,
    "arguments": {
        "x-message-ttl": 604800000
    }
}'

# Dead Letter Queues
echo "  ⚰️  fraud.reports.notification.dlq"
rabbitmq_api PUT "queues/$RABBITMQ_VHOST/fraud.reports.notification.dlq" '{
    "durable": true,
    "auto_delete": false,
    "arguments": {
        "x-message-ttl": 604800000
    }
}'

echo "  ⚰️  fraud.reports.risk.analysis.dlq"
rabbitmq_api PUT "queues/$RABBITMQ_VHOST/fraud.reports.risk.analysis.dlq" '{
    "durable": true,
    "auto_delete": false,
    "arguments": {
        "x-message-ttl": 604800000
    }
}'

echo ""
echo "🔗 Criando Bindings..."

# Binding para notificações
echo "  🔗 fraud.reports.topic -> fraud.reports.notification"
rabbitmq_api POST "bindings/$RABBITMQ_VHOST/e/fraud.reports.topic/q/fraud.reports.notification" '{
    "routing_key": "fraud.reports.notification"
}'

# Binding para análise de risco
echo "  🔗 fraud.reports.topic -> fraud.reports.risk.analysis"
rabbitmq_api POST "bindings/$RABBITMQ_VHOST/e/fraud.reports.topic/q/fraud.reports.risk.analysis" '{
    "routing_key": "fraud.reports.risk.analysis"
}'

# Binding para auditoria (recebe todas as mensagens)
echo "  🔗 fraud.reports.topic -> fraud.reports.audit"
rabbitmq_api POST "bindings/$RABBITMQ_VHOST/e/fraud.reports.topic/q/fraud.reports.audit" '{
    "routing_key": "fraud.reports.#"
}'

# Bindings para Dead Letter Queues
echo "  🔗 fraud.reports.dlx -> fraud.reports.notification.dlq"
rabbitmq_api POST "bindings/$RABBITMQ_VHOST/e/fraud.reports.dlx/q/fraud.reports.notification.dlq" '{
    "routing_key": "fraud.reports.notification.dlq"
}'

echo "  🔗 fraud.reports.dlx -> fraud.reports.risk.analysis.dlq"
rabbitmq_api POST "bindings/$RABBITMQ_VHOST/e/fraud.reports.dlx/q/fraud.reports.risk.analysis.dlq" '{
    "routing_key": "fraud.reports.risk.analysis.dlq"
}'

echo ""
echo "📋 Configurando Políticas..."

# Política para High Availability
echo "  🏢 Política de Alta Disponibilidade"
rabbitmq_api PUT "policies/$RABBITMQ_VHOST/fraud-reports-ha" '{
    "pattern": "fraud\\.reports\\.*",
    "definition": {
        "ha-mode": "all",
        "ha-sync-mode": "automatic"
    },
    "priority": 0,
    "apply-to": "queues"
}'

echo ""
echo "✅ Configuração do RabbitMQ concluída com sucesso!"
echo ""
echo "📊 Resumo da Configuração:"
echo "  • 2 Exchanges criados (fraud.reports.topic, fraud.reports.dlx)"
echo "  • 5 Filas criadas (notification, risk.analysis, audit, + 2 DLQs)"
echo "  • 5 Bindings configurados"
echo "  • 1 Política de HA aplicada"
echo ""
echo "🌐 Acesse o Management UI: http://$RABBITMQ_HOST:$RABBITMQ_PORT"
echo "👤 Credenciais: $RABBITMQ_USER / [senha configurada]"