# ZENIT - Sistema Inteligente Anti-Fraude PIX

![GitHub Repository](https://img.shields.io/badge/-GitHub%20Repository-black?style=flat-square&logo=github) ![Demo Live](https://img.shields.io/badge/-Demo%20Live-blue?style=flat-square) ![Node.js 18+](https://img.shields.io/badge/-Node.js%2018%2B-green?style=flat-square) ![License](https://img.shields.io/badge/License-MIT-lightgrey)

## 📋 Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Arquitetura](#-arquitetura)
- [Stack Tecnológica](#-stack-tecnológica)
- [Instalação e Execução](#-instalação-e-execução)
- [Documentação da API](#-documentação-da-api)
- [Testes](#-testes)
- [Monitoramento](#-monitoramento)
- [Segurança](#-segurança)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Contribuição](#-contribuição)
- [Licença](#-licença)
- [Autor](#-autor)

## 🎯 Sobre o Projeto

ZENIT é uma plataforma avançada de detecção e prevenção de fraudes em tempo real para transações PIX no Brasil. Para ver o sistema em ação, confira a [demo aqui](https://a3-quinta-1a763.web.app).

### O Problema

As transferências instantâneas tornam muito difícil bloquear e recuperar fundos em fraudes PIX, resultando em vulnerabilidades temporais que podem ser exploradas por fraudadores.

### A Solução ZENIT

Três pilares fundamentais:
1. **Sistema de Notificação em Tempo Real**: Infraestrutura baseada em WebSocket e Firebase Cloud Messaging.
2. **Análise de Risco Automatizada**: Cálculo dinâmico de risco com base no histórico de denúncias.
3. **Prevenção Proativa**: Alertas instantâneos para bloqueios preventivos.

## ✨ Funcionalidades Principais

- 🔐 Sistema de Autenticação (Firebase Auth + JWT)
- 📝 Gerenciamento de Denúncias
- 📊 Análise de Risco em Tempo Real
- 🔔 Notificações Push e WebSocket
- 📈 Dashboard Analítico com KPIs
- 🌐 Progressive Web App (PWA)
- 🔒 Segurança Avançada (rate limiting, input validation)
- 📡 Monitoramento (Prometheus + Grafana)

## 🏗️ Arquitetura

### Implementação Atual (Node.js + SQLite)

![Diagram](link_do_diagrama_atual)
- Frontend PWA
- API Gateway (Express.js)
- Services Layer
- Data Layer (SQLite + Firebase)
- Monitoring Layer

### Arquitetura Futura (Microservices)

![Diagram](link_do_diagrama_futuro)
- API Gateway (Spring Cloud)
- Fraud Report Service
- Risk Analysis Service
- Notification Service
- PostgreSQL + RabbitMQ

## 🛠️ Stack Tecnológica

| Implementação Atual   | Arquitetura Futura |
| --------------------- | ------------------- |
| Node.js, SQLite       | Microservices       |
| Firebase              | Spring Cloud        |

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- Python 3
- Conta no Firebase

### Execução Rápida

```bash
# Linux/macOS
npm install
npm start

# Windows
npm install
npm start
```

### Execução Manual

Comandos para iniciar o backend e o frontend:
```bash
# Backend
node server.js

# Frontend
npm start
```

### Docker (Microservices)

Comandos do docker compose:
```bash
docker-compose up
```

## 📡 Documentação da API

A especificação OpenAPI pode ser encontrada [aqui](link_da_documentacao_api).

Endpoints principais:
- Endpoints de Autenticação
- Endpoints de Denúncias
- Endpoints de Análise de Risco
- Endpoints de Notificações

Inclui informações sobre rate limiting.

## 🧪 Testes

Testes E2E realizados com Playwright e testes unitários com JUnit, incluindo métricas de cobertura.

## 📊 Monitoramento

Dashboards do Grafana e métricas do Prometheus, acessíveis através dos URLs fornecidos.

## 🔒 Segurança

Recursos de segurança implementados:
- Autenticação JWT
- Rate limiting
- Validação de entrada
- Helmet.js
- bcrypt

## 📁 Estrutura do Projeto

```
/nome-do-projeto
├── /src
│   ├── /frontend
│   └── /backend
├── /tests
└── README.md
```

## 🤝 Contribuição

Diretrizes para contribuição.

## 📄 Licença

MIT License para fins acadêmicos.

## 👨‍💻 Autor

- **Matheus Gino**  
  GitHub: [@MatheusGino71](https://github.com/MatheusGino71)  
  Repositório: [github.com/MatheusGino71/A3-sistemas](https://github.com/MatheusGino71/A3-sistemas)

---

**Desenvolvido para combater fraudes PIX no Brasil 🇧🇷🛡️