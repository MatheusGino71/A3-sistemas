# ZENIT - Sistema Inteligente Anti-Fraude PIX


[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/MatheusGino71/A3-sistemas)

[![License](https://img.shields.io/badge/License-MIT-green)](https://github.com/MatheusGino71/A3-sistemas)

[![Demo](https://img.shields.io/badge/Demo-Live-success)](https://a3-quinta-1a763.web.app)[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/MatheusGino71/A3-sistemas)

[![Node](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)

[![License](https://img.shields.io/badge/License-MIT-green)](https://github.com/MatheusGino71/A3-sistemas)

## Sumário

[![Demo](https://img.shields.io/badge/Demo-Live-success)](https://a3-quinta-1a763.web.app)# ⭐ ZENIT

1. [Sobre o Projeto](#1-sobre-o-projeto)

   - 1.1. [O Problema](#11-o-problema)[![Node](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)

   - 1.2. [A Solução ZENIT](#12-a-solução-zenit)

2. [Funcionalidades Principais](#2-funcionalidades-principais)

3. [Arquitetura da Solução](#3-arquitetura-da-solução)

   - 3.1. [Implementação de Referência (Node.js)](#31-implementação-de-referência-nodejs)## Sobre o Projeto

   - 3.2. [Arquitetura Alvo (Microserviços Java/Spring)](#32-arquitetura-alvo-microserviços-javaspring)

4. [Stack Tecnológica](#4-stack-tecnológica)### Sistema Inteligente de Detecção e Prevenção de Fraudes em Transações PIX[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/MatheusGino71/A3-sistemas)

5. [Execução Local (Implementação de Referência)](#5-execução-local-implementação-de-referência)

   - 5.1. [Pré-requisitos](#51-pré-requisitos)ZENIT é uma plataforma avançada de detecção e prevenção de fraudes em tempo real, desenvolvida para combater golpes no sistema de pagamentos PIX brasileiro. A solução oferece uma infraestrutura robusta que conecta instituições financeiras através de um sistema centralizado de denúncias, análise de risco e notificações automatizadas.

   - 5.2. [Configuração](#52-configuração)

   - 5.3. [Execução](#53-execução)

6. [Execução com Docker (Microserviços)](#6-execução-com-docker-microserviços)

7. [Testes](#7-testes)**Demonstração Online:** [https://a3-quinta-1a763.web.app](https://a3-quinta-1a763.web.app)

8. [Documentação da API](#8-documentação-da-api)

9. [CI/CD e Monitoramento](#9-cicd-e-monitoramento)[![GitHub](https://img.shields.io/badge/GitHub-Repository-CC092F?style=for-the-badge&logo=github)](https://github.com/MatheusGino71/A3-sistemas)[![License](https://img.shields.io/badge/License-Academic-green)](https://github.com/MatheusGino71/A3-sistemas)

10. [Licença](#10-licença)

### Principais Características

---

[![License](https://img.shields.io/badge/License-Academic-CC092F?style=for-the-badge)](https://github.com/MatheusGino71/A3-sistemas)

## 1. Sobre o Projeto

- **Notificações em Tempo Real:** Sistema de comunicação via WebSocket e Firebase Cloud Messaging para alertas instantâneos

**ZENIT** é uma plataforma de software abrangente projetada para a detecção e prevenção de fraudes em transações PIX em tempo real. O sistema funciona como uma câmara de compensação centralizada para denúncias de fraude, permitindo que instituições financeiras e usuários colaborem para identificar e mitigar riscos.

- **Análise de Risco Automatizada:** Pontuação dinâmica de chaves PIX baseada em histórico de denúncias e padrões de comportamento[![Demo](https://img.shields.io/badge/Demo-Live-CC092F?style=for-the-badge&logo=firebase)](https://a3-quinta-1a763.web.app)[![Demo](https://img.shields.io/badge/Demo-Live-success)](https://a3-quinta-1a763.web.app)[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/MatheusGino71/A3-sistemas)

**Demonstração Online:** [https://a3-quinta-1a763.web.app](https://a3-quinta-1a763.web.app)

- **Prevenção Proativa:** Alertas instantâneos entre instituições financeiras para bloqueio preventivo

### 1.1. O Problema

- **Dashboard Completo:** Visualização de dados e KPIs em tempo real com interface responsiva[![Node](https://img.shields.io/badge/Node.js-18+-CC092F?style=for-the-badge&logo=node.js)](https://nodejs.org)

A velocidade instantânea das transações PIX, embora seja uma vantagem, também é sua principal vulnerabilidade. Golpes financeiros são executados em segundos, tornando o bloqueio e a recuperação de fundos uma tarefa extremamente difícil. O ecossistema financeiro carece de um mecanismo padronizado para a comunicação ultrarrápida de fraudes entre diferentes instituições.

- **Segurança Robusta:** Autenticação JWT, criptografia de dados e validação rigorosa de entrada

### 1.2. A Solução ZENIT

- **Monitoramento Avançado:** Integração com Prometheus e Grafana para métricas operacionais

ZENIT aborda este desafio através de uma plataforma colaborativa que fornece:



- **Registro Centralizado:** Um sistema unificado para que usuários e instituições registrem denúncias de fraude detalhadas.

- **Análise de Risco:** Um motor que calcula um "score de risco" dinâmico para chaves PIX, com base no histórico de denúncias.---![ZENIT Banner](https://img.shields.io/badge/ZENIT-Sistema_Anti_Fraude_PIX-CC092F?style=for-the-badge)

- **Comunicação em Tempo Real:** Um canal de notificação instantâneo (via WebSocket e Push Notifications) para alertar usuários e instituições sobre atividades suspeitas.

- **Prevenção:** Permite que os usuários consultem o risco de uma chave PIX antes de concluir uma transação.



---## ÍndiceO Sentinela PIX é uma plataforma abrangente de detecção e prevenção de fraudes em tempo real, projetada para combater golpes no sistema de pagamentos PIX brasileiro. A plataforma fornece relatórios centralizados de fraudes, análise de risco e sistemas automatizados de notificação para facilitar a resposta rápida entre instituições financeiras.[![License](https://img.shields.io/badge/License-Academic-green)](https://github.com/MatheusGino71/A3-sistemas)



## 2. Funcionalidades Principais



- **Gerenciamento de Usuários:** Autenticação segura (Firebase Auth e JWT), gerenciamento de perfil e painel de configurações.1. [Contextualização do Problema](#contextualização-do-problema)</div>

- **Sistema de Denúncias:** Interface para submeter relatórios de fraude detalhados, incluindo chave PIX, valor, banco e descrição.

- **Análise de Risco:** Algoritmo que calcula um score de risco para chaves PIX com base na frequência e severidade das denúncias.2. [Solução Proposta](#solução-proposta)

- **Notificações em Tempo Real:** Utiliza WebSockets para atualizações instantâneas no dashboard e Firebase Cloud Messaging (FCM) para notificações push nativas.

- **Dashboard Analítico:** Painel com KPIs (Key Performance Indicators), gráficos de atividade e listagem de denúncias recentes.3. [Arquitetura do Sistema](#arquitetura-do-sistema)

- **Progressive Web App (PWA):** O frontend é um PWA instalável com suporte offline básico via Service Workers.

- **Segurança Avançada:** Implementa rate limiting, validação de entrada e logging detalhado.4. [Stack Tecnológica](#stack-tecnológica)

- **Monitoramento:** Expõe métricas para Prometheus e inclui um dashboard Grafana pré-configurado para observabilidade.

5. [Funcionalidades Principais](#funcionalidades-principais)---

---

6. [Instalação e Execução](#instalação-e-execução)

## 3. Arquitetura da Solução

7. [Documentação da API](#documentação-da-api)## Demonstração[![Demo](https://img.shields.io/badge/Demo-Live-success)](https://a3-quinta-1a763.web.app)[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/MatheusGino71/A3-sistemas)

O projeto é estruturado em duas arquiteturas principais, refletindo uma prova de conceito funcional e uma arquitetura alvo escalável.

8. [Segurança](#segurança)

### 3.1. Implementação de Referência (Node.js)

9. [Monitoramento](#monitoramento)## 📋 Sobre o Projeto

Uma aplicação monolítica robusta servindo como a principal prova de conceito.

10. [Testes](#testes)

- **Backend:** Node.js com Express.js, servindo a API REST e o servidor WebSocket.

- **Banco de Dados:** SQLite para armazenamento local de denúncias, usuários e análises.11. [Estrutura do Projeto](#estrutura-do-projeto)

- **Frontend:** Aplicação Vanilla JS servida estaticamente.

- **Autenticação:** Gerenciada primariamente pelo Firebase Authentication.12. [Roadmap](#roadmap)



**Diagrama de Arquitetura:**13. [Contribuição](#contribuição)**ZENIT** é uma plataforma avançada de detecção e prevenção de fraudes em tempo real, desenvolvida para combater golpes no sistema de pagamentos PIX brasileiro. A solução oferece uma infraestrutura robusta que conecta instituições financeiras através de um sistema centralizado de denúncias, análise de risco e notificações automatizadas.



```14. [Licença](#licença)

┌─────────────────────────────────────────────────────────┐

│                   FRONTEND (PWA)                        │**Acesse a aplicação online**: [https://a3-quinta-1a763.web.app](https://a3-quinta-1a763.web.app)

│  ┌──────────┐  ┌──────────┐  ┌─────────────────────┐  │

│  │Dashboard │  │ Reports  │  │ Risk Analysis       │  │---

│  └──────────┘  └──────────┘  └─────────────────────┘  │

│                    ↓ HTTPS/WSS ↓                       │### 🎯 Principais Diferenciais

└─────────────────────────────────────────────────────────┘

                          │## Contextualização do Problema

┌─────────────────────────────────────────────────────────┐

│              API GATEWAY (Express.js)                   │

│  ┌────────────┐ ┌─────────────┐ ┌──────────────────┐  │

│  │Rate Limiter│ │Validation   │ │ JWT Auth         │  │A principal vulnerabilidade nas fraudes PIX reside no fator temporal. As transferências de dinheiro ocorrem instantaneamente, tornando o bloqueio e a recuperação de valores extremamente difíceis. O ecossistema bancário atual apresenta deficiências significativas na comunicação entre instituições financeiras.

│  └────────────┘ └─────────────┘ └──────────────────┘  │

└─────────────────────────────────────────────────────────┘- ⚡ **Notificações em Tempo Real** via WebSocket e Firebase Cloud Messaging

                          │

┌─────────────────────────────────────────────────────────┐### Desafios Identificados

│                  SERVICES LAYER                         │

│  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐ │- 🔍 **Análise de Risco Automatizada** com pontuação dinâmica de chaves PIXA demonstração está hospedada no Firebase Hosting e permite:O Sentinela PIX é uma plataforma abrangente de detecção e prevenção de fraudes em tempo real, projetada para combater golpes no sistema de pagamentos PIX brasileiro. A plataforma fornece relatórios centralizados de fraudes, análise de risco e sistemas automatizados de notificação para facilitar a resposta rápida entre instituições financeiras.[![License](https://img.shields.io/badge/License-Academic-green)](https://github.com/MatheusGino71/A3-sistemas)

│  │Fraud Reports │ │Risk Analysis │ │Notifications   │ │

│  └──────────────┘ └──────────────┘ └────────────────┘ │- **Comunicação Fragmentada:** Ausência de canal padronizado para troca rápida de informações sobre fraudes entre instituições

└─────────────────────────────────────────────────────────┘

                          │- **Sistema Descentralizado:** Falta de base de dados centralizada para consulta de histórico de fraudes- 🛡️ **Prevenção Proativa** através de alertas instantâneos entre instituições

┌─────────────────────────────────────────────────────────┐

│              DATA LAYER (SQLite)                        │- **Tempo de Resposta Crítico:** Janela temporal insuficiente para bloqueio preventivo de fundos

│  ┌───────┐ ┌─────────┐ ┌─────────┐ ┌──────────────┐  │

│  │Users  │ │Reports  │ │PIX Keys │ │Risk Scores   │  │- **Rastreamento Limitado:** Dificuldade em identificar contas suspeitas que operam entre múltiplas instituições- 📊 **Dashboard Completo** com visualização de dados e KPIs em tempo real

│  └───────┘ └─────────┘ └─────────┘ └──────────────┘  │

└─────────────────────────────────────────────────────────┘- **Falta de Histórico Compartilhado:** Impossibilidade de verificar o histórico de uma chave PIX antes de realizar transações

```

- 🔐 **Segurança Robusta** com autenticação JWT e Firebase

### 3.2. Arquitetura Alvo (Microserviços Java/Spring)

---

Uma arquitetura escalável e resiliente, projetada para produção.

- 🌐 **Interface Responsiva** com design moderno Bradesco- Criar uma conta de teste

- **API Gateway:** Ponto de entrada único usando Spring Cloud Gateway.

- **Fraud Report Service:** Microsserviço Java/Spring Boot para ingestão e gerenciamento de denúncias.## Solução Proposta

- **Risk Analysis Service:** Microsserviço Java/Spring Boot para calcular scores de risco.

- **Notification Service:** Microsserviço Java/Spring Boot para lidar com notificações.

- **Banco de Dados:** PostgreSQL.

- **Mensageria:** RabbitMQ para comunicação assíncrona entre serviços.O ZENIT aborda os desafios identificados através de três pilares fundamentais:



**Diagrama de Arquitetura Microserviços:**---- Submeter relatórios de fraude



```### 1. Sistema de Notificação de Baixa Latência

┌─────────────────────────────────────────────────────────┐

│                   FRONTEND (PWA)                        │

└─────────────────────────────────────────────────────────┘

                          │Implementação de canal de comunicação em tempo real utilizando WebSockets e webhooks, permitindo que instituições financeiras vítimas notifiquem instituições receptoras sobre transações fraudulentas em segundos. O sistema garante:

                          ↓

┌─────────────────────────────────────────────────────────┐## 🚀 Demonstração Online- Visualizar dashboard em tempo real## Demonstração## Índice

│              API GATEWAY (Spring Cloud)                 │

│                   Load Balancer                         │- Comunicação bidirecional instantânea

└─────────────────────────────────────────────────────────┘

                          │- Confirmação de recebimento (acknowledgment)

        ┌─────────────────┼─────────────────┐

        ↓                 ↓                 ↓- Tolerância a falhas com sistema de retry

┌──────────────┐  ┌──────────────┐  ┌──────────────┐

│Fraud Report  │  │Risk Analysis │  │Notification  │- Fallback para notificações por email**Acesse a aplicação**: [https://a3-quinta-1a763.web.app](https://a3-quinta-1a763.web.app)- Testar sistema de notificações

│   Service    │  │   Service    │  │   Service    │

│(Spring Boot) │  │(Spring Boot) │  │(Spring Boot) │

└──────────────┘  └──────────────┘  └──────────────┘

        │                 │                 │### 2. Análise e Pontuação de Risco Dinâmica

        └─────────────────┼─────────────────┘

                          ↓

                  ┌──────────────┐

                  │  RabbitMQ    │Sistema de scoring automatizado que analisa e pontua chaves PIX baseado em múltiplas variáveis:### Funcionalidades Disponíveis:- Consultar análise de risco de chaves PIX

                  │Message Queue │

                  └──────────────┘

                          ↓

                  ┌──────────────┐- Número e frequência de denúncias recebidas- ✅ Criar conta de teste

                  │ PostgreSQL   │

                  │   Database   │- Padrões de comportamento transacional

                  └──────────────┘

```- Histórico de resolução de denúncias- ✅ Submeter relatórios de fraude



---- Análise temporal de atividades suspeitas



## 4. Stack Tecnológica- Score de risco consultável em tempo real por instituições participantes- ✅ Visualizar dashboard em tempo real



| Categoria         | Implementação de Referência (Node.js)              | Arquitetura Alvo (Java)                           |

|-------------------|---------------------------------------------------|---------------------------------------------------|

| **Backend**       | Node.js, Express.js                               | Java 17+, Spring Boot 3, Spring Cloud             |### 3. Mecanismo de Prevenção Proativa- ✅ Testar sistema de notificações**Nota**: O backend está em modo demonstração e utiliza dados de teste. Para uma implementação completa, siga as instruções de [Instalação e Execução Local](#instalação-e-execução-local).**Acesse a aplicação online**: [https://a3-quinta-1a763.web.app](https://a3-quinta-1a763.web.app)O Sentinela PIX é uma plataforma abrangente de detecção e prevenção de fraudes em tempo real, projetada para combater golpes no sistema de pagamentos PIX brasileiro. A plataforma fornece relatórios centralizados de fraudes, análise de risco e sistemas automatizados de notificação para facilitar a resposta rápida entre instituições financeiras.

| **Banco de Dados**| SQLite, Firebase Firestore                        | PostgreSQL, Redis                                 |

| **Comunicação**   | API REST, WebSocket                               | API REST, RabbitMQ                                |

| **Autenticação**  | Firebase Auth, JWT                                | Spring Security, JWT                              |

| **Frontend**      | HTML5, Tailwind CSS, Vanilla JS                   | (O mesmo frontend)                                |Ferramentas que auxiliam na prevenção de transações futuras para contas identificadas como fraudulentas:- ✅ Consultar análise de risco de chaves PIX

| **DevOps**        | Docker, Nginx, GitHub Actions                     | Docker, GitHub Actions, Kubernetes                |

| **Monitoramento** | Prometheus, Grafana                               | Prometheus, Grafana, ELK Stack                    |



---- Verificação de risco pré-transacional



## 5. Execução Local (Implementação de Referência)- Alertas automáticos para transações de alto risco



Esta é a forma mais rápida de executar a prova de conceito funcional.- Bloqueio preventivo configurável> **Nota**: A demonstração online utiliza dados de teste. Para ambiente completo, execute localmente seguindo as [instruções de instalação](#-instalação-e-execução).



### 5.1. Pré-requisitos- Histórico compartilhado entre instituições



- Node.js v18+## Índice

- Python 3 (para servir o frontend estático)

- Conta Firebase (para `frontend/firebase-config.js`)---



### 5.2. Configuração---



**1. Clonar o repositório:**## Arquitetura do Sistema



```bash

git clone https://github.com/MatheusGino71/A3-sistemas.git

cd A3-sistemas### Implementação Atual (Node.js + SQLite)

```

## 📑 Índice

**2. Configurar Backend:**

A arquitetura atual é otimizada para demonstração, desenvolvimento e pequena escala de produção:

- Navegue até `backend/`.

- Copie `.env.example` para `.env` e preencha as variáveis (especialmente `JWT_SECRET`).1. [Visão Geral](#visão-geral)A demonstração está hospedada no Firebase Hosting e permite:

- Instale as dependências: `npm install`.

```

**3. Configurar Frontend:**

┌─────────────────────────────────────────────────────────┐- [Sobre o Projeto](#-sobre-o-projeto)

- Preencha `frontend/firebase-config.js` com suas chaves do Firebase.

- Preencha a chave VAPID em `frontend/user-system.js` para notificações push.│                   FRONTEND (PWA)                        │



### 5.3. Execução│  ┌──────────┐  ┌──────────┐  ┌─────────────────────┐  │- [O Problema](#-o-problema)2. [O Problema](#o-problema)



O projeto inclui scripts de inicialização para conveniência.│  │Dashboard │  │ Reports  │  │ Risk Analysis       │  │



```bash│  └──────────┘  └──────────┘  └─────────────────────┘  │- [A Solução](#-a-solução)

# Para Linux/macOS

./start-zenit.sh│                    ↓ HTTPS/WSS ↓                       │



# Para Windows (PowerShell)└─────────────────────────────────────────────────────────┘- [Arquitetura](#-arquitetura)3. [A Solução Proposta](#a-solução-proposta)

.\start-zenit.ps1

```                          │



A aplicação estará disponível em:┌─────────────────────────────────────────────────────────┐- [Stack Tecnológica](#-stack-tecnológica)



- **Frontend:** http://localhost:8080│              API GATEWAY (Express.js)                   │

- **Backend API:** http://localhost:3001

- **API Docs:** http://localhost:3001/api/docs│  ┌────────────┐ ┌─────────────┐ ┌──────────────────┐  │- [Funcionalidades](#-funcionalidades)4. [Arquitetura da Solução](#arquitetura-da-solução)



**Execução Manual:**│  │Rate Limiter│ │Validation   │ │ JWT Auth         │  │



```bash│  └────────────┘ └─────────────┘ └──────────────────┘  │- [Instalação e Execução](#-instalação-e-execução)

# Terminal 1 - Backend

cd backend└─────────────────────────────────────────────────────────┘

npm start

                          │- [Documentação da API](#-documentação-da-api)   - [Implementação de Referência (Node.js)](#implementação-de-referência-nodejs)- Criar uma conta de teste## Índice

# Terminal 2 - Frontend

cd frontend┌─────────────────────────────────────────────────────────┐

python -m http.server 8080

```│                  SERVICES LAYER                         │- [Segurança](#-segurança)



---│  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐ │



## 6. Execução com Docker (Microserviços)│  │Fraud Reports │ │Risk Analysis │ │Notifications   │ │- [Estrutura do Projeto](#-estrutura-do-projeto)   - [Arquitetura Alvo (Microservices Java/Spring Boot)](#arquitetura-alvo-microservices-javaspring-boot)



Para executar a arquitetura alvo baseada em Java e Spring Boot:│  └──────────────┘ └──────────────┘ └────────────────┘ │



**1. Construir Imagens:**└─────────────────────────────────────────────────────────┘- [Roadmap](#-roadmap)



Certifique-se de que o Docker Desktop esteja em execução.                          │



**2. Iniciar Serviços:**┌─────────────────────────────────────────────────────────┐- [Contribuição](#-contribuição)5. [Stack Tecnológica](#stack-tecnológica)- Submeter relatórios de fraude



Use o `docker-compose.yml` principal para orquestrar todos os microsserviços Java, PostgreSQL e RabbitMQ.│              DATA LAYER (SQLite)                        │



```bash│  ┌───────┐ ┌─────────┐ ┌─────────┐ ┌──────────────┐  │- [Licença](#-licença)

docker-compose up -d --build

```│  │Users  │ │Reports  │ │PIX Keys │ │Risk Scores   │  │



**3. Acesse a aplicação:**│  └───────┘ └─────────┘ └─────────┘ └──────────────┘  │6. [Funcionalidades Principais](#funcionalidades-principais)



- Frontend: http://localhost:8080└─────────────────────────────────────────────────────────┘

- Backend API: http://localhost:3001

- Prometheus: http://localhost:9090                          │---

- Grafana: http://localhost:3000 (admin/admin)

- RabbitMQ Management: http://localhost:15672 (guest/guest)┌─────────────────────────────────────────────────────────┐



---│           MONITORING & OBSERVABILITY                    │7. [Fluxo Operacional](#fluxo-operacional)- Visualizar dashboard em tempo real1. [Visão Geral](#visão-geral)## Overview## Overview



## 7. Testes│  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐ │



O projeto inclui testes unitários (Java/JUnit) e testes End-to-End (Playwright).│  │Prometheus    │ │Grafana       │ │Winston Logs    │ │## 🎯 O Problema



### Testes E2E (Node.js/Playwright):│  └──────────────┘ └──────────────┘ └────────────────┘ │



```bash└─────────────────────────────────────────────────────────┘8. [Documentação Técnica](#documentação-técnica)

# Instalar dependências de teste

cd tests```

npm install

npx playwright installA principal vulnerabilidade nas fraudes PIX é o **tempo**. As transferências de dinheiro ocorrem **instantaneamente**, tornando o bloqueio e a recuperação de valores extremamente difíceis. 



# Executar todos os testes E2E### Arquitetura Futura (Microservices)

npm test

9. [Instalação e Execução Local](#instalação-e-execução-local)- Testar sistema de notificações

# Ver o relatório de teste

npm run test:reportO projeto inclui estrutura preparada para migração para arquitetura de microservices baseada em Java/Spring Boot:



# Executar em modo UI (interativo)### Desafios Identificados:

npx playwright test --ui

- **API Gateway:** Gerenciamento de rotas e autenticação centralizada

# Executar com browser visível

npx playwright test --headed- **Fraud Report Service:** Processamento e armazenamento de denúncias- ❌ Falta de comunicação rápida entre instituições financeiras10. [Testes](#testes)

```

- **Risk Analysis Service:** Cálculo de scores e análise de padrões

### Testes Unitários (Java):

- **Notification Service:** Gerenciamento de notificações multi-canal- ❌ Ausência de sistema centralizado de denúncias

Os testes são executados como parte do pipeline de build do Maven.

- **Query Service:** CQRS para consultas otimizadas

```bash

cd microservices/fraud-report-service- ❌ Dificuldade em rastrear contas suspeitas11. [Segurança e Monitoramento](#segurança-e-monitoramento)- Consultar análise de risco de chaves PIX1. [Visão Geral](#visão-geral)

mvn test

```---



### Cobertura de Testes:- ❌ Tempo de resposta insuficiente para bloqueio de fundos



- **Autenticação:** 95%## Stack Tecnológica

- **Denúncias:** 90%

- **Análise de Risco:** 85%- ❌ Falta de histórico compartilhado de fraudes12. [Estrutura do Projeto](#estrutura-do-projeto)

- **Dashboard:** 80%

### Backend

---



## 8. Documentação da API

- **Runtime:** Node.js 18+

A API REST do ZENIT está documentada usando a especificação OpenAPI 3.0.

- **Framework:** Express.js 4.18---13. [Roadmap (Visão Futura)](#roadmap-visão-futura)

- **Arquivo de Especificação:** `docs/openapi.yaml`

- **Guia Detalhado:** `docs/API-DOCUMENTATION.md`- **Database:** SQLite3 (desenvolvimento) / PostgreSQL (produção)

- **Interface Interativa (Swagger):** Disponível em http://localhost:3001/api/docs quando o backend de referência está em execução.

- **Authentication:** JWT (jsonwebtoken)

### Endpoints Principais:

- **WebSocket:** ws 8.14

**Autenticação:**

```- **Validation:** validator, express-validator## 💡 A Solução14. [Contribuição](#contribuição)

POST /api/auth/register - Registrar novo usuário

POST /api/auth/login    - Autenticar usuário- **Security:** bcryptjs, helmet, rate-limit

GET  /api/auth/profile  - Obter perfil do usuário

```- **Logging:** winston, winston-daily-rotate-file



**Denúncias:**- **Monitoring:** prom-client (Prometheus)

```

GET    /api/reports           - Listar denúncias- **Email:** nodemailerO **ZENIT** aborda estes desafios através de três pilares fundamentais:15. [Licença](#licença)**Nota**: O backend está em modo demonstração e utiliza dados de teste. Para uma implementação completa, siga as instruções de [Instalação e Execução Local](#instalação-e-execução-local).2. [O Problema](#o-problema)2. [Problema e Solução](#problema-e-solução)

POST   /api/reports           - Criar nova denúncia

GET    /api/reports/:id       - Obter detalhes- **Scheduling:** node-cron

PUT    /api/reports/:id       - Atualizar denúncia

DELETE /api/reports/:id       - Deletar denúncia

```

### Frontend

**Análise de Risco:**

```### 1. 🚨 Sistema de Notificação Rápida

POST /api/risk/analyze        - Analisar chave PIX

GET  /api/risk/pix-key/:key   - Obter score de chave- **HTML5/CSS3/JavaScript (ES6+)**

GET  /api/risk/history        - Histórico de análises

```- **Progressive Web App (PWA):** Service Workers para cache offlineCanal de comunicação de **baixa latência** (via WebSockets e Webhooks) para que instituições vítimas comuniquem instituições receptoras sobre transações fraudulentas **em segundos**.



**Autenticação:**- **Real-time Communication:** WebSocket API



A API utiliza JWT Bearer Token. Inclua o token no header das requisições:- **Firebase:** Cloud Messaging, Hosting, Firestore## Visão Geral



```- **Charts:** Chart.js para visualização de dados

Authorization: Bearer seu-jwt-token-aqui

```- **Responsive Design:** Mobile-first approach### 2. 📊 Pontuação de Risco (Risk Scoring)



**Rate Limiting:**



- Autenticação: 5 requisições / 15 minutos### DevOps & InfraestruturaAnálise e sinalização de chaves PIX que recebem múltiplas denúncias de fraude, criando um **score de risco dinâmico** consultável por qualquer instituição participante.

- API Geral: 100 requisições / 15 minutos

- Denúncias: 10 criações / hora

- Análise de Risco: 30 consultas / minuto

- **Containerization:** Docker, Docker Compose

---

- **CI/CD:** GitHub Actions

## 9. CI/CD e Monitoramento

- **Monitoring:** Prometheus + Grafana### 3. 🛡️ Mecanismo de PrevençãoO Sentinela PIX é uma plataforma de software como serviço (SaaS) projetada para atuar como uma câmara de compensação centralizada para denúncias de fraude no PIX. O sistema visa conectar instituições financeiras, permitindo que um banco (vítima) notifique instantaneamente outro banco (receptor) sobre uma transação fraudulenta, possibilitando o bloqueio preventivo de fundos antes que sejam dissipados.## Índice3. [A Solução Proposta](#a-solução-proposta)

### CI/CD

- **Reverse Proxy:** Nginx

O projeto está configurado com um pipeline de GitHub Actions (`.github/workflows/ci.yml`) que automatiza:

- **Message Queue:** RabbitMQ (arquitetura futura)Auxilia na **prevenção de transações futuras** para contas fraudulentas, permitindo que bancos consultem o risco de uma chave PIX **antes** de efetivar uma transação.

- **Linting:** Verificação de código

- **Testes:** Execução de testes unitários e E2E- **Cloud:** Firebase Hosting (demo), preparado para Azure/AWS

- **Análise de Segurança:** CodeQL e TruffleHog

- **Builds de Docker:** Construção e push de imagens

- **Deploy:** Deploy automático para staging

### Testes

### Monitoramento

---

A implementação de referência (Node.js) expõe um endpoint `/metrics` para Prometheus e inclui um dashboard Grafana pré-configurado para visualização.

- **E2E Testing:** Playwright

**Métricas Disponíveis:**

- **Unit Testing:** Jest (preparado)## O Problema

- Taxa de requisições HTTP

- Latência de requisições (p50, p95, p99)- **API Testing:** OpenAPI validation

- Taxa de erros por endpoint

- Conexões WebSocket ativas## 🏗️ Arquitetura

- Queries no banco de dados

- Denúncias criadas---

- Análises de risco executadas

- Uso de CPU e memória



**Acesso ao Grafana:**## Funcionalidades Principais

- URL: http://localhost:3000

- Usuário: admin### Implementação Atual (Node.js)

- Senha: admin

### 1. Sistema de Autenticação

**Dashboards Inclusos:**

- ZENIT OverviewA principal vulnerabilidade nas fraudes PIX é o tempo. As transferências de dinheiro ocorrem quase instantaneamente, tornando o bloqueio e a recuperação de valores extremamente difíceis. O ecossistema bancário atual carece de um mecanismo centralizado e padronizado para a comunicação ultrarrápida de fraudes entre diferentes instituições, resultando em perdas financeiras significativas para clientes e bancos.1. [Visão Geral](#visão-geral)4. [Arquitetura da Solução](#arquitetura-da-solução)3. [Arquitetura do Sistema](#arquitetura-do-sistema)

- API Performance

- System Metrics- Registro de usuários com validação de dados

- Business KPIs

- Login seguro com JWT tokensVersão funcional e otimizada para demonstração e desenvolvimento local.

---

- Gerenciamento de sessões

## 10. Licença

- Recuperação de senha

Este projeto é desenvolvido para fins acadêmicos como parte do curso de Sistemas de Informação.

- Perfis de usuário personalizáveis

**Licença:** MIT License

```

---

### 2. Gerenciamento de Denúncias

## Estrutura do Projeto

┌─────────────────────────────────────────────────────────┐## A Solução Proposta2. [O Problema](#o-problema)

```

zenit/- Criação de denúncias de fraude com dados estruturados

├── backend/

│   ├── server.js              # Servidor principal Express- Upload de evidências (comprovantes, screenshots)│                  Aplicações Cliente                     │

│   ├── package.json           # Dependências do backend

│   ├── .env.example           # Template de variáveis de ambiente- Categorização por tipo de fraude

│   ├── middleware/

│   │   ├── rateLimiter.js     # Rate limiting- Status tracking (Pendente, Em Análise, Resolvido, Rejeitado)│        (Dashboard Web, Apps Mobile, Interfaces)         │

│   │   └── validation.js      # Validação de entrada

│   ├── services/- Histórico completo de denúncias

│   │   └── emailService.js    # Serviço de emails

│   └── utils/- Filtros avançados e busca└────────────────────────┬────────────────────────────────┘

│       ├── logger.js          # Sistema de logging

│       └── metrics.js         # Métricas Prometheus

├── frontend/

│   ├── index.html             # Página inicial### 3. Análise de Risco                         │ HTTPS / WSSA plataforma Sentinela PIX aborda este desafio através de três pilares centrais:3. [A Solução Proposta](#a-solução-proposta)   - [Implementação de Referência (Node.js)](#implementação-de-referência-nodejs)

│   ├── dashboard.html         # Dashboard principal

│   ├── dashboard.js           # Lógica do dashboard

│   ├── firebase-config.js     # Configuração Firebase

│   ├── service-worker.js      # Service Worker PWA- Verificação de chaves PIX em tempo real┌────────────────────────▼────────────────────────────────┐

│   └── manifest.json          # Manifest PWA

├── microservices/             # Arquitetura futura- Score de risco dinâmico (0-100)

│   ├── api-gateway/

│   ├── fraud-report-service/- Classificação de risco (Baixo, Médio, Alto, Crítico)│                   Camada Frontend                       │

│   ├── notification-service/

│   └── risk-analysis-service/- Histórico de transações suspeitas

├── docs/

│   ├── openapi.yaml           # Especificação OpenAPI- Indicadores de padrões fraudulentos│      • Interface HTML/CSS/JavaScript                    │

│   └── API-DOCUMENTATION.md   # Documentação da API

├── monitoring/- Recomendações automáticas de ação

│   ├── prometheus.yml         # Config Prometheus

│   └── grafana/               # Dashboards Grafana│      • Autenticação Firebase                            │- **Sistema de Notificação Rápida**: Cria um canal de comunicação de baixa latência (via WebSockets e Webhooks) para que instituições vítimas comuniquem instituições receptoras sobre transações fraudulentas em segundos.4. [Arquitetura da Solução](#arquitetura-da-solução)

├── tests/

│   └── e2e/                   # Testes Playwright### 4. Sistema de Notificações

├── docker-compose.yml         # Compose para desenvolvimento

├── docker-compose.prod.yml    # Compose para produção│      • Cliente WebSocket                                │

└── README.md                  # Este arquivo

```- Notificações em tempo real via WebSocket



---- Push notifications via Firebase Cloud Messaging│      • Service Worker FCM                               │- **Pontuação de Risco (Risk Scoring)**: Analisa e sinaliza chaves PIX e contas que recebem múltiplas denúncias de fraude, criando um score de risco dinâmico que pode ser consultado por qualquer instituição participante.



## Equipe de Desenvolvimento- Email alerts com templates HTML



**ZENIT Team** - Projeto Acadêmico A3 2024/2025- Alertas configuráveis por tipo de evento└────────────────────────┬────────────────────────────────┘



- Desenvolvimento: Matheus Gino- Central de notificações no dashboard

- Repositório: [github.com/MatheusGino71/A3-sistemas](https://github.com/MatheusGino71/A3-sistemas)

- Histórico de notificações                         │ API REST / WebSocket- **Mecanismo de Prevenção**: Auxilia na prevenção de transações futuras para contas fraudulentas, permitindo que bancos consultem o risco de uma chave PIX antes de efetivar uma transação.   - [Implementação de Referência (Node.js)](#implementação-de-referência-nodejs)   - [Arquitetura Alvo (Microservices Java/Spring Boot)](#arquitetura-alvo-microservices-javaspring-boot)4. [Stack Tecnológica](#stack-tecnológica)

---



## Contato

### 5. Dashboard Analítico┌────────────────────────▼────────────────────────────────┐

Para questões técnicas, sugestões ou parcerias:



- GitHub: [@MatheusGino71](https://github.com/MatheusGino71)

- Email: Através do GitHub Issues- Visualização de KPIs em tempo real│               Serviços Backend (Node.js)                │



---- Gráficos interativos de tendências



## Agradecimentos- Estatísticas de fraudes por período│      • API REST Express.js (Porta 3001)                 │



- Banco Central do Brasil pela infraestrutura PIX- Mapa de calor de chaves PIX suspeitas

- Comunidade Node.js e JavaScript

- Firebase pela plataforma de hosting- Relatórios exportáveis│      • Servidor WebSocket (ws://localhost:3001/ws)      │## Arquitetura da Solução   - [Arquitetura Alvo (Microservices Java/Spring Boot)](#arquitetura-alvo-microservices-javaspring-boot)

- Todos os contribuidores e testadores

- Filtros temporais e por categoria

---

│      • Autenticação JWT                                 │

**Desenvolvido com dedicação para combater fraudes e proteger usuários do sistema PIX.**

### 6. Registro e Consulta de Chaves PIX

│      • Lógica de Negócio                                │

- Cadastro de chaves PIX próprias

- Verificação de status antes de transações└────────────────────────┬────────────────────────────────┘

- Histórico de verificações

- Alertas automáticos para chaves de alto risco                         │O projeto contempla duas arquiteturas: uma implementação de referência funcional (monolítica, em Node.js) para fins de demonstração e validação, e uma arquitetura alvo (microservices, em Java) projetada para produção, escalabilidade e resiliência.5. [Stack Tecnológica](#stack-tecnológica)5. [Stack Tecnológica](#stack-tecnológica)



---        ┌────────────────┼────────────────┐



## Instalação e Execução        │                │                │



### Pré-requisitos        ▼                ▼                ▼



- Node.js 18+ e npm┌──────────────┐  ┌────────────┐  ┌─────────────┐### Implementação de Referência (Node.js)6. [Funcionalidades Principais](#funcionalidades-principais)

- Python 3.8+ (para servidor de desenvolvimento frontend)

- Git│   SQLite     │  │  Firebase  │  │   Arquivos  │

- Editor de código (VS Code recomendado)

│ • Usuários   │  │ • Auth     │  │ • Uploads   │

### Instalação Local

│ • Denúncias  │  │ • Firestore│  │ • Logs      │

1. **Clone o repositório:**

│ • Notificações│  │ • FCM      │  │ • Cache     │Esta é a versão atualmente funcional no repositório, ideal para execução local e demonstração. Utiliza uma stack simplificada com um backend monolítico e um banco de dados SQLite.7. [Fluxo Operacional](#fluxo-operacional)6. [Funcionalidades Principais](#funcionalidades-principais)5. [Funcionalidades Principais](#funcionalidades-principais)Sentinela PIX is a comprehensive real-time fraud detection and prevention platform designed to combat PIX payment system scams in Brazil. The platform provides centralized fraud reporting, risk analysis, and automated notification systems to facilitate rapid response between financial institutions.Sentinela PIX is a comprehensive real-time fraud detection and prevention platform designed to combat PIX payment system scams in Brazil. The platform provides centralized fraud reporting, risk analysis, and automated notification systems to facilitate rapid response between financial institutions.

```bash

git clone https://github.com/MatheusGino71/A3-sistemas.git└──────────────┘  └────────────┘  └─────────────┘

cd A3-sistemas/sentinela-pix

``````



2. **Configure o Backend:**



```bash---```8. [Documentação Técnica](#documentação-técnica)

cd backend

npm install

```

## 🛠️ Stack Tecnológica┌─────────────────────────────────────────────────────────────┐

3. **Configure as variáveis de ambiente:**



Crie um arquivo `.env` na pasta `backend/` baseado no `.env.example`:

### Backend│                       Aplicações Cliente                    │   - [Estrutura do Banco de Dados (SQLite)](#estrutura-do-banco-de-dados-sqlite)7. [Fluxo Operacional](#fluxo-operacional)

```env

PORT=3001- **Runtime**: Node.js v18+

NODE_ENV=development

JWT_SECRET=zenit-secret-key-2025- **Framework**: Express.js 4.18│      (Dashboard Web, Apps Mobile, Interfaces Bancárias)     │

DB_PATH=./zenit.db

- **Banco de Dados**: SQLite3

# Email Configuration (opcional)

SMTP_HOST=smtp.gmail.com- **Autenticação**: JWT + bcryptjs└────────────────────────┬────────────────────────────────────┘   - [Documentação da API](#documentação-da-api)

SMTP_PORT=587

SMTP_USER=seu-email@gmail.com- **Real-time**: WebSockets (biblioteca `ws`)

SMTP_PASS=sua-senha-app

- **Agendamento**: node-cron                         │ HTTPS / WSS

# Firebase Configuration (opcional)

FIREBASE_PROJECT_ID=your-project-id

```

### Frontend┌────────────────────────▼────────────────────────────────────┐9. [Instalação e Execução Local](#instalação-e-execução-local)8. [Documentação Técnica](#documentação-técnica)6. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)

4. **Inicie o Backend:**

- **Estrutura**: HTML5, CSS3

```bash

npm start- **Estilização**: Tailwind CSS 3.x│                       Camada Frontend                       │

```

- **Scripts**: JavaScript ES6+

O servidor estará disponível em `http://localhost:3001`

- **Ícones**: Material Symbols│      - Interface do Usuário (HTML/CSS/JavaScript)           │10. [Testes](#testes)

5. **Inicie o Frontend (em outro terminal):**

- **Fontes**: Montserrat, Roboto

```bash

cd ../frontend│      - Autenticação Firebase                                │

python -m http.server 8080

```### Integrações



O frontend estará disponível em `http://localhost:8080`- **Firebase Authentication**: Gerenciamento de usuários│      - Cliente WebSocket                                    │11. [Segurança e Monitoramento](#segurança-e-monitoramento)   - [Estrutura do Banco de Dados (SQLite)](#estrutura-do-banco-de-dados-sqlite)



### Execução com Docker- **Firebase Firestore**: Sincronização de dados



1. **Build e inicie os containers:**- **Firebase Cloud Messaging**: Notificações push│      - Service Worker FCM                                   │



```bash- **Firebase Hosting**: Hospedagem da aplicação

docker-compose up -d

```└────────────────────────┬────────────────────────────────────┘12. [Estrutura do Projeto](#estrutura-do-projeto)



2. **Acesse a aplicação:**---



- Frontend: http://localhost:8080                         │ API REST / WebSocket

- Backend API: http://localhost:3001

- Prometheus: http://localhost:9090## ✨ Funcionalidades

- Grafana: http://localhost:3000 (admin/admin)

┌────────────────────────▼────────────────────────────────────┐13. [Roadmap (Visão Futura)](#roadmap-visão-futura)   - [Documentação da API](#documentação-da-api)7. [Documentação da API](#documentação-da-api)

### Scripts Disponíveis

### 👤 Gerenciamento de Usuários

**Backend:**

- `npm start` - Inicia o servidor em modo produção- Autenticação segura com Firebase e JWT│                       Serviços Backend (Node.js)            │

- `npm run dev` - Inicia com nodemon (hot-reload)

- `npm test` - Executa testes unitários- Perfis completos com informações bancárias



**Testes E2E:**- Gerenciamento de sessões ativas│      - API REST Express.js (Porta 3001)                     │14. [Contribuição](#contribuição)

```bash

cd tests- Sistema de avatar com iniciais automáticas

npm install

npx playwright test- Configurações personalizáveis│      - Servidor WebSocket (ws://localhost:3001/ws)          │

```



---

### 📝 Sistema de Denúncias│      - Autenticação e Autorização (JWT)                     │15. [Licença](#licença)9. [Instalação e Execução Local](#instalação-e-execução-local)

## Documentação da API

- Formulário detalhado de relatório de fraude

### OpenAPI Specification

- Validação em tempo real de chaves PIX│      - Lógica de Negócio e Validação                        │

A API está completamente documentada seguindo o padrão OpenAPI 3.0.3:

- Histórico completo de denúncias

- **Especificação:** `docs/openapi.yaml`

- **Interface Interativa:** `docs/swagger.html`- Status de acompanhamento (pendente, confirmado, falso positivo)└────────────────────────┬────────────────────────────────────┘

- **Guia de Uso:** `docs/API-README.md`

- Upload de evidências

### Endpoints Principais

                         │

#### Autenticação

### 🔍 Análise de Risco

```

POST /api/auth/register - Registrar novo usuário- Algoritmo de pontuação dinâmica        ┌────────────────┼────────────────┐## Visão Geral10. [Testes](#testes)8. [Instalação e Configuração](#instalação-e-configuração)

POST /api/auth/login    - Autenticar usuário

GET  /api/auth/profile  - Obter perfil do usuário- Classificação por níveis (suspeita, alto risco, crítico)

PUT  /api/auth/profile  - Atualizar perfil

```- Consulta pública de scores por chave PIX        │                │                │



#### Denúncias- Histórico de denúncias por conta



```- Identificação de instituições afetadas        ▼                ▼                ▼

GET    /api/reports           - Listar denúncias (com filtros)

POST   /api/reports           - Criar nova denúncia

GET    /api/reports/:id       - Obter detalhes de denúncia

PUT    /api/reports/:id       - Atualizar denúncia### 🔔 Notificações em Tempo Real┌────────────────┐ ┌─────────────┐ ┌──────────────┐

DELETE /api/reports/:id       - Deletar denúncia

PUT    /api/reports/:id/status - Atualizar status- **WebSocket**: Comunicação bidirecional persistente

```

- **Push Notifications**: Alertas nativos no navegador via FCM│ Banco SQLite   │ │  Firebase   │ │Sistema Arquivos│O Sentinela PIX é uma plataforma de software como serviço (SaaS) projetada para atuar como uma câmara de compensação centralizada para denúncias de fraude no PIX. O sistema visa conectar instituições financeiras, permitindo que um banco (vítima) notifique instantaneamente outro banco (receptor) sobre uma transação fraudulenta, possibilitando o bloqueio preventivo de fundos antes que sejam dissipados.11. [Segurança e Monitoramento](#segurança-e-monitoramento)

#### Análise de Risco

- Central de notificações no dashboard

```

POST /api/risk/analyze           - Analisar chave PIX- Configurações granulares de preferências│ - Usuários     │ │  - Firestore│ │ - Uploads    │

GET  /api/risk/pix-key/:key     - Obter score de chave

GET  /api/risk/history          - Histórico de análises

```

### 📊 Dashboard Analítico│ - Denúncias    │ │  - Auth     │ │ - Logs       │

#### Chaves PIX

- KPIs em tempo real

```

GET    /api/pix-keys      - Listar chaves cadastradas- Gráficos de tendências de fraude│ - Notificações │ │  - FCM      │ │ - Cache      │

POST   /api/pix-keys      - Registrar nova chave

DELETE /api/pix-keys/:id  - Remover chave- Lista de denúncias com filtros avançados

POST   /api/pix-keys/verify - Verificar chave antes de transação

```- Estatísticas da conta│ - Tokens FCM   │ │             │ │              │## O Problema12. [Estrutura do Projeto](#estrutura-do-projeto)9. [Execução Local](#execução-local)## Problem Statement## Problem Statement



#### Estatísticas- Exportação de relatórios



```└────────────────┘ └─────────────┘ └──────────────┘

GET /api/stats/summary   - Estatísticas gerais

GET /api/stats/trends    - Tendências temporais---

```

```

#### Notificações

## 🚀 Instalação e Execução

```

GET    /api/notifications         - Listar notificações

PUT    /api/notifications/:id/read - Marcar como lida

DELETE /api/notifications/:id      - Deletar notificação### Pré-requisitos

```

### Arquitetura Alvo (Microservices Java/Spring Boot)A principal vulnerabilidade nas fraudes PIX é o tempo. As transferências de dinheiro ocorrem quase instantaneamente, tornando o bloqueio e a recuperação de valores extremamente difíceis. O ecossistema bancário atual carece de um mecanismo centralizado e padronizado para a comunicação ultrarrápida de fraudes entre diferentes instituições, resultando em perdas financeiras significativas para clientes e bancos.13. [Roadmap (Visão Futura)](#roadmap-visão-futura)

### Autenticação

- Node.js v18.0.0 ou superior

A API utiliza JWT Bearer Token. Inclua o token no header das requisições:

- npm v8.0.0 ou superior

```

Authorization: Bearer seu-jwt-token-aqui- Python 3.8+ (para servidor frontend local)

```

- GitEsta é a arquitetura planejada para um ambiente de produção robusto. Ela desacopla responsabilidades em serviços independentes, utiliza um broker de mensagens para comunicação assíncrona e um banco de dados relacional mais robusto.

### Rate Limiting

- Conta Firebase (Authentication, Firestore, FCM)

A API implementa rate limiting para proteção:



- **Autenticação:** 5 requisições / 15 minutos

- **API Geral:** 100 requisições / 15 minutos### Passo 1: Clonar o Repositório

- **Denúncias:** 10 criações / hora

- **Análise de Risco:** 30 consultas / minuto```## A Solução Proposta14. [Contribuição](#contribuição)10. [Testes](#testes)

- **Registro:** 3 contas / hora por IP

```powershell

---

git clone https://github.com/MatheusGino71/A3-sistemas.git┌─────────────────┐    ┌─────────────────────┐    ┌──────────────────────┐

## Segurança

cd A3-sistemas/sentinela-pix

### Medidas Implementadas

```│   App Bancário  │───▶│     API Gateway     │───▶│    Load Balancer     │

#### Autenticação e Autorização



- Senhas hasheadas com bcryptjs (salt rounds: 10)

- JWT tokens com expiração configurável### Passo 2: Configurar o Backend│   (Banco A)     │    │ (Spring Cloud GW)   │    │                      │

- Refresh token strategy

- Proteção contra força bruta (10 tentativas / 30 min)



#### Validação de Entrada```powershell└─────────────────┘    └─────────────────────┘    └──────────────────────┘A plataforma Sentinela PIX aborda este desafio através de três pilares centrais:15. [Licença](#licença)



- Sanitização de dados para prevenir XSScd backend

- Validação de CPF, email, telefone e chaves PIX

- Whitelist de tipos de arquivo para uploadnpm install                                                          │

- Limitação de tamanho de payload

```

#### Proteção contra Ataques

                               ┌─────────────────┼─────────────────┐

- Rate limiting com express-rate-limit

- CORS configurado adequadamenteCrie um arquivo `.env` no diretório `backend/`:

- Helmet.js para headers de segurança

- Prevenção de SQL Injection (prepared statements)                               │                 │                 │

- Proteção contra CSRF

```env

#### Logging e Auditoria

PORT=3001                               ▼                 ▼                 ▼- **Sistema de Notificação Rápida**: Cria um canal de comunicação de baixa latência (via WebSockets e Webhooks) para que instituições vítimas comuniquem instituições receptoras sobre transações fraudulentas em segundos.11. [Deploy em Produção](#deploy-em-produção)

- Winston logger com rotação diária

- Logs de segurança (90 dias de retenção)JWT_SECRET=sua_chave_secreta_jwt_com_pelo_menos_32_caracteres

- Logs de auditoria (30 dias de retenção)

- Logging de todas as ações críticasDATABASE_PATH=./database.sqlite                        ┌───────────────────┐ ┌─────────────────┐ ┌─────────────────┐



#### CriptografiaNODE_ENV=development



- HTTPS obrigatório em produçãoCORS_ORIGIN=http://localhost:8080                        │ fraud-report-     │ │ risk-analysis-  │ │ notification-   │- **Pontuação de Risco (Risk Scoring)**: Analisa e sinaliza chaves PIX e contas que recebem múltiplas denúncias de fraude, criando um score de risco dinâmico que pode ser consultado por qualquer instituição participante.

- Tokens e senhas nunca expostos em logs

- Dados sensíveis criptografados no banco```



---                        │ service           │ │ service         │ │ service         │



## Monitoramento### Passo 3: Configurar o Firebase



### Prometheus Metrics                        │ (Java/Spring)     │ │ (Java/Spring)   │ │ (Java/Spring)   │- **Mecanismo de Prevenção**: Auxilia na prevenção de transações futuras para contas fraudulentas, permitindo que bancos consultem o risco de uma chave PIX antes de efetivar uma transação.## Visão Geral



O sistema expõe métricas em `/metrics` para coleta pelo Prometheus:1. Acesse o [Console do Firebase](https://console.firebase.google.com/)



**Métricas de HTTP:**2. Crie um novo projeto ou use um existente                        │ • Recebe denúncias│ │ • Score de risco│ │ • Notifica bancos│

- `http_requests_total` - Total de requisições por método e rota

- `http_request_duration_seconds` - Latência de requisições (histograma)3. Ative Authentication, Firestore e Cloud Messaging

- `http_errors_total` - Total de erros por código de status

4. Obtenha as credenciais do projeto                        │ • Valida dados    │ │ • Consulta keys │ │ • Webhooks/API  │

**Métricas de Negócio:**

- `fraud_reports_created_total` - Denúncias criadas

- `fraud_reports_by_status` - Denúncias por status

- `risk_analyses_performed_total` - Análises de risco executadasEdite `frontend/firebase-config.js` com suas credenciais.                        │ • Persiste no BD  │ │ • Pub/Sub       │ │ • Pub/Sub       │

- `pix_keys_by_risk_level` - Chaves PIX por nível de risco



**Métricas de Sistema:**

- `websocket_connections` - Conexões WebSocket ativas### Passo 4: Executar a Aplicação                        │ • Publica eventos │ │                 │ │                 │## Arquitetura da Solução12. [Segurança](#segurança)

- `database_queries_total` - Total de queries no banco

- `database_query_duration_seconds` - Duração de queries

- `rate_limit_blocks_total` - Bloqueios por rate limiting

- `nodejs_memory_usage_bytes` - Uso de memória**Terminal 1 - Backend:**                        └────────┬──────────┘ └────────┬────────┘ └────────┬────────┘

- `nodejs_cpu_usage_percent` - Uso de CPU

```powershell

### Grafana Dashboards

cd backend                                 │                   │                   │

Dashboard pré-configurado disponível em `monitoring/grafana/dashboards/`:

node server.js

- Taxa de requisições e latência

- Taxa de erros com alertas```                                 └─────────┬─────────┴───────────────────┘

- Métricas de negócio (denúncias, análises)

- Uso de recursos (CPU, memória)

- Conexões WebSocket

- Performance do banco de dados**Terminal 2 - Frontend:**                                           │O projeto contempla duas arquiteturas: uma implementação de referência funcional (monolítica, em Node.js) para fins de demonstração e validação, e uma arquitetura alvo (microservices, em Java) projetada para produção, escalabilidade e resiliência.O Sentinela PIX é uma plataforma de software como serviço (SaaS) projetada para atuar como uma câmara de compensação centralizada para denúncias de fraude no PIX. O sistema visa conectar instituições financeiras, permitindo que um banco (vítima) notifique instantaneamente outro banco (receptor) sobre uma transação fraudulenta, possibilitando o bloqueio preventivo de fundos antes que sejam dissipados.



**Acesso ao Grafana:**```powershell

- URL: http://localhost:3000

- Usuário: admincd frontend                                           ▼

- Senha: admin

python -m http.server 8080

---

```                                 ┌─────────────────┐

## Testes



### Testes End-to-End (E2E)

### Passo 5: Acessar a Aplicação                                 │    RabbitMQ     │

Implementados com Playwright, cobrindo fluxos críticos:



**Testes de Autenticação:**

- Registro de novo usuárioAbra seu navegador em: **http://localhost:8080**                                 │  (Mensageria)   │### Implementação de Referência (Node.js)13. [Monitoramento](#monitoramento)The primary vulnerability in PIX fraud is time. Money transfers occur almost instantaneously, making blocking and recovery extremely difficult. The current banking system lacks a centralized mechanism for rapid fraud communication between different institutions.The primary vulnerability in PIX fraud is time. Money transfers occur almost instantaneously, making blocking and recovery extremely difficult. The current banking system lacks a centralized mechanism for rapid fraud communication between different institutions.

- Login com credenciais válidas

- Validação de erros (email inválido, senha fraca)

- Logout

---                                 │ • NovaDenuncia  │

**Testes de Dashboard:**

- Carregamento de estatísticas

- Navegação entre páginas

- Filtros e busca## 📚 Documentação da API                                 │ • Async Events  │

- Gráficos interativos



**Testes de Denúncias:**

- Criação de denúncia completa### Autenticação                                 └─────────────────┘

- Upload de evidências

- Visualização de detalhes

- Atualização de status

#### Registrar Usuário                                           │Esta é a versão atualmente funcional no repositório, ideal para execução local e demonstração. Utiliza uma stack simplificada com um backend monolítico e um banco de dados SQLite.## O Problema

**Testes de Análise de Risco:**

- Consulta de chave PIX```http

- Verificação de score

- Histórico de análisesPOST /api/v1/auth/register                                           ▼



**Executar testes:**Content-Type: application/json



```bash                                 ┌─────────────────┐

cd tests

npm install{

npx playwright test

npx playwright test --ui        # Modo interativo  "email": "usuario@exemplo.com",                                 │   PostgreSQL    │

npx playwright test --headed    # Com browser visível

```  "password": "senhaSegura123",



### Cobertura de Testes  "full_name": "João da Silva",                                 │   (Database)    │```14. [Estrutura do Projeto](#estrutura-do-projeto)



- Autenticação: 95%  "cpf": "12345678901",

- Denúncias: 90%

- Análise de Risco: 85%  "phone": "+5511999999999",                                 │ • Denúncias     │

- Dashboard: 80%

  "bank": "Bradesco"

---

}                                 │ • Scores PIX    │┌─────────────────────────────────────────────────────────────┐

## Estrutura do Projeto

```

```

sentinela-pix/                                 └─────────────────┘

├── backend/

│   ├── server.js              # Servidor principal Express#### Login

│   ├── package.json           # Dependências do backend

│   ├── middleware/```http```│                       Aplicações Cliente                    │A principal vulnerabilidade nas fraudes PIX é o tempo. As transferências de dinheiro ocorrem quase instantaneamente, tornando o bloqueio e a recuperação de valores extremamente difíceis. O ecossistema bancário atual carece de um mecanismo centralizado e padronizado para a comunicação ultrarrápida de fraudes entre diferentes instituições, resultando em perdas financeiras significativas para clientes e bancos.

│   │   ├── rateLimiter.js     # Rate limiting e proteção

│   │   └── validation.js      # Validação de entradaPOST /api/v1/auth/login

│   ├── services/

│   │   └── emailService.js    # Serviço de emailsContent-Type: application/json

│   └── utils/

│       ├── logger.js          # Sistema de logging

│       └── metrics.js         # Métricas Prometheus

├── frontend/{## Stack Tecnológica│      (Dashboard Web, Apps Mobile, Interfaces Bancárias)     │

│   ├── index.html             # Página inicial

│   ├── login.html             # Página de login  "email": "usuario@exemplo.com",

│   ├── cadastro.html          # Página de registro

│   ├── dashboard.html         # Dashboard principal  "password": "senhaSegura123"

│   ├── dashboard.js           # Lógica do dashboard

│   ├── styles.css             # Estilos globais}

│   ├── firebase-config.js     # Configuração Firebase

│   ├── service-worker.js      # Service Worker PWA```### Implementação de Referência (Node.js)└────────────────────────┬────────────────────────────────────┘15. [Contribuição](#contribuição)

│   ├── manifest.json          # Manifest PWA

│   └── user-system.js         # Sistema de autenticação

├── docs/

│   ├── openapi.yaml           # Especificação OpenAPI### Relatórios de Fraude

│   ├── swagger.html           # Interface Swagger UI

│   ├── API-DOCUMENTATION.md   # Documentação da API

│   └── DEPLOYMENT-GUIDE.md    # Guia de deployment

├── monitoring/#### Criar Denúncia- **Backend**: Node.js v18+, Express.js                         │ HTTPS / WSS

│   ├── prometheus.yml         # Config Prometheus

│   └── grafana/```http

│       ├── dashboards/        # Dashboards Grafana

│       └── datasources/       # Datasources GrafanaPOST /api/v1/reports- **Banco de Dados**: SQLite3

├── tests/

│   └── e2e/                   # Testes PlaywrightAuthorization: Bearer {token}

├── microservices/             # Arquitetura futura

│   ├── api-gateway/```- **Autenticação**: JSON Web Tokens (JWT), bcryptjs┌────────────────────────▼────────────────────────────────────┐## A Solução Proposta

│   ├── fraud-report-service/

│   ├── notification-service/

│   └── risk-analysis-service/

├── docker-compose.yml         # Compose para desenvolvimento#### Listar Denúncias- **Comunicação Real-time**: WebSockets (biblioteca `ws`)

├── docker-compose.prod.yml    # Compose para produção

├── Dockerfile                 # Container do backend```http

├── nginx.conf                 # Configuração Nginx

└── README.md                  # Este arquivoGET /api/v1/reports?status=pending&limit=20&offset=0- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Tailwind CSS│                       Camada Frontend                       │

```

Authorization: Bearer {token}

---

```- **Integração**: Firebase (Authentication, Firestore, Cloud Messaging)

## Roadmap



### Fase 1: MVP (Concluído)

### Análise de Risco│      - Interface do Usuário (HTML/CSS/JavaScript)           │16. [Licença](#licença)

- [x] Sistema de autenticação completo

- [x] CRUD de denúncias de fraude

- [x] Análise de risco básica

- [x] Dashboard com estatísticas#### Consultar Risco### Arquitetura Alvo (Java/Spring)

- [x] Notificações em tempo real

- [x] API REST documentada```http



### Fase 2: Produção (Concluído)GET /api/v1/keys/{chavePix}/risk│      - Autenticação Firebase                                │



- [x] Segurança avançada (rate limiting, validação)Authorization: Bearer {token}

- [x] Sistema de logging robusto

- [x] Monitoramento com Prometheus/Grafana```- **Linguagem**: Java 17+

- [x] Testes E2E com Playwright

- [x] CI/CD com GitHub Actions

- [x] Containerização com Docker

- [x] PWA com offline support---- **Framework**: Spring Boot 3.x, Spring Cloud Gateway, Spring Data JPA, Spring Security│      - Cliente WebSocket                                    │A plataforma Sentinela PIX aborda este desafio através de três pilares centrais:



### Fase 3: Escalabilidade (Em Desenvolvimento)



- [ ] Migração para microservices (Java/Spring Boot)## 🔐 Segurança- **Banco de Dados**: PostgreSQL

- [ ] Message queue com RabbitMQ

- [ ] Cache distribuído com Redis

- [ ] Database replication

- [ ] Kubernetes deployment### Medidas Implementadas- **Mensageria**: RabbitMQ (ou Azure Service Bus)│      - Service Worker FCM                                   │

- [ ] Machine Learning para detecção avançada



### Fase 4: Inteligência Artificial (Futuro)

- ✅ **Autenticação Dupla**: Firebase + JWT- **Infraestrutura**: Docker, Kubernetes (Azure AKS)

- [ ] Modelos de ML para previsão de fraudes

- [ ] Análise de padrões comportamentais- ✅ **Hash de Senhas**: bcryptjs com 10 rounds

- [ ] Detecção de anomalias em tempo real

- [ ] Sistema de recomendação inteligente- ✅ **Tokens Expiráveis**: Renovação automática de sessão- **Cloud**: Microsoft Azure (ACR, AKS, Azure Monitor)└────────────────────────┬────────────────────────────────────┘## Solution Architecture## Solution Architecture

- [ ] NLP para análise de descrições de fraude

- [ ] Computer Vision para análise de evidências- ✅ **Validação de Entrada**: Sanitização contra XSS e injeção



### Fase 5: Integração Bancária (Futuro)- ✅ **HTTPS Obrigatório**: Em produção- **Testes**: JUnit 5, Mockito



- [ ] API de integração para bancos- ✅ **WebSocket Seguro**: WSS em produção

- [ ] Webhooks para notificações externas

- [ ] SDK para facilitar integração- ✅ **CORS Configurado**: Proteção contra requisições não autorizadas                         │ API REST / WebSocket

- [ ] Painel administrativo para bancos

- [ ] SLA e acordos de nível de serviço- ✅ **Rate Limiting**: Prevenção de ataques de força bruta

- [ ] Conformidade com LGPD e regulações bancárias

## Funcionalidades Principais

---

---

## Contribuição

┌────────────────────────▼────────────────────────────────────┐- **Sistema de Notificação Rápida**: Cria um canal de comunicação de baixa latência (via WebSockets e Webhooks) para que instituições vítimas comuniquem instituições receptoras sobre transações fraudulentas em segundos.

Contribuições são bem-vindas! Este é um projeto acadêmico desenvolvido como parte do curso de Sistemas de Informação.

## 📁 Estrutura do Projeto

### Como Contribuir

- **Gerenciamento de Usuários**: Autenticação segura (Firebase/JWT), gerenciamento de perfil, configurações de conta, e suporte a múltiplos bancos.

1. Fork o projeto

2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)```

3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)

4. Push para a branch (`git push origin feature/AmazingFeature`)sentinela-pix/- **Sistema de Relatórios de Fraude**: Submissão detalhada de denúncias (chave PIX, valor, ID da transação, bancos envolvidos), validação de dados e gerenciamento de status (pendente, confirmado, falso positivo).│                       Serviços Backend (Node.js)            │

5. Abra um Pull Request

├── README.md                    # Documentação principal

### Diretrizes

├── backend/                     # Backend Node.js- **Motor de Análise de Risco**: Algoritmo de pontuação que incrementa o risco de uma chave PIX baseado no número e frequência de denúncias, classificando-as como "suspeita", "alto risco" ou "risco crítico".

- Siga os padrões de código existentes

- Adicione testes para novas funcionalidades│   ├── server.js                # Aplicação principal

- Atualize a documentação conforme necessário

- Mantenha os commits atômicos e bem descritos│   ├── package.json             # Dependências- **API de Consulta de Risco**: Endpoint (GET /api/v1/keys/{chavePix}/risk) que permite a qualquer instituição verificar o score de risco de uma chave antes de processar um pagamento.│      - API REST Express.js (Porta 3001)                     │- **Pontuação de Risco (Risk Scoring)**: Analisa e sinaliza chaves PIX e contas que recebem múltiplas denúncias de fraude, criando um score de risco dinâmico que pode ser consultado por qualquer instituição participante.## Visão Geral

- Certifique-se de que todos os testes passam

│   └── database.sqlite          # Banco de dados

---

│- **Notificações em Tempo Real**:

## Licença

├── frontend/                    # Interface Web

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

│   ├── index.html               # Página inicial  - **WebSocket**: Comunicação persistente com o dashboard web para atualizações instantâneas.│      - Servidor WebSocket (ws://localhost:3001/ws)          │

---

│   ├── login.html               # Autenticação

## Equipe de Desenvolvimento

│   ├── cadastro.html            # Registro  - **Push Notifications**: Integração com Firebase Cloud Messaging (FCM) para alertas nativos no navegador, mesmo com a aplicação em segundo plano.

**ZENIT Team** - Projeto Acadêmico A3 2024/2025

│   ├── dashboard.html           # Dashboard principal

- Desenvolvimento: Matheus Gino

- Repositório: [github.com/MatheusGino71/A3-sistemas](https://github.com/MatheusGino71/A3-sistemas)│   ├── profile.html             # Perfil do usuário  - **Webhooks**: (Arquitetura Alvo) Notificação automática para sistemas de backend de outras instituições financeiras.│      - Autenticação e Autorização (JWT)                     │- **Mecanismo de Prevenção**: Auxilia na prevenção de transações futuras para contas fraudulentas, permitindo que bancos consultem o risco de uma chave PIX antes de efetivar uma transação.



---│   ├── settings.html            # Configurações



## Contato│   ├── dashboard.js             # Lógica do dashboard- **Dashboard e Análise**: Interface web responsiva com KPIs (Key Performance Indicators), gráficos de tendências de fraude, e listas de denúncias com filtros avançados.



Para questões técnicas, sugestões ou parcerias:│   ├── user-system.js           # Sistema de usuário



- GitHub: [@MatheusGino71](https://github.com/MatheusGino71)│   ├── styles.css               # Estilos│      - Lógica de Negócio e Validação                        │

- Email: Através do GitHub Issues

│   ├── star.svg                 # Logo ZENIT

---

│   └── cid.mp4                  # Vídeo de fundo## Fluxo Operacional

## Agradecimentos

│

- Banco Central do Brasil pela infraestrutura PIX

- Comunidade Node.js e JavaScript└── docs/                        # Documentação adicional└────────────────────────┬────────────────────────────────────┘

- Firebase pela plataforma de hosting

- Todos os contribuidores e testadores    ├── API-DOCUMENTATION.md     # API completa



---    └── DEPLOYMENT-GUIDE.md      # Guia de deployO diagrama abaixo ilustra o fluxo completo de uma denúncia de fraude, desde a vítima até a ação no banco do fraudador, utilizando a arquitetura alvo de microservices.



**Desenvolvido com dedicação para combater fraudes e proteger usuários do sistema PIX.**```


                         │

---

```

## 🗺️ Roadmap

Vítima → Banco A (Vítima) → API Gateway → fraud-report-service        ┌────────────────┼────────────────┐## Arquitetura da Solução

### ✅ Fase 1: MVP (Concluída)

- [x] Sistema de autenticação                                              ↓

- [x] CRUD de denúncias

- [x] Dashboard básico                                     Valida e Salva no BD        │                │                │

- [x] Notificações WebSocket

- [x] Análise de risco simples                                              ↓

- [x] Identidade visual Bradesco

                                     Publica evento no RabbitMQ        ▼                ▼                ▼O Sentinela PIX é uma plataforma abrangente de detecção e prevenção de fraudes em tempo real, projetada para combater golpes no sistema de pagamentos PIX brasileiro. A plataforma fornece relatórios centralizados de fraudes, análise de risco e sistemas automatizados de notificação para facilitar a resposta rápida entre instituições financeiras.

### 🚧 Fase 2: Escalabilidade (Planejado)

- [ ] Migração para microservices                                              ↓

- [ ] Implementação de RabbitMQ

- [ ] Migração para PostgreSQL                        ┌─────────────────────┴──────────────────┐┌────────────────┐ ┌─────────────┐ ┌──────────────┐

- [ ] API Gateway com Spring Cloud

- [ ] Containerização com Docker                        ↓                                        ↓



### 📅 Fase 3: Inteligência Artificial (Futuro)              risk-analysis-service                   notification-service│ Banco SQLite   │ │  Firebase   │ │Sistema Arquivos│O projeto contempla duas arquiteturas: uma implementação de referência funcional (monolítica, em Node.js) para fins de demonstração e validação, e uma arquitetura alvo (microservices, em Java) projetada para produção, escalabilidade e resiliência.

- [ ] Modelo de Machine Learning

- [ ] Análise preditiva de comportamento                        ↓                                        ↓

- [ ] Detecção de padrões complexos

- [ ] Auto-aprendizado com feedback              Calcula/Atualiza Score                  Identifica Banco B│ - Usuários     │ │  - Firestore│ │ - Uploads    │



---                        ↓                                        ↓



## 🤝 Contribuição                Salva novo score                      Envia Webhook para Banco B│ - Denúncias    │ │  - Auth     │ │ - Logs       │The Sentinela PIX platform addresses this challenge through:The Sentinela PIX platform addresses this challenge through:



Este é um projeto acadêmico e contribuições são bem-vindas!                                                                 ↓



### Como Contribuir                                                      Banco B recebe notificação│ - Notificações │ │  - FCM      │ │ - Cache      │



1. Faça um **fork** do repositório                                                                 ↓

2. Crie uma **branch** para sua feature (`git checkout -b feature/nova-funcionalidade`)

3. **Commit** suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)                                                      Dispara bloqueio preventivo│ - Tokens FCM   │ │             │ │              │### Implementação de Referência (Node.js)

4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)

5. Abra um **Pull Request** com descrição detalhada```



---└────────────────┘ └─────────────┘ └──────────────┘



## 📄 Licença## Documentação Técnica



Este projeto foi desenvolvido para fins **acadêmicos** como parte do curso A3 de Sistemas Distribuídos.```### Características Principais



Todos os direitos reservados à equipe de desenvolvimento.### Estrutura do Banco de Dados (SQLite)



---



<div align="center">Este esquema refere-se à implementação de referência (Node.js). A arquitetura alvo utilizará PostgreSQL, mas manterá uma estrutura de dados similar.



### 💙 Desenvolvido com dedicação para combater fraudes no sistema PIX brasileiro### Arquitetura Alvo (Microservices Java/Spring Boot)Esta é a versão atualmente funcional no repositório, ideal para execução local e demonstração. Utiliza uma stack simplificada com um backend monolítico e um banco de dados SQLite.



**ZENIT** © 2024 - Sistema Anti-Fraude PIX**Tabela: `users`**



[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-CC092F?style=for-the-badge)]()

[![Bradesco Identity](https://img.shields.io/badge/Bradesco-Identity-CC092F?style=for-the-badge)]()

```sql

**Última Atualização**: Outubro de 2024

CREATE TABLE users (Esta é a arquitetura planejada para um ambiente de produção robusto. Ela desacopla responsabilidades em serviços independentes, utiliza um broker de mensagens para comunicação assíncrona e um banco de dados relacional mais robusto.

</div>

    id TEXT PRIMARY KEY,

    email TEXT UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    full_name TEXT,``````

    cpf TEXT,

    phone TEXT,┌─────────────────┐    ┌─────────────────────┐    ┌──────────────────────┐

    bank TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,│   App Bancário  │───▶│     API Gateway     │───▶│    Load Balancer     │┌─────────────────────────────────────────────────────────────┐- Sistema de notificação em tempo real via WebSocket

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    last_login DATETIME,│   (Banco A)     │    │ (Spring Cloud GW)   │    │                      │

    is_active BOOLEAN DEFAULT 1,

    two_factor_enabled BOOLEAN DEFAULT 0└─────────────────┘    └─────────────────────┘    └──────────────────────┘│                       Aplicações Cliente                    │

);

```                                                          │



**Tabela: `fraud_reports`**                               ┌─────────────────┼─────────────────┐│      (Dashboard Web, Apps Mobile, Interfaces Bancárias)     │- Análise de risco automatizada com pontuação dinâmica- **Rapid Notification System**: Creates an ultra-fast channel for victim institutions to communicate with fraud recipient institutions- **Rapid Notification System**: Creates an ultra-fast channel for victim institutions to communicate with fraud recipient institutions



```sql                               │                 │                 │

CREATE TABLE fraud_reports (

    id TEXT PRIMARY KEY,                               ▼                 ▼                 ▼└────────────────────────┬────────────────────────────────────┘

    user_id TEXT NOT NULL,

    pix_key TEXT NOT NULL,                        ┌───────────────────┐ ┌─────────────────┐ ┌─────────────────┐

    pix_key_type TEXT NOT NULL,

    amount REAL NOT NULL,                        │ fraud-report-     │ │ risk-analysis-  │ │ notification-   │                         │ HTTPS / WSS- Integração com Firebase Cloud Messaging para notificações push

    transaction_id TEXT,

    victim_bank TEXT NOT NULL,                        │ service           │ │ service         │ │ service         │

    fraudster_bank TEXT,

    description TEXT,                        │ (Java/Spring)     │ │ (Java/Spring)   │ │ (Java/Spring)   │┌────────────────────────▼────────────────────────────────────┐

    status TEXT DEFAULT 'pending',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,                        │ • Recebe denúncias│ │ • Score de risco│ │ • Notifica bancos│

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE                        │ • Valida dados    │ │ • Consulta keys │ │ • Webhooks/API  ││                       Camada Frontend                       │- Interface web responsiva e intuitiva- **Risk Scoring**: Analyzes and flags PIX keys and accounts that receive multiple fraud reports- **Risk Scoring**: Analyzes and flags PIX keys and accounts that receive multiple fraud reports

);

```                        │ • Persiste no BD  │ │ • Pub/Sub       │ │ • Pub/Sub       │



**Tabela: `notifications`**                        │ • Publica eventos │ │                 │ │                 ││      - Interface do Usuário (HTML/CSS/JavaScript)           │



```sql                        └────────┬──────────┘ └────────┬────────┘ └────────┬────────┘

CREATE TABLE notifications (

    id TEXT PRIMARY KEY,                                 │                   │                   ││      - Autenticação Firebase                                │- API RESTful completa e documentada

    user_id TEXT NOT NULL,

    fraud_report_id TEXT,                                 └─────────┬─────────┴───────────────────┘

    type TEXT NOT NULL,

    title TEXT NOT NULL,                                           ││      - Cliente WebSocket                                    │

    message TEXT NOT NULL,

    read_at DATETIME,                                           ▼

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,                                 ┌─────────────────┐│      - Service Worker FCM                                   │- Autenticação segura com JWT e Firebase- **Prevention Mechanism**: Helps prevent future transactions to fraudulent accounts through real-time alerts- **Prevention Mechanism**: Helps prevent future transactions to fraudulent accounts through real-time alerts

    FOREIGN KEY (fraud_report_id) REFERENCES fraud_reports(id) ON DELETE SET NULL

);                                 │    RabbitMQ     │

```

                                 │  (Mensageria)   │└────────────────────────┬────────────────────────────────────┘

**Tabela: `user_fcm_tokens`**

                                 │ • NovaDenuncia  │

```sql

CREATE TABLE user_fcm_tokens (                                 │ • Async Events  │                         │ API REST / WebSocket- Suporte a múltiplos dispositivos e sessões

    user_id TEXT PRIMARY KEY,

    fcm_token TEXT NOT NULL,                                 └─────────────────┘

    device_info TEXT,

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,                                           │┌────────────────────────▼────────────────────────────────────┐

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

);                                           ▼

```

                                 ┌─────────────────┐│                       Serviços Backend (Node.js)            │

### Documentação da API

                                 │   PostgreSQL    │

Para documentação completa da API REST, consulte: [docs/API-DOCUMENTATION.md](docs/API-DOCUMENTATION.md)

                                 │   (Database)    ││      - API REST Express.js (Porta 3001)                     │

#### Endpoints Principais

                                 │ • Denúncias     │

**Autenticação**

                                 │ • Scores PIX    ││      - Servidor WebSocket (ws://localhost:3001/ws)          │## Problema e Solução

- `POST /api/v1/auth/register` - Registrar novo usuário

- `POST /api/v1/auth/login` - Login de usuário                                 └─────────────────┘



**Relatórios de Fraude**```│      - Autenticação e Autorização (JWT)                     │



- `POST /api/v1/reports` - Criar relatório de fraude (requer token)

- `GET /api/v1/reports` - Listar relatórios (requer token)

## Stack Tecnológica│      - Lógica de Negócio e Validação                        │## Technical Stack## 🚀 Demonstração

**Análise de Risco**



- `GET /api/v1/keys/{chavePix}/risk` - Consultar risco de chave PIX (requer token)

### Implementação de Referência (Node.js)└────────────────────────┬────────────────────────────────────┘

**Notificações**



- `POST /api/v1/users/fcm-token` - Registrar token FCM (requer token)

- **Backend**: Node.js v18+, Express.js                         │### O Problema

**Saúde do Sistema**

- **Banco de Dados**: SQLite3

- `GET /health` - Health check

- **Autenticação**: JSON Web Tokens (JWT), bcryptjs        ┌────────────────┼────────────────┐

## Instalação e Execução Local

- **Comunicação Real-time**: WebSockets (biblioteca `ws`)

Estas instruções são para a **Implementação de Referência (Node.js)**.

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Tailwind CSS        │                │                │

### Pré-requisitos

- **Integração**: Firebase (Authentication, Firestore, Cloud Messaging)

- Node.js v18.0.0 ou superior

- npm v8.0.0 ou superior        ▼                ▼                ▼

- Python v3.8+ (para servir o frontend estático)

- Git### Arquitetura Alvo (Java/Spring)

- Conta Firebase (para Authentication, Firestore e Cloud Messaging)

┌────────────────┐ ┌─────────────┐ ┌──────────────┐A principal vulnerabilidade nas fraudes PIX é o tempo. As transferências de dinheiro ocorrem quase instantaneamente, tornando o bloqueio e a recuperação extremamente difíceis. O sistema bancário atual carece de um mecanismo centralizado para comunicação rápida de fraudes entre diferentes instituições.

### Passo 1: Clonar o Repositório

- **Linguagem**: Java 17+

```powershell

git clone https://github.com/MatheusGino71/A3-sistemas.git- **Framework**: Spring Boot 3.x, Spring Cloud Gateway, Spring Data JPA, Spring Security│ Banco SQLite   │ │  Firebase   │ │Sistema Arquivos│

cd A3-sistemas/sentinela-pix

```- **Banco de Dados**: PostgreSQL



### Passo 2: Configurar o Backend (Node.js)- **Mensageria**: RabbitMQ (ou Azure Service Bus)│ - Usuários     │ │  - Firestore│ │ - Uploads    │### Backend TechnologiesO projeto está totalmente funcional e pode ser executado localmente:



1. Navegue até o diretório do backend e instale as dependências:- **Infraestrutura**: Docker, Kubernetes (Azure AKS)



```powershell- **Cloud**: Microsoft Azure (ACR, AKS, Azure Monitor)│ - Denúncias    │ │  - Auth     │ │ - Logs       │

cd backend

npm install- **Testes**: JUnit 5, Mockito

```

│ - Notificações │ │  - FCM      │ │ - Cache      │### A Solução

2. Crie um arquivo `.env` na raiz do diretório `backend/` com o seguinte conteúdo:

## Funcionalidades Principais

```env

PORT=3001│ - Tokens FCM   │ │             │ │              │

JWT_SECRET=sua_chave_secreta_jwt_com_pelo_menos_32_caracteres

DATABASE_PATH=./database.sqlite- **Gerenciamento de Usuários**: Autenticação segura (Firebase/JWT), gerenciamento de perfil, configurações de conta, e suporte a múltiplos bancos.

NODE_ENV=development

CORS_ORIGIN=http://localhost:8080- **Sistema de Relatórios de Fraude**: Submissão detalhada de denúncias (chave PIX, valor, ID da transação, bancos envolvidos), validação de dados e gerenciamento de status (pendente, confirmado, falso positivo).└────────────────┘ └─────────────┘ └──────────────┘- **Node.js v18+**: JavaScript runtime for backend services

```

- **Motor de Análise de Risco**: Algoritmo de pontuação que incrementa o risco de uma chave PIX baseado no número e frequência de denúncias, classificando-as como "suspeita", "alto risco" ou "risco crítico".

### Passo 3: Configurar o Frontend

- **API de Consulta de Risco**: Endpoint (GET /api/v1/keys/{chavePix}/risk) que permite a qualquer instituição verificar o score de risco de uma chave antes de processar um pagamento.```

1. Obtenha suas credenciais de projeto no Console do Firebase.

- **Notificações em Tempo Real**:

2. Edite o arquivo `frontend/firebase-config.js` e insira suas credenciais:

  - **WebSocket**: Comunicação persistente com o dashboard web para atualizações instantâneas.A plataforma Sentinela PIX aborda este desafio através de:

```javascript

const firebaseConfig = {  - **Push Notifications**: Integração com Firebase Cloud Messaging (FCM) para alertas nativos no navegador, mesmo com a aplicação em segundo plano.

  apiKey: "sua_api_key",

  authDomain: "seu-projeto.firebaseapp.com",  - **Webhooks**: (Arquitetura Alvo) Notificação automática para sistemas de backend de outras instituições financeiras.### Arquitetura Alvo (Microservices Java/Spring Boot)

  projectId: "seu-projeto-id",

  storageBucket: "seu-projeto.appspot.com",- **Dashboard e Análise**: Interface web responsiva com KPIs (Key Performance Indicators), gráficos de tendências de fraude, e listas de denúncias com filtros avançados.

  messagingSenderId: "seu_sender_id",

  appId: "seu_app_id"- **Express.js 4.18**: Web application framework- **🖥️ Dashboard Web**: http://localhost:8080

};

```## Fluxo Operacional



3. No Console do Firebase, vá para "Configurações do Projeto" > "Cloud Messaging" e gere um "Certificado Web Push".Esta é a arquitetura planejada para um ambiente de produção robusto. Ela desacopla responsabilidades em serviços independentes, utiliza um broker de mensagens para comunicação assíncrona e um banco de dados relacional mais robusto.



4. Copie a "Chave pública VAPID" e insira no arquivo `frontend/user-system.js`:O diagrama abaixo ilustra o fluxo completo de uma denúncia de fraude, desde a vítima até a ação no banco do fraudador, utilizando a arquitetura alvo de microservices.



```javascript- **Sistema de Notificação Rápida**: Cria um canal ultrarrápido para que instituições vítimas comuniquem instituições receptoras de fraude

this.fcmToken = await getToken(messaging, {

  vapidKey: 'SUA_CHAVE_PUBLICA_VAPID_AQUI'```

});

```Vítima → Banco A (Vítima) → API Gateway → fraud-report-service```



### Passo 4: Executar o Backend                                              ↓



Em um terminal, inicie o servidor backend:                                     Valida e Salva no BD┌─────────────────┐    ┌─────────────────────┐    ┌──────────────────────┐- **Pontuação de Risco**: Analisa e sinaliza chaves PIX e contas que recebem múltiplas denúncias de fraude- **SQLite3**: Embedded database for data persistence- **🔧 API Backend**: http://localhost:3001/api/v1



```powershell                                              ↓

cd backend

node server.js                                     Publica evento no RabbitMQ│   App Bancário  │───▶│     API Gateway     │───▶│    Load Balancer     │

```

                                              ↓

Saída esperada: "Sentinela PIX Backend running on port 3001"

                        ┌─────────────────────┴──────────────────┐│   (Banco A)     │    │ (Spring Cloud GW)   │    │                      │- **Mecanismo de Prevenção**: Ajuda a prevenir transações futuras para contas fraudulentas através de alertas em tempo real

### Passo 5: Executar o Frontend

                        ↓                                        ↓

Em um segundo terminal, inicie o servidor estático Python para o frontend:

              risk-analysis-service                   notification-service└─────────────────┘    └─────────────────────┘    └──────────────────────┘

```powershell

cd frontend                        ↓                                        ↓

python -m http.server 8080

```              Calcula/Atualiza Score                  Identifica Banco B                                                          │- **bcryptjs**: Password hashing and authentication- **❤️ Health Check**: http://localhost:3001/health



Saída esperada: "Serving HTTP on 0.0.0.0 port 8080"                        ↓                                        ↓



### Passo 6: Acessar a Aplicação                Salva novo score                      Envia Webhook para Banco B                               ┌─────────────────┼─────────────────┐



Abra seu navegador e acesse: `http://localhost:8080`                                                                 ↓



## Testes                                                      Banco B recebe notificação                               │                 │                 │## Arquitetura do Sistema



Os testes para a implementação de referência são focados na verificação manual e na consulta direta ao banco de dados.                                                                 ↓



### Procedimentos de Teste Manual                                                      Dispara bloqueio preventivo                               ▼                 ▼                 ▼



1. **Registro e Autenticação**: Crie uma conta, faça logout e login.```

2. **Conexão WebSocket**: Faça login, abra as ferramentas de desenvolvedor (F12) e verifique no console as mensagens de conexão WebSocket.

3. **Permissão de Notificação**: O dashboard solicitará permissão para notificações. Aceite e verifique no console a obtenção do token FCM.                        ┌───────────────────┐ ┌─────────────────┐ ┌─────────────────┐- **jsonwebtoken**: JWT-based authentication system

4. **Criação de Denúncia**: Crie uma denúncia de teste através do dashboard.

5. **Recebimento de Notificação**: Crie uma notificação de teste via console do navegador.## Documentação Técnica



### Verificação do Banco de Dados                        │ fraud-report-     │ │ risk-analysis-  │ │ notification-   │



É possível inspecionar o banco de dados SQLite diretamente:### Estrutura do Banco de Dados (SQLite)



```powershell                        │ service           │ │ service         │ │ service         │### Visão Arquitetural de Alto Nível

cd backend

sqlite3 database.sqliteEste esquema refere-se à implementação de referência (Node.js). A arquitetura alvo utilizará PostgreSQL, mas manterá uma estrutura de dados similar.



# Verificar usuários                        │ (Java/Spring)     │ │ (Java/Spring)   │ │ (Java/Spring)   │

SELECT id, email, full_name FROM users;

**Tabela: `users`**

# Verificar denúncias

SELECT id, pix_key, amount, status FROM fraud_reports;                        │ • Recebe denúncias│ │ • Score de risco│ │ • Notifica bancos│- **ws (WebSocket)**: Real-time bidirectional communication library### Screenshots



# Sair```sql

.exit

```CREATE TABLE users (                        │ • Valida dados    │ │ • Consulta keys │ │ • Webhooks/API  │



## Segurança e Monitoramento    id TEXT PRIMARY KEY,



### Segurança    email TEXT UNIQUE NOT NULL,                        │ • Persiste no BD  │ │ • Pub/Sub       │ │ • Pub/Sub       │```



- **Autenticação**: Gerenciamento de sessão via tokens JWT com tempo de expiração.    password_hash TEXT NOT NULL,

- **Criptografia**: Senhas armazenadas com hash seguro (bcryptjs).

- **Validação**: Validação e sanitização de todas as entradas de API.    full_name TEXT,                        │ • Publica eventos │ │                 │ │                 │

- **Comunicação**: Uso de HTTPS e WSS (WebSocket Seguro) é obrigatório em produção.

- **Autorização**: Endpoints protegidos por middleware de autenticação.    cpf TEXT,



### Monitoramento    phone TEXT,                        └────────┬──────────┘ └────────┬────────┘ └────────┬────────┘┌─────────────────────────────────────────────────────────────┐- **node-cron**: Scheduled task management



- **Implementação de Referência**: Logs de status, erros e conexões WebSocket enviados para o console.    bank TEXT,

- **Arquitetura Alvo**: Prevê o uso de Spring Boot Actuator, Prometheus, Grafana, e stack ELK para logging distribuído.

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,                                 │                   │                   │

## Estrutura do Projeto

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

```

sentinela-pix/    last_login DATETIME,                                 └─────────┬─────────┴───────────────────┘│                   Aplicações Cliente                         │

├── README.md                    # Documentação principal

├── docker-compose.yml           # (Planejado) Orquestração de containers    is_active BOOLEAN DEFAULT 1,

│

├── backend/                     # Implementação de Referência (Node.js)    two_factor_enabled BOOLEAN DEFAULT 0                                           │

│   ├── server.js                # Aplicação principal (Express + WebSocket)

│   ├── package.json             # Dependências e scripts Node.js);

│   └── database.sqlite          # Banco de dados local

│```                                           ▼│  (Dashboard Web, Apps Mobile, Interfaces Bancárias)         │<details>

├── frontend/                    # Interface Web (Estático)

│   ├── index.html               # Página inicial

│   ├── login.html               # Página de autenticação

│   ├── cadastro.html            # Página de registro**Tabela: `fraud_reports`**                                 ┌─────────────────┐

│   ├── dashboard.html           # Dashboard principal

│   ├── profile.html             # Gerenciamento de perfil

│   ├── settings.html            # Configurações da aplicação

│   ├── dashboard.js             # Lógica do dashboard```sql                                 │    RabbitMQ     │└────────────────────────┬────────────────────────────────────┘

│   ├── user-system.js           # Lógica de usuário e notificações

│   ├── styles.css               # Estilos customizadosCREATE TABLE fraud_reports (

│   ├── firebase-config.js       # Configuração do Firebase SDK

│   └── firebase-messaging-sw.js # Service worker para FCM    id TEXT PRIMARY KEY,                                 │  (Mensageria)   │

│

├── microservices/               # (Planejado) Arquitetura Alvo (Java)    user_id TEXT NOT NULL,

│   ├── api-gateway/             # Spring Cloud Gateway

│   ├── fraud-report-service/    # Microsserviço de denúncias    pix_key TEXT NOT NULL,                                 │ • NovaDenuncia  │                         │### Frontend Technologies<summary>🖼️ Ver Capturas de Tela</summary>

│   ├── risk-analysis-service/   # Microsserviço de pontuação de risco

│   └── notification-service/    # Microsserviço de notificações    pix_key_type TEXT NOT NULL,

│

├── sentinela-pix-bradesco/      # Implementação específica Bradesco    amount REAL NOT NULL,                                 │ • Async Events  │

│   ├── query-service/           # Serviço de consulta

│   ├── report-service/          # Serviço de relatórios    transaction_id TEXT,

│   └── web-interface/           # Interface customizada

│    victim_bank TEXT NOT NULL,                                 └─────────────────┘                         │ HTTPS / WSS

├── rabbitmq/                    # Configurações do RabbitMQ

│   ├── definitions.json    fraudster_bank TEXT,

│   └── setup-rabbitmq.sh

│    description TEXT,                                           │

└── docs/                        # Documentação adicional

    ├── API-DOCUMENTATION.md     # Documentação completa da API    status TEXT DEFAULT 'pending',

    ├── DEPLOYMENT-GUIDE.md      # Guia de deployment

    └── NOTIFICATION-SYSTEM.md   # Sistema de notificações    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,                                           ▼                         │- **HTML5 / CSS3**: Modern web standards

```

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

## Roadmap (Visão Futura)

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE                                 ┌─────────────────┐

### Fase 1: Migração da Arquitetura

);

- Implementar os microsserviços em Java/Spring Boot

- Migrar o banco de dados de SQLite para PostgreSQL```                                 │   PostgreSQL    │┌────────────────────────▼────────────────────────────────────┐

- Implementar o broker de mensagens (RabbitMQ)

- Configurar API Gateway (Spring Cloud)



### Fase 2: Escalabilidade e Machine Learning**Tabela: `notifications`**                                 │   (Database)    │



- Containerizar a aplicação (Docker) e orquestrar com Kubernetes

- Implementar pipeline de CI/CD para deploy no Azure

- Substituir o algoritmo de score por modelo de Machine Learning```sql                                 │ • Denúncias     ││                   Camada Frontend                            │- **JavaScript ES6+**: Modern JavaScript with module system- Dashboard principal com KPIs em tempo real



### Fase 3: Expansão do EcossistemaCREATE TABLE notifications (



- Desenvolvimento de aplicativo mobile    id TEXT PRIMARY KEY,                                 │ • Scores PIX    │

- Criação de API pública para integração de terceiros

- Implementação de trilha de auditoria baseada em blockchain    user_id TEXT NOT NULL,



## Contribuição    fraud_report_id TEXT,                                 └─────────────────┘│  - Interface do Usuário (HTML/CSS/JavaScript)               │



Este é um projeto acadêmico e contribuições são bem-vindas. Para contribuir:    type TEXT NOT NULL,



1. Faça um *fork* do repositório    title TEXT NOT NULL,```

2. Crie uma nova *branch* (`git checkout -b feature/nova-funcionalidade`)

3. Faça *commit* de suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)    message TEXT NOT NULL,

4. Faça *push* para a *branch* (`git push origin feature/nova-funcionalidade`)

5. Abra um *Pull Request* com uma descrição detalhada    read_at DATETIME,│  - Autenticação Firebase                                     │- **Tailwind CSS 3.x**: Utility-first CSS framework- Sistema de denúncias interativo



## Licença    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,



Este projeto é desenvolvido para fins acadêmicos como parte do curso A3 de Sistemas. Todos os direitos reservados à equipe de desenvolvimento.    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,## Stack Tecnológica



---    FOREIGN KEY (fraud_report_id) REFERENCES fraud_reports(id) ON DELETE SET NULL



**Desenvolvido como solução acadêmica para combater fraudes no sistema de pagamentos PIX brasileiro.**);│  - Cliente WebSocket                                        │



**Última Atualização**: Outubro de 2024```


### Implementação de Referência (Node.js)

**Tabela: `user_fcm_tokens`**

│  - Service Worker FCM                                       │- **Material Symbols**: Google's comprehensive icon system- Análise de risco por chave PIX

```sql

CREATE TABLE user_fcm_tokens (- **Backend**: Node.js v18+, Express.js

    user_id TEXT PRIMARY KEY,

    fcm_token TEXT NOT NULL,- **Banco de Dados**: SQLite3└────────────────────────┬────────────────────────────────────┘

    device_info TEXT,

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,- **Autenticação**: JSON Web Tokens (JWT), bcryptjs

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

);- **Comunicação Real-time**: WebSockets (biblioteca `ws`)                         │- Gráficos e relatórios detalhados

```

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Tailwind CSS

### Documentação da API

- **Integração**: Firebase (Authentication, Firestore, Cloud Messaging)                         │ API REST / WebSocket

Abaixo estão os endpoints principais expostos pela API (implementação Node.js).



#### Autenticação

### Arquitetura Alvo (Java/Spring)                         │### Firebase Integration

**Registrar Novo Usuário**



`POST /api/v1/auth/register`

- **Linguagem**: Java 17+┌────────────────────────▼────────────────────────────────────┐

```json

{- **Framework**: Spring Boot 3.x, Spring Cloud Gateway, Spring Data JPA, Spring Security

  "email": "usuario@exemplo.com",

  "password": "senhaSegura123",- **Banco de Dados**: PostgreSQL│                   Serviços Backend                           │- **Firebase Authentication**: User authentication and management</details>

  "full_name": "João da Silva",

  "cpf": "12345678901",- **Mensageria**: RabbitMQ (ou Azure Service Bus)

  "phone": "+5511999999999",

  "bank": "Banco do Brasil"- **Infraestrutura**: Docker, Kubernetes (Azure AKS)│  - API REST Express.js (Porta 3001)                         │

}

```- **Cloud**: Microsoft Azure (ACR, AKS, Azure Monitor)



**Login de Usuário**- **Testes**: JUnit 5, Mockito│  - Servidor WebSocket (ws://localhost:3001/ws)              │- **Firebase Firestore**: Cloud-based NoSQL database



`POST /api/v1/auth/login`



```json## Funcionalidades Principais│  - Autenticação e Autorização                               │

{

  "email": "usuario@exemplo.com",

  "password": "senhaSegura123"

}- **Gerenciamento de Usuários**: Autenticação segura (Firebase/JWT), gerenciamento de perfil, configurações de conta, e suporte a múltiplos bancos.│  - Lógica de Negócio e Validação                           │- **Firebase Cloud Messaging (FCM)**: Push notification service---

```

- **Sistema de Relatórios de Fraude**: Submissão detalhada de denúncias (chave PIX, valor, ID da transação, bancos envolvidos), validação de dados e gerenciamento de status (pendente, confirmado, falso positivo).

#### Relatórios de Fraude

- **Motor de Análise de Risco**: Algoritmo de pontuação que incrementa o risco de uma chave PIX baseado no número e frequência de denúncias, classificando-as como "suspeita", "alto risco" ou "risco crítico".└────────────────────────┬────────────────────────────────────┘

**Criar Relatório de Fraude**

- **API de Consulta de Risco**: Endpoint (GET /api/v1/keys/{chavePix}/risk) que permite a qualquer instituição verificar o score de risco de uma chave antes de processar um pagamento.

`POST /api/v1/reports` (Requer token)

- **Notificações em Tempo Real**:                         │- **Firebase Hosting**: Static content hosting and delivery

```json

{  - **WebSocket**: Comunicação persistente com o dashboard web para atualizações instantâneas.

  "pixKey": "fraudador@email.com",

  "pixKeyType": "email",  - **Push Notifications**: Integração com Firebase Cloud Messaging (FCM) para alertas nativos no navegador, mesmo com a aplicação em segundo plano.                         │

  "amount": 5000.00,

  "transactionId": "E12345678",  - **Webhooks**: (Arquitetura Alvo) Notificação automática para sistemas de backend de outras instituições financeiras.

  "victimBank": "Banco do Brasil",

  "description": "Descrição detalhada da fraude"- **Dashboard e Análise**: Interface web responsiva com KPIs (Key Performance Indicators), gráficos de tendências de fraude, e listas de denúncias com filtros avançados.         ┌───────────────┼───────────────┐## 🎭 Atores do Sistema

}

```



**Listar Relatórios**## Fluxo Operacional         │               │               │



`GET /api/v1/reports?status=pending&limit=20&offset=0` (Requer token)



#### Análise de RiscoO diagrama abaixo ilustra o fluxo completo de uma denúncia de fraude, desde a vítima até a ação no banco do fraudador, utilizando a arquitetura alvo de microservices.         ▼               ▼               ▼### Real-Time Communication



**Consultar Risco de Chave PIX**



`GET /api/v1/keys/{chavePix}/risk` (Requer token)```┌────────────────┐ ┌─────────────┐ ┌──────────────┐



```jsonVítima → Banco A (Vítima) → API Gateway → fraud-report-service

{

  "pixKey": "fraudador@email.com",                                              ↓│ Banco SQLite   │ │  Firebase   │ │Sistema Arquivos│- **WebSocket Protocol**: Persistent bidirectional connections| Ator | Descrição | Responsabilidade |

  "riskLevel": "HIGH_RISK",

  "riskScore": 85,                                     Valida e Salva no BD

  "reportCount": 5,

  "lastReportDate": "2024-10-24T09:15:00Z",                                              ↓│                │ │  Firestore  │ │              │

  "affectedInstitutions": ["Banco A", "Banco B"]

}                                     Publica evento no RabbitMQ

```

                                              ↓│ - Usuários     │ │  - Usuários │ │ - Uploads    │- **Automatic Reconnection**: Exponential backoff strategy with polling fallback|------|-----------|-----------------|

#### Notificações

                        ┌─────────────────────┴──────────────────┐

**Registrar Token FCM**

                        ↓                                        ↓│ - Denúncias    │ │  - Perfis   │ │ - Logs       │

`POST /api/v1/users/fcm-token` (Requer token)

              risk-analysis-service                   notification-service

```json

{                        ↓                                        ↓│ - Notificações │ │  - Config.  │ │ - Cache      │- **Message Queue Architecture**: Event-driven notification system| **👤 Usuário Vítima** | Pessoa que foi vítima de golpe PIX | Inicia o processo de denúncia através do app de seu banco |

  "userId": "uuid-do-usuario",

  "fcmToken": "fGcI-8xqTQmX7Y..."              Calcula/Atualiza Score                  Identifica Banco B

}

```                        ↓                                        ↓│ - Tokens FCM   │ │             │ │              │



#### Saúde do Sistema                Salva novo score                      Envia Webhook para Banco B



**Health Check**                                                                 ↓└────────────────┘ └─────────────┘ └──────────────┘| **🏦 Instituição Financeira A** | Banco da Vítima | Consome a API do Sentinela PIX para registrar a denúncia de golpe |



`GET /health`                                                      Banco B recebe notificação



```json                                                                 ↓```

{

  "status": "healthy",                                                      Dispara bloqueio preventivo

  "timestamp": "2024-10-24T10:30:00Z",

  "services": {```## System Architecture| **🔒 Plataforma Sentinela PIX** | Nossa Solução | O cérebro da operação: recebe, processa, armazena e distribui as informações de fraude |

    "database": "connected",

    "websocket": "running",

    "firebase": "connected"

  }## Documentação Técnica### Componentes do Sistema

}

```



## Instalação e Execução Local### Estrutura do Banco de Dados (SQLite)| **🏛️ Instituição Financeira B** | Banco do Golpista | É notificada pela plataforma para tomar ações de bloqueio preventivo na conta suspeita |



Estas instruções são para a **Implementação de Referência (Node.js)**.



### Pré-requisitosEste esquema refere-se à implementação de referência (Node.js). A arquitetura alvo utilizará PostgreSQL, mas manterá uma estrutura de dados similar.#### Camada de Apresentação



- Node.js v18.0.0 ou superior

- npm v8.0.0 ou superior

- Python v3.8+ (usado para servir o frontend estático localmente)**Tabela: `users`**```

- Git

- Conta Firebase (para Authentication, Firestore e Cloud Messaging)



### Passo 1: Clonar o Repositório```sql**Interface Web**



```powershellCREATE TABLE users (

git clone https://github.com/MatheusGino71/A3-sistemas.git

cd A3-sistemas/sentinela-pix    id TEXT PRIMARY KEY,- Dashboard interativo com visualização de dados em tempo real┌─────────────────────────────────────────────────────────────┐---

```

    email TEXT UNIQUE NOT NULL,

### Passo 2: Configurar o Backend (Node.js)

    password_hash TEXT NOT NULL,- Páginas de perfil de usuário e configurações

1. Navegue até o diretório do backend e instale as dependências:

    full_name TEXT,

```powershell

cd backend    cpf TEXT,- Sistema de relatórios de fraude│                    Client Applications                       │

npm install

```    phone TEXT,



2. Crie um arquivo `.env` na raiz do diretório `backend/` com o seguinte conteúdo:    bank TEXT,- Centro de notificações



```env    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

PORT=3001

JWT_SECRET=sua_chave_secreta_jwt_com_pelo_menos_32_caracteres    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,│  (Web Dashboard, Mobile Apps, Banking Interfaces)           │## 🏗️ Arquitetura de Microsserviços

DATABASE_PATH=./database.sqlite

NODE_ENV=development    last_login DATETIME,

CORS_ORIGIN=http://localhost:8080

```    is_active BOOLEAN DEFAULT 1,**Tecnologias Utilizadas**



### Passo 3: Configurar o Frontend    two_factor_enabled BOOLEAN DEFAULT 0



1. Obtenha suas credenciais de projeto no Console do Firebase.);- HTML5 e CSS3 para estrutura e estilização└────────────────────────┬────────────────────────────────────┘



2. Edite o arquivo `frontend/firebase-config.js` e insira suas credenciais:```



```javascript- JavaScript ES6+ para lógica da aplicação

const firebaseConfig = {

  apiKey: "sua_api_key",**Tabela: `fraud_reports`**

  authDomain: "seu-projeto.firebaseapp.com",

  projectId: "seu-projeto-id",- Tailwind CSS para design responsivo                         │### Visão Arquitetural

  storageBucket: "seu-projeto.appspot.com",

  messagingSenderId: "seu_sender_id",```sql

  appId: "seu_app_id"

};CREATE TABLE fraud_reports (- Material Symbols para iconografia

```

    id TEXT PRIMARY KEY,

3. No Console do Firebase, vá para "Configurações do Projeto" > "Cloud Messaging" e gere um "Certificado Web Push".

    user_id TEXT NOT NULL,                         │ HTTPS / WSS

4. Copie a "Chave pública VAPID" e insira no arquivo `frontend/user-system.js` (linha aproximada 133):

    pix_key TEXT NOT NULL,

```javascript

this.fcmToken = await getToken(messaging, {    pix_key_type TEXT NOT NULL,#### Camada de Aplicação

  vapidKey: 'SUA_CHAVE_PUBLICA_VAPID_AQUI'

});    amount REAL NOT NULL,

```

    transaction_id TEXT,                         │```

### Passo 4: Executar o Backend

    victim_bank TEXT NOT NULL,

Em um terminal, inicie o servidor backend:

    fraudster_bank TEXT,**Servidor Backend**

```powershell

cd backend    description TEXT,

node server.js

```    status TEXT DEFAULT 'pending',- Node.js versão 18 ou superior┌────────────────────────▼────────────────────────────────────┐┌─────────────────┐    ┌─────────────────────┐    ┌──────────────────────┐



Saída esperada: "Sentinela PIX Backend running on port 3001"    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,



### Passo 5: Executar o Frontend    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,- Express.js para roteamento e middleware



Em um segundo terminal, inicie o servidor estático Python para o frontend:    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE



```powershell);- WebSocket Server para comunicação em tempo real│                   Frontend Layer                             ││   App Bancário  │───▶│   API Gateway       │───▶│    Load Balancer     │

cd frontend

python -m http.server 8080```

```

- Sistema de autenticação JWT

Saída esperada: "Serving HTTP on 0.0.0.0 port 8080"

**Tabela: `notifications`**

### Passo 6: Acessar a Aplicação

│  - User Interface (HTML/CSS/JavaScript)                     ││   (Banco A)     │    │ (Spring Cloud GW)   │    │                      │

Abra seu navegador e acesse: `http://localhost:8080`

```sql

## Testes

CREATE TABLE notifications (**Gerenciamento de Estado**

Os testes para a implementação de referência são focados na verificação manual e na consulta direta ao banco de dados.

    id TEXT PRIMARY KEY,

### Procedimentos de Teste Manual

    user_id TEXT NOT NULL,- Armazenamento local para preferências do usuário│  - Firebase Authentication                                   │└─────────────────┘    └─────────────────────┘    └──────────────────────┘

1. **Registro e Autenticação**: Crie uma conta, faça logout e login.

2. **Conexão WebSocket**: Faça login, abra as ferramentas de desenvolvedor (F12) e verifique no console as mensagens de conexão WebSocket.    fraud_report_id TEXT,

3. **Permissão de Notificação**: O dashboard solicitará permissão para notificações. Aceite e verifique no console a obtenção do token FCM.

4. **Criação de Denúncia**: Crie uma denúncia de teste através do dashboard.    type TEXT NOT NULL,- Cache em memória para dados frequentemente acessados

5. **Recebimento de Notificação**: Crie uma notificação de teste via console do navegador para verificar o recebimento via WebSocket:

    title TEXT NOT NULL,

```javascript

fetch('http://localhost:3001/api/v1/notifications/create', {    message TEXT NOT NULL,- Sincronização de estado via WebSocket│  - WebSocket Client                                         │                                  │

  method: 'POST',

  headers: {    read_at DATETIME,

    'Content-Type': 'application/json',

    'Authorization': 'Bearer ' + localStorage.getItem('token')    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  },

  body: JSON.stringify({    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    userId: localStorage.getItem('userId'),

    type: 'test',    FOREIGN KEY (fraud_report_id) REFERENCES fraud_reports(id) ON DELETE SET NULL#### Camada de Dados│  - FCM Service Worker                                       │                ┌─────────────────┼─────────────────┐

    title: 'Notificação de Teste',

    message: 'Esta é uma notificação de teste via WebSocket',);

    icon: 'info',

    color: 'blue'```

  })

})

.then(r => r.json())

.then(d => console.log(d));**Tabela: `user_fcm_tokens`****Banco de Dados SQLite**└────────────────────────┬────────────────────────────────────┘                │                 │                 │

```



### Verificação do Banco de Dados

```sql- Armazenamento de usuários e autenticação

É possível inspecionar o banco de dados SQLite diretamente:

CREATE TABLE user_fcm_tokens (

```powershell

cd backend    user_id TEXT PRIMARY KEY,- Relatórios de fraude e histórico                         │                ▼                 ▼                 ▼

sqlite3 database.sqlite

    fcm_token TEXT NOT NULL,

# Verificar usuários

SELECT id, email, full_name FROM users;    device_info TEXT,- Notificações e status de leitura



# Verificar denúncias    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

SELECT id, pix_key, amount, status FROM fraud_reports;

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE- Tokens FCM para dispositivos                         │ REST API / WebSocket    ┌───────────────────┐ ┌─────────────────┐ ┌─────────────────┐

# Verificar tokens FCM

SELECT user_id, updated_at FROM user_fcm_tokens;);



# Sair```

.exit

```



A arquitetura alvo (Java) utilizará JUnit 5 e Mockito para testes unitários e de integração, e `mvn test` para execução.### Documentação da API**Firebase Services**                         │    │ fraud-report-     │ │ risk-analysis-  │ │ notification-   │



## Segurança e Monitoramento



### SegurançaAbaixo estão os endpoints principais expostos pela API (implementação Node.js).- Firebase Authentication para gerenciamento de usuários



- **Autenticação**: Gerenciamento de sessão via tokens JWT com tempo de expiração.

- **Criptografia**: Senhas armazenadas com hash seguro (bcryptjs).

- **Validação**: Validação e sanitização de todas as entradas de API para prevenir XSS e injeção.#### Autenticação- Firestore para perfis de usuário┌────────────────────────▼────────────────────────────────────┐    │ service           │ │ service         │ │ service         │

- **Comunicação**: Uso de HTTPS e WSS (WebSocket Seguro) é obrigatório em produção.

- **Autorização**: Endpoints protegidos por middleware de autenticação.



### Monitoramento**Registrar Novo Usuário**- Firebase Cloud Messaging para notificações push



- **Implementação de Referência**: Logs de status, erros e conexões WebSocket são enviados para o console.

- **Arquitetura Alvo**: Prevê o uso de Spring Boot Actuator para métricas, Prometheus para coleta, Grafana para dashboards, e o stack ELK (Elasticsearch, Logstash, Kibana) para logging centralizado e distribuído.

`POST /api/v1/auth/register`- Firebase Hosting para hospedagem da aplicação│                   Backend Services                           │    │                   │ │                 │ │                 │

## Estrutura do Projeto



```

sentinela-pix/```json

├── README.md                    # Documentação principal

├── docker-compose.yml           # (Planejado) Orquestração de containers{

│

├── backend/                     # Implementação de Referência (Node.js)  "email": "usuario@exemplo.com",## Stack Tecnológica│  - Express.js REST API (Port 3001)                          │    │ • Recebe denúncias│ │ • Score de risco│ │ • Notifica bancos│

│   ├── server.js                # Aplicação principal (Express + WebSocket)

│   ├── package.json             # Dependências e scripts Node.js  "password": "senhaSegura123",

│   └── database.sqlite          # Banco de dados local

│  "full_name": "João da Silva",

├── frontend/                    # Interface Web (Estático)

│   ├── index.html               # Página inicial  "cpf": "12345678901",

│   ├── login.html               # Página de autenticação

│   ├── cadastro.html            # Página de registro  "phone": "+5511999999999",### Tecnologias Backend│  - WebSocket Server (ws://localhost:3001/ws)                │    │ • Valida dados    │ │ • 1→suspeita    │ │ • Webhooks       │

│   ├── dashboard.html           # Dashboard principal

│   ├── profile.html             # Gerenciamento de perfil  "bank": "Banco do Brasil"

│   ├── settings.html            # Configurações da aplicação

│   ├── dashboard.js             # Lógica do dashboard e visualização}

│   ├── user-system.js           # Lógica de usuário e notificações

│   ├── styles.css               # Estilos customizados (Tailwind)```

│   ├── firebase-config.js       # Configuração do Firebase SDK

│   └── firebase-messaging-sw.js # Service worker para FCM**Runtime e Framework**│  - Authentication & Authorization                            │    │ • Persiste no BD  │ │ • 3→alto risco  │ │ • REST API       │

│

├── microservices/               # (Planejado) Arquitetura Alvo (Java)**Login de Usuário**

│   ├── api-gateway/             # Spring Cloud Gateway

│   ├── fraud-report-service/    # Microsserviço de denúncias- Node.js v18.0.0 ou superior - Ambiente de execução JavaScript

│   ├── risk-analysis-service/   # Microsserviço de pontuação de risco

│   └── notification-service/    # Microsserviço de entrega de notificações`POST /api/v1/auth/login`

│

├── sentinela-pix-bradesco/      # Implementação específica Bradesco- Express.js 4.18.x - Framework web minimalista e flexível│  - Business Logic & Validation                              │    │ • Publica eventos │ │ • Consulta keys │ │ • Auto notif.    │

│   ├── query-service/           # Serviço de consulta

│   ├── report-service/          # Serviço de relatórios```json

│   └── web-interface/           # Interface customizada

│{- SQLite3 - Banco de dados relacional embutido

├── rabbitmq/                    # Configurações do RabbitMQ

│   ├── definitions.json  "email": "usuario@exemplo.com",

│   └── setup-rabbitmq.sh

│  "password": "senhaSegura123"- bcryptjs - Biblioteca para hash de senhas└────────────────────────┬────────────────────────────────────┘    └───────────────────┘ └─────────────────┘ └─────────────────┘

└── docs/                        # Documentação adicional

    ├── API-DOCUMENTATION.md     # Documentação completa da API}

    ├── DEPLOYMENT-GUIDE.md      # Guia de deployment

    └── NOTIFICATION-SYSTEM.md   # Sistema de notificações```- jsonwebtoken - Implementação JWT para autenticação

```



## Roadmap (Visão Futura)

#### Relatórios de Fraude- ws 8.14.2 - Biblioteca WebSocket para comunicação em tempo real                         │                │                 │                 │

A implementação de referência (Node.js) serve como prova de conceito. O roadmap futuro foca na construção da arquitetura alvo (Java/Spring) com as seguintes melhorias:



### Fase 1: Migração da Arquitetura

**Criar Relatório de Fraude**- node-cron - Agendador de tarefas

- Implementar os microsserviços (fraud-report, risk-analysis, notification) em Java/Spring Boot.

- Migrar o banco de dados de SQLite para PostgreSQL.

- Implementar o broker de mensagens (RabbitMQ) para comunicação assíncrona.

- Configurar API Gateway (Spring Cloud).`POST /api/v1/reports` (Requer token)                         │                └────────────────▼─────────────────┘



### Fase 2: Escalabilidade e Machine Learning



- Containerizar a aplicação (Docker) e orquestrar com Kubernetes (Azure AKS).```json### Tecnologias Frontend

- Implementar pipeline de CI/CD (GitHub Actions) para deploy no Azure.

- Substituir o algoritmo de score de risco por um modelo de Machine Learning para detecção de padrões complexos.{



### Fase 3: Expansão do Ecossistema  "pixKey": "fraudador@email.com",         ┌───────────────┼───────────────┐                        ┌─────────────────┐



- Desenvolvimento de aplicativo mobile (React Native ou Flutter) para denúncias.  "pixKeyType": "email",

- Criação de API pública para integração de terceiros (fintechs, bureaus de crédito).

- Implementação de trilha de auditoria baseada em blockchain para imutabilidade das denúncias.  "amount": 5000.00,**Linguagens e Frameworks**



## Contribuição  "transactionId": "E12345678",



Este é um projeto acadêmico e contribuições são bem-vindas. Para contribuir:  "victimBank": "Banco do Brasil",- HTML5 - Estrutura semântica da aplicação         │               │               │                        │   RabbitMQ      │



1. Faça um *fork* do repositório.  "description": "Descrição detalhada da fraude"

2. Crie uma nova *branch* para sua funcionalidade (`git checkout -b feature/nova-funcionalidade`).

3. Faça *commit* de suas alterações (`git commit -m 'Adiciona nova funcionalidade'`).}- CSS3 - Estilização e layout responsivo

4. Faça *push* para a *branch* (`git push origin feature/nova-funcionalidade`).

5. Abra um *Pull Request* com uma descrição detalhada das suas alterações.```



## Licença- JavaScript ES6+ - Lógica da aplicação e interatividade         ▼               ▼               ▼                        │   (Mensageria)  │



Este projeto é desenvolvido para fins acadêmicos como parte do curso A3 de Sistemas. Todos os direitos reservados à equipe de desenvolvimento.**Listar Relatórios**



---- Tailwind CSS 3.x - Framework CSS utility-first



**Desenvolvido como solução acadêmica para combater fraudes no sistema de pagamentos PIX brasileiro.**`GET /api/v1/reports?status=pending&limit=20&offset=0` (Requer token)



**Última Atualização**: Outubro de 2024- Material Symbols - Sistema de ícones do Google┌────────────────┐ ┌─────────────┐ ┌──────────────┐                        │                 │


#### Análise de Risco



**Consultar Risco de Chave PIX**

### Integrações Firebase│ SQLite Database│ │  Firebase   │ │  File System │                        │ • NovaDenuncia  │

`GET /api/v1/keys/{chavePix}/risk` (Requer token)



```json

{**Serviços Utilizados**│                │ │  Firestore  │ │              │                        │ • Async Events  │

  "pixKey": "fraudador@email.com",

  "riskLevel": "HIGH_RISK",- Firebase Authentication - Autenticação de usuários

  "riskScore": 85,

  "reportCount": 5,- Firebase Firestore - Banco de dados NoSQL em nuvem│ - Users        │ │  - Users    │ │ - Uploads    │                        │ • Pub/Sub       │

  "lastReportDate": "2024-10-24T09:15:00Z",

  "affectedInstitutions": ["Banco A", "Banco B"]- Firebase Cloud Messaging (FCM) - Serviço de notificações push

}

```- Firebase Hosting - Hospedagem de conteúdo estático│ - Reports      │ │  - Profiles │ │ - Logs       │                        └─────────────────┘



#### Notificações



**Registrar Token FCM**### Comunicação em Tempo Real│ - Notifications│ │  - Settings │ │ - Cache      │                                │



`POST /api/v1/users/fcm-token` (Requer token)



```json**Protocolos e Bibliotecas**│ - FCM Tokens   │ │             │ │              │                        ┌─────────────────┐

{

  "userId": "uuid-do-usuario",- Protocolo WebSocket - Conexões bidirecionais persistentes

  "fcmToken": "fGcI-8xqTQmX7Y..."

}- Reconexão Automática - Estratégia de backoff exponencial com fallback└────────────────┘ └─────────────┘ └──────────────┘                        │   PostgreSQL    │

```

- Arquitetura de Fila de Mensagens - Sistema de notificações orientado a eventos

#### Saúde do Sistema

```                        │   (Database)    │

**Health Check**

## Funcionalidades Principais

`GET /health`

                        │                 │

```json

{### 1. Sistema de Gerenciamento de Usuários

  "status": "healthy",

  "timestamp": "2024-10-24T10:30:00Z",## Core Features                        │ • Denúncias     │

  "services": {

    "database": "connected",#### Autenticação

    "websocket": "running",

    "firebase": "connected"                        │ • Scores PIX    │

  }

}**Recursos de Autenticação**

```

- Integração com Firebase Authentication### 1. User Management System                        │ • Históricos    │

## Instalação e Execução Local

- Autenticação via email e senha com validação

Estas instruções são para a **Implementação de Referência (Node.js)**.

- Gerenciamento de sessão baseado em tokens JWT                        └─────────────────┘

### Pré-requisitos

- Hash seguro de senhas com bcryptjs (10 rounds)

- Node.js v18.0.0 ou superior

- npm v8.0.0 ou superior- Troca de senha com requisito de reautenticação**Authentication**```

- Python v3.8+ (usado para servir o frontend estático localmente)

- Git- Expiração e renovação automática de sessão

- Conta Firebase (para Authentication, Firestore e Cloud Messaging)

- Funcionalidade de logout com invalidação de token- Firebase Authentication integration

### Passo 1: Clonar o Repositório



```powershell

git clone https://github.com/MatheusGino71/A3-sistemas.git**Perfis de Usuário**- Email/password authentication with validation### 🔧 Microsserviços Detalhados

cd A3-sistemas/sentinela-pix

```- Interface completa de gerenciamento de perfil (profile.html)



### Passo 2: Configurar o Backend (Node.js)- Edição de informações pessoais (nome, email, CPF, telefone)- JWT token-based session management



1. Navegue até o diretório do backend e instale as dependências:- Seleção de instituição bancária (8 bancos brasileiros suportados)



```powershell- Sistema de avatar com geração automática de iniciais- Secure password hashing with bcryptjs (10 rounds)#### 1️⃣ **api-gateway** (Gateway de API)

cd backend

npm install- Toggle de autenticação de dois fatores

```

- Dashboard de estatísticas da conta (relatórios enviados, fraudes detectadas, taxa de sucesso)- Password change with reauthentication requirement- **Tecnologia**: Spring Boot + Spring Cloud Gateway

2. Crie um arquivo `.env` na raiz do diretório `backend/` com o seguinte conteúdo:

- Funcionalidade de exportação de dados em formato JSON

```env

PORT=3001- Exclusão de conta com diálogo de confirmação- Session expiration and automatic renewal- **Porta**: 8080

JWT_SECRET=sua_chave_secreta_jwt_com_pelo_menos_32_caracteres

DATABASE_PATH=./database.sqlite

NODE_ENV=development

CORS_ORIGIN=http://localhost:8080**Gerenciamento de Configurações**- Logout functionality with token invalidation- **Responsabilidade**: 

```

- Interface abrangente de configurações (settings.html)

### Passo 3: Configurar o Frontend

- Personalização de tema (modos claro/escuro/automático)  - Ponto de entrada único para todas as requisições externas dos bancos

1. Obtenha suas credenciais de projeto no Console do Firebase.

- Preferências de idioma (Português, Inglês, Espanhol)

2. Edite o arquivo `frontend/firebase-config.js` e insira suas credenciais:

- Controle de densidade da interface (confortável, compacto, espaçoso)**User Profiles**  - Autenticação e autorização de APIs

```javascript

const firebaseConfig = {- Configuração de preferências de notificação

  apiKey: "sua_api_key",

  authDomain: "seu-projeto.firebaseapp.com",- Gerenciamento de configurações de privacidade- Complete profile management interface (profile.html)  - Roteamento inteligente para microsserviços

  projectId: "seu-projeto-id",

  storageBucket: "seu-projeto.appspot.com",- Opções de segurança (2FA, sessões ativas, histórico de login)

  messagingSenderId: "seu_sender_id",

  appId: "seu_app_id"- Toggle de modo desenvolvedor- Personal information editing (name, email, CPF, phone)  - Rate limiting e circuit breaker

};

```- Ferramentas de gerenciamento de cache



3. No Console do Firebase, vá para "Configurações do Projeto" > "Cloud Messaging" e gere um "Certificado Web Push".- Importação e exportação de configurações em formato JSON- Bank institution selection (8 Brazilian banks supported)



4. Copie a "Chave pública VAPID" e insira no arquivo `frontend/user-system.js` (linha aproximada 133):- Funcionalidade de reset de todas as configurações



```javascript- Avatar system with automatic initials generation**Endpoints Principais:**

this.fcmToken = await getToken(messaging, {

  vapidKey: 'SUA_CHAVE_PUBLICA_VAPID_AQUI'### 2. Sistema de Relatórios de Fraude

});

```- Two-factor authentication toggle```



### Passo 4: Executar o Backend#### Criação de Relatórios



Em um terminal, inicie o servidor backend:- Account statistics dashboard (reports sent, frauds detected, success rate)POST /api/v1/reports          → fraud-report-service



```powershell**Interface de Submissão**

cd backend

node server.js- Interface estruturada de submissão de relatórios de fraude- Data export functionality in JSON formatGET  /api/v1/keys/{key}/risk  → risk-analysis-service

```

- Validação de chave PIX (email, telefone, CPF, CNPJ, chave aleatória)

Saída esperada: "Sentinela PIX Backend running on port 3001"

- Rastreamento de valor de transação com formatação de moeda- Account deletion with confirmation dialogPOST /api/v1/notifications    → notification-service

### Passo 5: Executar o Frontend

- Registro e validação de ID de transação

Em um segundo terminal, inicie o servidor estático Python para o frontend:

- Identificação de instituição (bancos vítima e fraudador)```

```powershell

cd frontend- Registro preciso de timestamp

python -m http.server 8080

```- Captura de informações do denunciante com controles de privacidade**Settings Management**



Saída esperada: "Serving HTTP on 0.0.0.0 port 8080"- Rastreamento de status (pendente, confirmado, falso positivo)



### Passo 6: Acessar a Aplicação- Suporte para anexos de evidência- Comprehensive settings interface (settings.html)#### 2️⃣ **fraud-report-service** (Serviço de Denúncias)



Abra seu navegador e acesse: `http://localhost:8080`



## Testes#### Gerenciamento de Relatórios- Theme customization (light/dark/auto modes)- **Tecnologia**: Java 17+, Spring Boot, JPA/Hibernate



Os testes para a implementação de referência são focados na verificação manual e na consulta direta ao banco de dados.



### Procedimentos de Teste Manual**Recursos de Gerenciamento**- Language preferences (Portuguese, English, Spanish)- **Porta**: 8081



1. **Registro e Autenticação**: Crie uma conta, faça logout e login.- Lista abrangente de relatórios com paginação

2. **Conexão WebSocket**: Faça login, abra as ferramentas de desenvolvedor (F12) e verifique no console as mensagens de conexão WebSocket.

3. **Permissão de Notificação**: O dashboard solicitará permissão para notificações. Aceite e verifique no console a obtenção do token FCM.- Capacidades avançadas de filtro (status, intervalo de datas, valor, instituição)- UI density control (comfortable, compact, spacious)- **Responsabilidade**:

4. **Criação de Denúncia**: Crie uma denúncia de teste através do dashboard.

5. **Recebimento de Notificação**: Crie uma notificação de teste via console do navegador para verificar o recebimento via WebSocket:- Funcionalidade de busca em texto completo



```javascript- Atualizações de status em massa- Notification preferences configuration  - Receber detalhes da denúncia (chave PIX do golpista, valor, horário, ID da transação)

fetch('http://localhost:3001/api/v1/notifications/create', {

  method: 'POST',- Visualização detalhada de relatórios com histórico completo

  headers: {

    'Content-Type': 'application/json',- Exportação de relatórios em múltiplos formatos (CSV, JSON, PDF)- Privacy settings management  - Validar dados de entrada

    'Authorization': 'Bearer ' + localStorage.getItem('token')

  },- Suporte a operações em massa (excluir, atualizar status, exportar)

  body: JSON.stringify({

    userId: localStorage.getItem('userId'),- Security options (2FA, active sessions, login history)  - Persistir denúncias no PostgreSQL

    type: 'test',

    title: 'Notificação de Teste',### 3. Motor de Análise de Risco

    message: 'Esta é uma notificação de teste via WebSocket',

    icon: 'info',- Developer mode toggle  - Publicar evento "NovaDenunciaRecebida" para RabbitMQ

    color: 'blue'

  })#### Algoritmo de Pontuação de Risco

})

.then(r => r.json())- Cache management tools

.then(d => console.log(d));

```**Níveis de Risco**



### Verificação do Banco de Dados- 1 denúncia: Conta marcada como "suspeita"- Settings import/export in JSON format**Modelo de Dados:**



É possível inspecionar o banco de dados SQLite diretamente:- 3 ou mais denúncias em 24 horas: Conta marcada como "risco alto"



```powershell- 5 ou mais denúncias em 7 dias: Conta marcada como "risco crítico"- Reset all settings functionality```java

cd backend

sqlite3 database.sqlite- Análise de padrões históricos com preparação para machine learning



# Verificar usuários- Detecção de anomalias comportamentais@Entity

SELECT id, email, full_name FROM users;

- Classificação de nível de risco (baixo, médio, alto, crítico)

# Verificar denúncias

SELECT id, pix_key, amount, status FROM fraud_reports;- Análise temporal de padrões de fraude### 2. Fraud Reporting Systempublic class FraudReport {



# Verificar tokens FCM- Correlação de risco entre instituições

SELECT user_id, updated_at FROM user_fcm_tokens;

    private Long id;

# Sair

.exit#### API de Consulta de Risco

```

**Report Creation**    private String pixKey;           // Chave PIX do golpista

A arquitetura alvo (Java) utilizará JUnit 5 e Mockito para testes unitários e de integração, e `mvn test` para execução.

**Endpoint de Consulta**

## Segurança e Monitoramento

```http- Structured fraud report submission interface    private BigDecimal amount;       // Valor da transação

### Segurança

GET /api/v1/keys/{chavePix}/risk

- **Autenticação**: Gerenciamento de sessão via tokens JWT com tempo de expiração.

- **Criptografia**: Senhas armazenadas com hash seguro (bcryptjs).Authorization: Bearer {token}- PIX key validation (email, phone, CPF, CNPJ, random key)    private LocalDateTime timestamp; // Horário da transação

- **Validação**: Validação e sanitização de todas as entradas de API para prevenir XSS e injeção.

- **Comunicação**: Uso de HTTPS e WSS (WebSocket Seguro) é obrigatório em produção.

- **Autorização**: Endpoints protegidos por middleware de autenticação.

Resposta: 200 OK- Transaction amount tracking with currency formatting    private String transactionId;    // ID da transação PIX

### Monitoramento

{

- **Implementação de Referência**: Logs de status, erros e conexões WebSocket são enviados para o console.

- **Arquitetura Alvo**: Prevê o uso de Spring Boot Actuator para métricas, Prometheus para coleta, Grafana para dashboards, e o stack ELK (Elasticsearch, Logstash, Kibana) para logging centralizado e distribuído.  "pixKey": "fraudador@email.com",- Transaction ID registration and validation    private String victimBank;       // Banco da vítima



## Estrutura do Projeto  "riskLevel": "HIGH_RISK",



```  "riskScore": 85,- Institution identification (victim and fraudster banks)    private String reporterInfo;     // Dados do denunciante

sentinela-pix/

├── README.md                    # Documentação principal  "reportCount": 5,

├── docker-compose.yml           # (Planejado) Orquestração de containers

│  "firstReportDate": "2024-10-15T14:30:00Z",- Precise timestamp recording    private FraudStatus status;      // PENDING, CONFIRMED, FALSE_POSITIVE

├── backend/                     # Implementação de Referência (Node.js)

│   ├── server.js                # Aplicação principal (Express + WebSocket)  "lastReportDate": "2024-10-24T09:15:00Z",

│   ├── package.json             # Dependências e scripts Node.js

│   └── database.sqlite          # Banco de dados local  "affectedInstitutions": ["Banco A", "Banco B", "Banco C"],- Reporter information capture with privacy controls}

│

├── frontend/                    # Interface Web (Estático)  "totalAmount": 25000.00

│   ├── index.html               # Página inicial

│   ├── login.html               # Página de autenticação}- Status tracking (pending, confirmed, false positive)```

│   ├── cadastro.html            # Página de registro

│   ├── dashboard.html           # Dashboard principal```

│   ├── profile.html             # Gerenciamento de perfil

│   ├── settings.html            # Configurações da aplicação- Attachment support for evidence

│   ├── dashboard.js             # Lógica do dashboard e visualização

│   ├── user-system.js           # Lógica de usuário e notificações### 4. Sistema de Notificações em Tempo Real

│   ├── styles.css               # Estilos customizados (Tailwind)

│   ├── firebase-config.js       # Configuração do Firebase SDK#### 3️⃣ **risk-analysis-service** (Serviço de Análise de Risco)

│   └── firebase-messaging-sw.js # Service worker para FCM

│#### Comunicação WebSocket

├── microservices/               # (Planejado) Arquitetura Alvo (Java)

│   ├── api-gateway/             # Spring Cloud Gateway**Report Management**- **Tecnologia**: Java 17+, Spring Boot

│   ├── fraud-report-service/    # Microsserviço de denúncias

│   ├── risk-analysis-service/   # Microsserviço de pontuação de risco**Recursos de Conexão**

│   └── notification-service/    # Microsserviço de entrega de notificações

│- Conexões WebSocket persistentes em ws://localhost:3001/ws- Comprehensive report listing with pagination- **Porta**: 8082  

├── sentinela-pix-bradesco/      # Implementação específica Bradesco

│   ├── query-service/           # Serviço de consulta- Identificação automática de usuário após estabelecimento de conexão

│   ├── report-service/          # Serviço de relatórios

│   └── web-interface/           # Interface customizada- Entrega de mensagens em tempo real com latência sub-segundo- Advanced filtering capabilities (status, date range, amount, institution)- **Responsabilidade**:

│

├── rabbitmq/                    # Configurações do RabbitMQ- Gerenciamento e monitoramento de estado de conexão

│   ├── definitions.json

│   └── setup-rabbitmq.sh- Reconexão automática com algoritmo de backoff exponencial- Full-text search functionality  - Escutar eventos de novas denúncias

│

└── docs/                        # Documentação adicional- Máximo de 5 tentativas de reconexão antes do fallback

    ├── API-DOCUMENTATION.md     # Documentação completa da API

    ├── DEPLOYMENT-GUIDE.md      # Guia de deployment- Fallback para mecanismo de polling (intervalo de 30 segundos)- Bulk status updates  - Manter registro de chaves PIX e contas denunciadas

    └── NOTIFICATION-SYSTEM.md   # Sistema de notificações

```- Pool de conexões para escalabilidade



## Roadmap (Visão Futura)- Enfileiramento de mensagens durante períodos de desconexão- Detailed report view with complete history  - Calcular score de risco automático



A implementação de referência (Node.js) serve como prova de conceito. O roadmap futuro foca na construção da arquitetura alvo (Java/Spring) com as seguintes melhorias:



### Fase 1: Migração da Arquitetura#### Notificações Push- Export reports to multiple formats (CSV, JSON, PDF)  - Expor endpoint de consulta de risco



- Implementar os microsserviços (fraud-report, risk-analysis, notification) em Java/Spring Boot.

- Migrar o banco de dados de SQLite para PostgreSQL.

- Implementar o broker de mensagens (RabbitMQ) para comunicação assíncrona.**Firebase Cloud Messaging**- Bulk operations support (delete, update status, export)

- Configurar API Gateway (Spring Cloud).

- Integração com Firebase Cloud Messaging (FCM)

### Fase 2: Escalabilidade e Machine Learning

- Configuração de chave VAPID para web push**Lógica de Score:**

- Containerizar a aplicação (Docker) e orquestrar com Kubernetes (Azure AKS).

- Implementar pipeline de CI/CD (GitHub Actions) para deploy no Azure.- Gerenciamento e atualização de tokens FCM

- Substituir o algoritmo de score de risco por um modelo de Machine Learning para detecção de padrões complexos.

- Suporte a notificações em segundo plano via Service Worker### 3. Risk Analysis Engine- 📊 **1 denúncia** = Chave marcada como "suspeita"

### Fase 3: Expansão do Ecossistema

- Manipulação de notificações em primeiro plano com UI customizada

- Desenvolvimento de aplicativo mobile (React Native ou Flutter) para denúncias.

- Criação de API pública para integração de terceiros (fintechs, bureaus de crédito).- Ícones, badges e sons de notificação personalizados- 🚨 **3 denúncias em 24h** = Chave marcada como "alto risco"

- Implementação de trilha de auditoria baseada em blockchain para imutabilidade das denúncias.

- Manipulação de cliques em notificação com deep linking

## Contribuição

- Gerenciamento de permissões do navegador com prompts amigáveis**Risk Scoring Algorithm**- 🔍 **Histórico** = Análise de padrões comportamentais

Este é um projeto acadêmico e contribuições são bem-vindas. Para contribuir:

- Suporte multi-dispositivo com sincronização de tokens

1. Faça um *fork* do repositório.

2. Crie uma nova *branch* para sua funcionalidade (`git checkout -b feature/nova-funcionalidade`).- **1 report**: Account marked as "suspicious"

3. Faça *commit* de suas alterações (`git commit -m 'Adiciona nova funcionalidade'`).

4. Faça *push* para a *branch* (`git push origin feature/nova-funcionalidade`).#### Tipos de Notificação

5. Abra um *Pull Request* com uma descrição detalhada das suas alterações.

- **3+ reports in 24 hours**: Account marked as "high risk"**Endpoint de Consulta:**

## Licença

**Categorias Implementadas**

Este projeto é desenvolvido para fins acadêmicos como parte do curso A3 de Sistemas. Todos os direitos reservados à equipe de desenvolvimento.

- Alertas de Fraude: Notificações imediatas para novos relatórios de fraude- **5+ reports in 7 days**: Account marked as "critical risk"```

---

- Atualizações de Status de Relatório: Notificações quando o status do relatório muda

**Desenvolvido como solução acadêmica para combater fraudes no sistema de pagamentos PIX brasileiro.**

- Anúncios do Sistema: Atualizações de plataforma e avisos de manutenção- Historical pattern analysis with machine learning preparationGET /api/v1/keys/{chavePix}/risk

**Última Atualização**: Outubro de 2024

- Alertas de Segurança: Atividade suspeita ou login de novo dispositivo

- Atividade da Conta: Mudanças de perfil, atualizações de senha, etc.- Behavioral anomaly detectionResponse: {



#### Mecanismos de Entrega- Risk level classification (low, medium, high, critical)  "pixKey": "golpista@email.com",



**Canais de Entrega**- Temporal analysis of fraud patterns  "riskLevel": "HIGH_RISK",

- WebSocket (primário, tempo real): Entrega sub-segundo

- Notificações Push (nativas do navegador): Entregue mesmo com aba fechada- Cross-institution risk correlation  "reportCount": 5,

- Notificações por Email (configurável): Para alertas críticos

- Centro de Notificações In-App: Histórico persistente de notificações  "firstReportDate": "2024-10-15T14:30:00Z",



### 5. Dashboard e Análise**Risk Query API**  "lastReportDate": "2024-10-17T09:15:00Z"



#### Indicadores Chave de Performance (KPIs)```http}



**Métricas Rastreadas**GET /api/v1/keys/{pixKey}/risk```

- Total de relatórios de fraude (acumulado e período específico)

- Casos de fraude detectados com taxa de confirmaçãoAuthorization: Bearer {token}

- Métricas de taxa de sucesso (transações prevenidas)

- Contagem de usuários ativos e tendências de crescimento#### 4️⃣ **notification-service** (Serviço de Notificações)  

- Estatísticas de tempo médio de resposta

- Métricas de uptime e disponibilidade do sistemaResponse: 200 OK- **Tecnologia**: Java 17+, Spring Boot



#### Visualização de Dados{- **Porta**: 8083



**Componentes de Visualização**  "pixKey": "fraudster@email.com",- **Responsabilidade**:

- Gráficos e charts interativos usando Chart.js

- Tendências de fraude ao longo do tempo (visões diária, semanal, mensal)  "riskLevel": "HIGH_RISK",  - Escutar eventos de "NovaDenunciaRecebida"

- Mapas de distribuição geográfica de casos de fraude

- Análise de distribuição de risco com drill-down  "riskScore": 85,  - Identificar instituição financeira do golpista

- Estatísticas e comparações por instituição

- Dashboards com atualização em tempo real  "reportCount": 5,  - Enviar notificação automática via webhook/REST API



#### Relatórios  "firstReportDate": "2024-10-15T14:30:00Z",  - Retry logic para garantia de entrega



**Capacidades de Relatório**  "lastReportDate": "2024-10-24T09:15:00Z",

- Geração automatizada de relatórios em agenda

- Intervalos de datas e filtros customizáveis  "affectedInstitutions": ["Banco A", "Banco B", "Banco C"],**Fluxo de Notificação:**

- Capacidades de exportação (PDF, CSV, JSON, Excel)

- Entrega agendada de relatórios via email  "totalAmount": 25000.001. Evento recebido do RabbitMQ

- Templates de relatório customizados

- Geração de resumo executivo}2. Identificação do banco pela chave PIX



## Estrutura do Banco de Dados```3. Lookup de webhook da instituição



### Tabela de Usuários4. Envio da notificação com retry automático



```sql### 4. Real-Time Notification System5. Log de auditoria da entrega

CREATE TABLE users (

    id TEXT PRIMARY KEY,

    email TEXT UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,**WebSocket Communication**---

    full_name TEXT,

    cpf TEXT,- Persistent WebSocket connections on ws://localhost:3001/ws

    phone TEXT,

    bank TEXT,- Automatic user identification after connection establishment## 🌊 Fluxo Operacional Completo

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,- Real-time message delivery with sub-second latency

    last_login DATETIME,

    is_active BOOLEAN DEFAULT 1,- Connection state management and monitoring### 📱 Cenário: Denúncia de Golpe PIX

    two_factor_enabled BOOLEAN DEFAULT 0

);- Automatic reconnection with exponential backoff algorithm



CREATE INDEX idx_users_email ON users(email);- Maximum 5 reconnection attempts before fallback**1. 🎣 O Golpe Acontece**

CREATE INDEX idx_users_cpf ON users(cpf);

```- Fallback to polling mechanism (30-second interval)```



### Tabela de Relatórios de Fraude- Connection pooling for scalabilityVítima → PIX R$ 5.000 → golpista@email.com (Banco B)



```sql- Message queuing during disconnection periods```

CREATE TABLE fraud_reports (

    id TEXT PRIMARY KEY,

    user_id TEXT NOT NULL,

    pix_key TEXT NOT NULL,**Push Notifications****2. 🚨 Denúncia Imediata**

    pix_key_type TEXT NOT NULL,

    amount REAL NOT NULL,- Firebase Cloud Messaging (FCM) integration```

    transaction_id TEXT,

    victim_bank TEXT NOT NULL,- VAPID key configuration for web pushVítima → App Banco A → "Reportar Fraude PIX"

    fraudster_bank TEXT,

    description TEXT,- FCM token management and refresh```

    status TEXT DEFAULT 'pending',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,- Background notification support via Service Worker

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE- Foreground notification handling with custom UI**3. 🔄 Processamento Sentinela PIX**

);

- Custom notification icons, badges, and sounds

CREATE INDEX idx_fraud_reports_user_id ON fraud_reports(user_id);

CREATE INDEX idx_fraud_reports_pix_key ON fraud_reports(pix_key);- Notification click handling with deep linking```mermaid

CREATE INDEX idx_fraud_reports_status ON fraud_reports(status);

CREATE INDEX idx_fraud_reports_created_at ON fraud_reports(created_at);- Browser permission management with user-friendly promptssequenceDiagram

```

- Multi-device support with token synchronization    participant V as Vítima

### Tabela de Notificações

    participant BA as Banco A

```sql

CREATE TABLE notifications (**Notification Types**    participant GW as API Gateway  

    id TEXT PRIMARY KEY,

    user_id TEXT NOT NULL,- **Fraud Alerts**: Immediate notifications for new fraud reports    participant FR as fraud-report-service

    fraud_report_id TEXT,

    type TEXT NOT NULL,- **Report Status Updates**: Notifications when report status changes    participant MQ as RabbitMQ

    title TEXT NOT NULL,

    message TEXT NOT NULL,- **System Announcements**: Platform updates and maintenance notices    participant RA as risk-analysis-service

    icon TEXT,

    color TEXT,- **Security Alerts**: Suspicious activity or login from new device    participant NS as notification-service

    read_at DATETIME,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,- **Account Activity**: Profile changes, password updates, etc.    participant BB as Banco B

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    FOREIGN KEY (fraud_report_id) REFERENCES fraud_reports(id) ON DELETE SET NULL

);

**Delivery Mechanisms**    V->>BA: Reportar fraude PIX

CREATE INDEX idx_notifications_user_id ON notifications(user_id);

CREATE INDEX idx_notifications_created_at ON notifications(created_at);- **WebSocket** (primary, real-time): Sub-second delivery    BA->>GW: POST /api/v1/reports

CREATE INDEX idx_notifications_read_at ON notifications(read_at);

```- **Push Notifications** (browser native): Delivered even when tab closed    GW->>FR: Route to fraud-report



### Tabela de Tokens FCM- **Email Notifications** (configurable): For critical alerts    FR->>FR: Validar dados



```sql- **In-app Notification Center**: Persistent notification history    FR->>DB: Salvar denúncia

CREATE TABLE user_fcm_tokens (

    user_id TEXT PRIMARY KEY,    FR->>MQ: Publish "NovaDenunciaRecebida"

    fcm_token TEXT NOT NULL,

    device_info TEXT,### 5. Dashboard and Analytics    

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE    MQ->>RA: Event: Nova denúncia

);

```**Key Performance Indicators (KPIs)**    RA->>RA: Atualizar score golpista@email.com



## Documentação da API- Total fraud reports (all-time and period-specific)    RA->>DB: Salvar novo score



### Endpoints de Autenticação- Detected fraud cases with confirmation rate    



#### Registrar Novo Usuário- Success rate metrics (prevented transactions)    MQ->>NS: Event: Nova denúncia  



```http- Active users count and growth trends    NS->>NS: Identificar Banco B

POST /api/v1/auth/register

Content-Type: application/json- Average response time statistics    NS->>BB: POST webhook notificação



{- System uptime and availability metrics    BB->>BB: Processo interno bloqueio

  "email": "usuario@exemplo.com",

  "password": "senhaSegura123",```

  "full_name": "João da Silva",

  "cpf": "12345678901",**Data Visualization**

  "phone": "+5511999999999",

  "bank": "Banco do Brasil"- Interactive charts and graphs using Chart.js**4. ⚡ Ação do Banco B**

}

- Fraud trends over time (daily, weekly, monthly views)- Sistema recebe notificação automática

Resposta: 201 Created

{- Geographic distribution maps of fraud cases- Processo interno de bloqueio preventivo disparado

  "userId": "550e8400-e29b-41d4-a716-446655440000",

  "email": "usuario@exemplo.com",- Risk distribution analysis with drill-down- Conta do golpista pode ser congelada

  "full_name": "João da Silva",

  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",- Institution-wise statistics and comparisons- Impedimento de saque/transferência do dinheiro

  "expiresIn": 3600,

  "createdAt": "2024-10-24T10:30:00Z"- Real-time updating dashboards

}

```---



#### Login de Usuário**Reporting**



```http- Automated report generation on schedule## 🛠️ Stack Tecnológica

POST /api/v1/auth/login

Content-Type: application/json- Customizable date ranges and filters



{- Export capabilities (PDF, CSV, JSON, Excel)### Backend

  "email": "usuario@exemplo.com",

  "password": "senhaSegura123"- Scheduled report delivery via email- **☕ Java 17 LTS** - Linguagem principal

}

- Custom report templates- **🍃 Spring Boot 3.1** - Framework de aplicação

Resposta: 200 OK

{- Executive summary generation- **🌐 Spring Cloud Gateway** - API Gateway

  "userId": "550e8400-e29b-41d4-a716-446655440000",

  "email": "usuario@exemplo.com",- **🔄 Spring AMQP** - Integração RabbitMQ

  "full_name": "João da Silva",

  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",## Database Schema- **🗄️ Spring Data JPA** - Persistência de dados

  "expiresIn": 3600,

  "lastLogin": "2024-10-24T10:30:00Z"- **🔒 Spring Security** - Autenticação e autorização

}

```### Users Table



### Endpoints de Relatórios de Fraude```sql### Infraestrutura



#### Criar Relatório de FraudeCREATE TABLE users (- **🐳 Docker** - Containerização



```http    id TEXT PRIMARY KEY,- **🐰 RabbitMQ** - Sistema de mensageria

POST /api/v1/reports

Authorization: Bearer {token}    email TEXT UNIQUE NOT NULL,- **🐘 PostgreSQL** - Banco de dados principal

Content-Type: application/json

    password_hash TEXT NOT NULL,- **📦 Redis** - Cache distribuído

{

  "pixKey": "fraudador@email.com",    full_name TEXT,- **☁️ Azure** - Plataforma de nuvem

  "pixKeyType": "email",

  "amount": 5000.00,    cpf TEXT,

  "transactionId": "E12345678",

  "victimBank": "Banco do Brasil",    phone TEXT,### Qualidade & Testes

  "description": "Descrição detalhada da fraude"

}    bank TEXT,- **🧪 JUnit 5** - Testes unitários



Resposta: 201 Created    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,- **🎭 Mockito** - Mocking para testes

{

  "reportId": "660e8400-e29b-41d4-a716-446655440001",    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,- **🔍 SonarQube** - Análise de código

  "pixKey": "fraudador@email.com",

  "amount": 5000.00,    last_login DATETIME,- **📊 Actuator** - Monitoramento e métricas

  "status": "pending",

  "riskScore": 45,    is_active BOOLEAN DEFAULT 1,

  "createdAt": "2024-10-24T10:30:00Z"

}    two_factor_enabled BOOLEAN DEFAULT 0---

```

);

#### Listar Relatórios

```## 🔧 Pré-requisitos

```http

GET /api/v1/reports?status=pending&limit=20&offset=0

Authorization: Bearer {token}

### Fraud Reports Table### Desenvolvimento Local

Resposta: 200 OK

{```sql- Java 17 LTS

  "reports": [...],

  "total": 100,CREATE TABLE fraud_reports (- Docker Desktop

  "limit": 20,

  "offset": 0    id TEXT PRIMARY KEY,- Maven 3.8+

}

```    user_id TEXT NOT NULL,- PostgreSQL (ou via Docker)



### Endpoints de Notificações    pix_key TEXT NOT NULL,- Python 3.x ou Node.js (para frontend)



#### Registrar Token FCM    pix_key_type TEXT NOT NULL,



```http    amount REAL NOT NULL,---

POST /api/v1/users/fcm-token

Authorization: Bearer {token}    transaction_id TEXT,

Content-Type: application/json

    victim_bank TEXT NOT NULL,## 🚀 Execução Local

{

  "userId": "550e8400-e29b-41d4-a716-446655440000",    fraudster_bank TEXT,

  "fcmToken": "fGcI-8xqTQmX7Y..."

}    description TEXT,### 📊 Dashboard Frontend (Demo Rápido)



Resposta: 200 OK    status TEXT DEFAULT 'pending',

{

  "success": true,    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,```powershell

  "message": "Token FCM registrado com sucesso"

}    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,# Iniciar frontend dashboard

```

    FOREIGN KEY (user_id) REFERENCES users(id)cd frontend

#### Criar Notificação

);python -m http.server 8080

```http

POST /api/v1/notifications/create```# Acesse: http://localhost:8080

Authorization: Bearer {token}

Content-Type: application/json```



{### Notifications Table

  "userId": "550e8400-e29b-41d4-a716-446655440000",

  "type": "fraud_alert",```sql### 🏗️ Setup Completo do Sistema

  "title": "Novo Alerta de Fraude",

  "message": "Atividade suspeita detectada",CREATE TABLE notifications (

  "icon": "warning",

  "color": "red"    id TEXT PRIMARY KEY,```powershell

}

    user_id TEXT NOT NULL,# 1. Setup completo (infraestrutura + backend)

Resposta: 201 Created

{    fraud_report_id TEXT,.\scripts\setup-local.ps1

  "notificationId": "770e8400-e29b-41d4-a716-446655440002",

  "deliveryStatus": "sent_via_websocket"    type TEXT NOT NULL,

}

```    title TEXT NOT NULL,# 2. Testar APIs



### Health Check    message TEXT NOT NULL,.\scripts\test-api.ps1



```http    icon TEXT,

GET /health

    color TEXT,# 3. Iniciar frontend  

Resposta: 200 OK

{    read_at DATETIME,.\scripts\start-frontend.ps1

  "status": "healthy",

  "timestamp": "2024-10-24T10:30:00Z",    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,```

  "uptime": 86400,

  "services": {    FOREIGN KEY (user_id) REFERENCES users(id),

    "database": "connected",

    "websocket": "running",    FOREIGN KEY (fraud_report_id) REFERENCES fraud_reports(id)### 🔧 Execução Manual dos Serviços

    "firebase": "connected"

  });

}

`````````bash



## Instalação e Configuração# 1. Infraestrutura



### Pré-requisitos### FCM Tokens Tabledocker-compose up -d postgres redis rabbitmq



**Software Necessário**```sql

- Node.js versão 18.0.0 ou superior

- npm versão 8.0.0 ou superiorCREATE TABLE user_fcm_tokens (# 2. API Gateway

- Python 3.8 ou superior (para servidor de desenvolvimento)

- Git versão 2.30 ou superior    user_id TEXT PRIMARY KEY,cd microservices/api-gateway

- Navegador web moderno com suporte a WebSocket e Service Worker

    fcm_token TEXT NOT NULL,mvn spring-boot:run

**Contas Necessárias**

- Conta Firebase com projeto criado    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

- Conta de provedor de nuvem (Railway, Heroku, Azure ou AWS) para produção

- Nome de domínio (opcional) para configuração de domínio personalizado    FOREIGN KEY (user_id) REFERENCES users(id)# 3. Executar microsserviços (terminais separados)



### Configuração de Desenvolvimento Local);cd microservices/fraud-report-service



#### Etapa 1: Clonar o Repositório```mvn spring-boot:run



```powershell

git clone https://github.com/MatheusGino71/A3-sistemas.git

cd A3-sistemas/sentinela-pix## API Documentationcd microservices/risk-analysis-service  

```

mvn spring-boot:run

#### Etapa 2: Configurar Backend

### Authentication Endpoints

```powershell

cd backendcd microservices/notification-service

npm install

```**Register User**mvn spring-boot:run



#### Etapa 3: Configuração de Variáveis de Ambiente```http



Criar arquivo `.env` no diretório `backend/`:POST /api/v1/auth/register# 4. Frontend



```envContent-Type: application/jsoncd frontend

PORT=3001

JWT_SECRET=sua_chave_secreta_jwt_minimo_32_caracterespython -m http.server 8080

DATABASE_PATH=./database.sqlite

NODE_ENV=development{```

CORS_ORIGIN=http://localhost:8080

```  "email": "user@example.com",



#### Etapa 4: Configuração do Firebase  "password": "securePassword123",### 📱 URLs dos Serviços



Atualizar `frontend/firebase-config.js` com suas credenciais do Firebase:  "full_name": "John Doe",



```javascript  "cpf": "12345678901",- **Dashboard**: <http://localhost:8080>

const firebaseConfig = {

  apiKey: "sua_api_key",  "phone": "+5511999999999",- **API Gateway**: <http://localhost:8080/api>

  authDomain: "seu-projeto.firebaseapp.com",

  projectId: "seu-projeto-id",  "bank": "Banco do Brasil"- **Fraud Report Service**: <http://localhost:8081>

  storageBucket: "seu-projeto.appspot.com",

  messagingSenderId: "seu_sender_id",}- **Risk Analysis Service**: <http://localhost:8082>

  appId: "seu_app_id",

  measurementId: "seu_measurement_id"- **Notification Service**: <http://localhost:8083>

};

```Response: 201 Created- **Swagger UI**: <http://localhost:8080/swagger-ui.html>



#### Etapa 5: Configuração da Chave VAPID{



Gerar chaves VAPID no Console do Firebase (Configurações do Projeto > Cloud Messaging > Certificados Web Push).  "userId": "uuid",---



Atualizar `frontend/user-system.js` linha 133:  "email": "user@example.com",



```javascript  "token": "jwt_token"## 🧪 Testes

this.fcmToken = await getToken(messaging, {

  vapidKey: 'SUA_CHAVE_PUBLICA_VAPID_DO_CONSOLE_FIREBASE'}

});

``````### Testes Unitários



## Execução Local```bash



### Iniciar Servidor Backend**Login**# Executar todos os testes



```powershell```httpmvn test

cd backend

node server.jsPOST /api/v1/auth/login

```

Content-Type: application/json# Executar testes com coverage

Saída esperada do console:

```mvn test jacoco:report

Database initialized successfully

Sentinela PIX Backend running on port 3001{

WebSocket available at: ws://localhost:3001/ws

Real-time notifications enabled via WebSocket  "email": "user@example.com",# Testes específicos por serviço

```

  "password": "securePassword123"cd microservices/fraud-report-service

### Iniciar Servidor Frontend

}mvn test

```powershell

cd frontend```

python -m http.server 8080

```Response: 200 OK



### Acessar a Aplicação{### Testes de Integração



Abrir navegador web e navegar para:  "userId": "uuid",```bash

- Página Inicial: http://localhost:8080

- Registro de Usuário: http://localhost:8080/cadastro.html  "email": "user@example.com",# Testes end-to-end

- Login: http://localhost:8080/login.html

- Dashboard: http://localhost:8080/dashboard.html (após login)  "token": "jwt_token",.\scripts\test-integration.ps1

- Perfil de Usuário: http://localhost:8080/profile.html (após login)

- Configurações: http://localhost:8080/settings.html (após login)  "expiresIn": 3600



## Testes}# Teste de carga



### Procedimentos de Teste Manual```.\scripts\test-load.ps1



#### 1. Registro e Autenticação de Usuário```



**Passos de Teste**### Fraud Report Endpoints

- Navegar para http://localhost:8080/cadastro.html

- Preencher formulário de registro com dados válidos---

- Verificar validação de formato de email

- Testar requisitos de força de senha (mínimo 8 caracteres)**Create Report**

- Submeter registro

- Verificar registro bem-sucedido e login automático```http## 📊 Monitoramento e Observabilidade

- Testar funcionalidade de logout

- Testar login com credenciais criadasPOST /api/v1/reports



#### 2. Teste de Conexão WebSocketAuthorization: Bearer {token}### Métricas Disponíveis



**Passos de Teste**Content-Type: application/json- **📈 Throughput**: Requisições por segundo

- Abrir ferramentas de desenvolvedor do navegador (F12)

- Navegar para dashboard após login- **⏱️ Latência**: Tempo de resposta médio

- Verificar aba Console para mensagens de conexão:

  - "WebSocket connected for real-time notifications"{- **🚨 Taxa de Erro**: Percentual de falhas

  - "User {userId} identified via WebSocket"

- Verificar indicador de status de conexão na UI  "pixKey": "fraudster@email.com",- **💾 Uso de Recursos**: CPU, Memória, Rede

- Testar reconexão fechando e reabrindo a aba

  "pixKeyType": "email",

#### 3. Permissão de Notificação Push

  "amount": 5000.00,### Dashboards

**Passos de Teste**

- Navegar para dashboard  "transactionId": "E12345678",- **Grafana**: Visualização de métricas

- Navegador deve solicitar permissão de notificação automaticamente

- Conceder permissão quando solicitado  "victimBank": "Banco do Brasil",- **Prometheus**: Coleta de métricas

- Verificar no console: "FCM token obtained: {token}"

- Verificar que token está salvo no backend  "description": "Detailed fraud description"- **ELK Stack**: Logs centralizados

- Testar revogação de permissão de notificação e nova solicitação

}- **Jaeger**: Tracing distribuído

#### 4. Criar Notificação de Teste



Abrir console do navegador e executar:

Response: 201 Created---

```javascript

fetch('http://localhost:3001/api/v1/notifications/create', {{

  method: 'POST',

  headers: {  "reportId": "uuid",## ☁️ Deploy em Azure

    'Content-Type': 'application/json',

    'Authorization': 'Bearer ' + localStorage.getItem('token')  "status": "pending",

  },

  body: JSON.stringify({  "createdAt": "2024-10-24T10:30:00Z"### Recursos Azure Utilizados

    userId: localStorage.getItem('userId'),

    type: 'test',}- **🎯 Azure Kubernetes Service (AKS)** - Orquestração de containers

    title: 'Notificação de Teste',

    message: 'Esta é uma notificação de teste via WebSocket',```- **📦 Azure Container Registry (ACR)** - Registry de imagens Docker

    icon: 'info',

    color: 'blue'- **🗄️ Azure Database for PostgreSQL** - Banco de dados gerenciado

  })

})**List Reports**- **🚀 Azure Service Bus** - Mensageria (alternativa ao RabbitMQ)

.then(response => response.json())

.then(data => console.log('Notificação criada:', data))```http- **📊 Azure Monitor** - Observabilidade e alertas

.catch(error => console.error('Erro:', error));

```GET /api/v1/reports?status=pending&limit=20&offset=0



Resultados esperados:Authorization: Bearer {token}### Pipeline CI/CD

- Notificação toast aparece na UI imediatamente

- Contador de badge de notificação incrementa```yaml

- Console do backend mostra: "Notificação enviada via WebSocket para usuário {userId}"

Response: 200 OK# .github/workflows/azure-deploy.yml

#### 5. Teste de Perfil e Configurações

{name: Deploy to Azure

**Passos de Teste**

- Clicar no avatar do usuário no dashboard  "reports": [...],on:

- Selecionar "Meu Perfil" do menu dropdown

- Testar edição de informações de perfil  "total": 100,  push:

- Salvar alterações e verificar persistência

- Testar mudança de senha com verificação de senha atual  "limit": 20,    branches: [main]

- Navegar para página de Configurações

- Testar alternância de tema (claro/escuro/automático)  "offset": 0jobs:

- Alternar preferências de notificação

- Verificar que configurações são salvas no localStorage}  deploy:



### Monitoramento do Backend```    runs-on: ubuntu-latest



#### Verificar Conexões WebSocket Ativas    steps:



Terminal do backend exibirá:### Risk Analysis Endpoints      - uses: actions/checkout@v3

```

Nova conexão WebSocket estabelecida      - name: Build and Push to ACR

Usuário {userId} conectado via WebSocket

Usuário {userId} desconectado**Get Risk Score**      - name: Deploy to AKS

```

```http      - name: Run Integration Tests

#### Consultas ao Banco de Dados para Verificação

GET /api/v1/keys/{pixKey}/risk```

```powershell

cd backendAuthorization: Bearer {token}

sqlite3 database.sqlite

---

# Visualizar todas as tabelas

.tablesResponse: 200 OK



# Verificar usuários registrados{## 📁 Estrutura do Projeto

SELECT id, email, full_name, created_at FROM users;

  "pixKey": "fraudster@email.com",

# Verificar notificações

SELECT id, user_id, type, title, created_at FROM notifications ORDER BY created_at DESC LIMIT 10;  "riskLevel": "HIGH_RISK",```



# Verificar tokens FCM  "riskScore": 85,sentinela-pix/

SELECT user_id, updated_at FROM user_fcm_tokens;

  "reportCount": 5,├── 📄 README.md                    # Documentação principal

# Sair do SQLite

.exit  "firstReportDate": "2024-10-15T14:30:00Z",├── 📄 EXECUTIVE_SUMMARY.md         # Resumo executivo

```

  "lastReportDate": "2024-10-24T09:15:00Z"├── 📄 IMPLEMENTATION_GUIDE.md      # Guia de implementação

## Deploy em Produção

}├── 🐳 docker-compose.yml           # Orquestração de containers

### Opção 1: Railway.app

```├── 📂 microservices/              # Microsserviços backend

#### Passo 1: Criar Conta Railway

│   ├── api-gateway/               # Spring Cloud Gateway

Visitar https://railway.app e criar conta.

### Notification Endpoints│   ├── fraud-report-service/      # Serviço de denúncias

#### Passo 2: Criar Novo Projeto

│   ├── risk-analysis-service/     # Serviço de análise de risco

```powershell

# Instalar Railway CLI**Register FCM Token**│   └── notification-service/      # Serviço de notificações

npm install -g @railway/cli

```http├── 📂 frontend/                   # Dashboard web

# Login

railway loginPOST /api/v1/users/fcm-token│   ├── index.html                # Interface principal



# Inicializar projetoAuthorization: Bearer {token}│   ├── dashboard.js              # Lógica JavaScript

cd backend

railway initContent-Type: application/json│   ├── styles.css                # Estilos customizados



# Vincular a projeto existente ou criar novo│   └── README.md                 # Documentação frontend

railway link

```{├── 📂 scripts/                   # Scripts de automação



#### Passo 3: Configurar Variáveis de Ambiente  "userId": "uuid",│   ├── setup-local.ps1          # Setup completo



No dashboard da Railway:  "fcmToken": "fcm_device_token"│   ├── test-api.ps1             # Teste das APIs

1. Ir para seu projeto

2. Clicar na aba "Variables"}│   ├── test-integration.ps1     # Testes de integração

3. Adicionar todas as variáveis do arquivo `.env`

4. Garantir que variável `PORT` não está definida (Railway atribui automaticamente)│   └── deploy-azure.ps1         # Deploy para Azure



#### Passo 4: DeployResponse: 200 OK└── 📂 docs/                     # Documentação adicional



```powershell{    ├── api-spec.yaml            # OpenAPI Specification

railway up

```  "success": true,    ├── architecture.md          # Detalhes arquiteturais



#### Passo 5: Obter URL de Deploy  "message": "FCM token registered successfully"    └── deployment.md            # Guia de deploy



Railway fornecerá uma URL como: `https://sentinela-pix-backend.railway.app`}```



### Opção 2: Firebase Hosting (Frontend)```



#### Passo 1: Instalar Firebase CLI---



```powershell**Create Notification**

npm install -g firebase-tools

``````http## 🎯 Requisitos Atendidos



#### Passo 2: Login no FirebasePOST /api/v1/notifications/create



```powershellAuthorization: Bearer {token}| Requisito/Diferencial | Implementação na Solução Sentinela PIX |

firebase login

```Content-Type: application/json|----------------------|----------------------------------------|



#### Passo 3: Inicializar Firebase| **🔧 Desenvolvimento de Aplicações** | 4 microsserviços distintos e funcionais |



```powershell{| **🧠 Lógica de Programação** | Regras de negócio no risk-analysis-service e validações no fraud-report-service |

cd sentinela-pix

firebase init hosting  "userId": "uuid",| **☕ Linguagem Java** | Todos os microsserviços em Java 17+ |

```

  "type": "fraud_alert",| **🌐 REST API** | Cada microsserviço expõe APIs REST (POST /reports, GET /keys/{key}/risk) |

Configuração:

- Diretório público: frontend  "title": "New Fraud Alert",| **🗄️ Conexão a Banco de Dados** | PostgreSQL com Spring Data JPA |

- App de página única: Não

- Builds automáticos: Não  "message": "Suspicious activity detected",| **🍃 Uso de Spring Boot** | Base de toda arquitetura, simplificando configuração e criação das APIs |



#### Passo 4: Atualizar firebase.json  "icon": "warning",| **🏗️ Arquitetura de Microsserviços** | Solução nativamente desenhada com essa arquitetura |



```json  "color": "red"| **🐳 Containers Docker** | Cada microsserviço empacotado em imagem Docker |

{

  "hosting": {}| **☁️ Integração em Cloud Azure** | Deploy via Azure Container Registry (ACR) e Azure Kubernetes Service (AKS) |

    "public": "frontend",

    "ignore": [| **📚 Controle de Versionamento** | Projeto hospedado no GitHub com monorepo |

      "firebase.json",

      "**/.*",Response: 201 Created| **🧪 Testes Unitários** | JUnit 5 e Mockito para testes de Serviços e Controladores |

      "**/node_modules/**"

    ],{

    "headers": [

      {  "notificationId": "uuid",---

        "source": "**/*.@(js|css)",

        "headers": [  "deliveryStatus": "sent_via_websocket"

          {

            "key": "Cache-Control",}## 🔮 Roadmap Futuro

            "value": "max-age=31536000"

          }```

        ]

      }### Fase 1: MVP (Atual)

    ]

  }**Get User Notifications**- ✅ Microsserviços base

}

``````http- ✅ APIs REST funcionais



#### Passo 5: DeployGET /api/v1/notifications?unread=true&limit=50- ✅ Dashboard de monitoramento



```powershellAuthorization: Bearer {token}- ✅ Documentação completa

firebase deploy --only hosting

```



### Checklist de ProduçãoResponse: 200 OK### Fase 2: Melhorias



#### Segurança{- 🔄 Machine Learning para detecção de padrões



- [ ] Alterar todas as senhas e secrets padrão  "notifications": [...],- 📱 App mobile para denúncias

- [ ] Gerar secret JWT forte (mínimo 32 caracteres)

- [ ] Habilitar HTTPS/SSL para todos os endpoints  "unreadCount": 5,- 🔔 Notificações push em tempo real

- [ ] Configurar WebSocket seguro (WSS)

- [ ] Configurar CORS com origens específicas  "total": 50- 🌐 API pública para terceiros

- [ ] Habilitar rate limiting

- [ ] Configurar headers de segurança (Helmet.js)}

- [ ] Remover declarações console.log do código de produção

- [ ] Configurar Web Application Firewall (WAF)```### Fase 3: Escala

- [ ] Habilitar proteção DDoS

- 🚀 Deploy multi-região

#### Performance

**Mark Notification as Read**- 📊 Analytics avançados

- [ ] Habilitar compressão de resposta (gzip/brotli)

- [ ] Configurar CDN para assets estáticos```http- 🔒 Blockchain para auditoria

- [ ] Configurar pool de conexões de banco de dados

- [ ] Habilitar caching (Redis recomendado)PUT /api/v1/notifications/{notificationId}/read- 🤖 IA para prevenção proativa

- [ ] Otimizar queries de banco de dados com índices

- [ ] Minificar arquivos JavaScript e CSSAuthorization: Bearer {token}

- [ ] Otimizar imagens (formato WebP)

- [ ] Habilitar lazy loading para imagens---

- [ ] Configurar headers de cache apropriados

Response: 200 OK

#### Monitoramento

{## � Como Executar o Projeto

- [ ] Configurar rastreamento de erros (Sentry, Rollbar)

- [ ] Configurar monitoramento de aplicação (New Relic, DataDog)  "success": true,

- [ ] Configurar agregação de logs (ELK Stack, Splunk)

- [ ] Configurar monitoramento de uptime (UptimeRobot, Pingdom)  "notificationId": "uuid"### 🎯 Execução Rápida (Demo Funcional)

- [ ] Configurar alertas para erros críticos

- [ ] Configurar monitoramento de performance}

- [ ] Habilitar monitoramento de queries de banco de dados

- [ ] Configurar monitoramento de conexões WebSocket```O projeto possui uma versão completa funcional com backend Node.js e frontend responsivo:



## Segurança



### Autenticação e Autorização### Health Check```powershell



**Medidas Implementadas**# 1. Clone o repositório

- Tokens JWT com tempo de expiração de 1 hora

- Hash seguro de senhas com bcryptjs (10 salt rounds)```httpgit clone https://github.com/MatheusGino71/A3-sistemas.git

- Requisitos de complexidade de senha (mínimo 8 caracteres)

- Gerenciamento de sessão com atualização automática de tokenGET /healthcd A3-sistemas

- Suporte a autenticação de dois fatores (framework implementado)

- Bloqueio de conta após tentativas de login falhadas (configurável)



### Proteção de DadosResponse: 200 OK# 2. Instalar dependências do backend



**Práticas de Segurança**{cd backend

- Validação e sanitização de entrada em todos os endpoints

- Prevenção de injeção SQL via queries parametrizadas  "status": "healthy",npm install

- Prevenção de ataque XSS com política de segurança de conteúdo

- Implementação de token CSRF para operações que alteram estado  "timestamp": "2024-10-24T10:30:00Z",

- Headers HTTP seguros (middleware Helmet)

- Criptografia de dados em repouso (recomendado no nível de banco de dados)  "uptime": 86400,# 3. Iniciar backend (Terminal 1)

- Criptografia de dados em trânsito (HTTPS/WSS obrigatório em produção)

  "services": {npm start

### Segurança de Rede

    "database": "connected",# ✅ Backend rodando em http://localhost:3001

**Configurações de Segurança**

- HTTPS enforçado em ambiente de produção    "websocket": "running",

- WebSocket Seguro (WSS) para comunicação em tempo real

- Configuração de CORS restrita a origens conhecidas    "firebase": "connected"# 4. Iniciar frontend (Terminal 2)

- Rate limiting para prevenir ataques DDoS (100 req/min por IP)

- Limites de tamanho de requisição (10MB para uploads)  }cd ../frontend

- Regras de firewall para infraestrutura backend

- Autenticação de API obrigatória para todos os endpoints protegidos}python -m http.server 8080



### Conformidade com Privacidade```# ✅ Dashboard disponível em http://localhost:8080



**Considerações LGPD**```

- Considerações de conformidade com LGPD implementadas

- Gerenciamento de consentimento do usuário para coleta de dados## WebSocket Protocol

- Funcionalidade de exportação de dados (formato JSON)

- Exclusão de conta com purga de dados### 🌟 Funcionalidades Disponíveis

- Política de privacidade e termos de serviço

- Logging de auditoria para operações sensíveis### Connection

- Políticas de retenção de dados (configurável)

```- **📊 Dashboard Interativo**: KPIs em tempo real, gráficos dinâmicos

## Monitoramento

ws://localhost:3001/ws (development)- **🚨 Sistema de Denúncias**: Criar, visualizar e gerenciar denúncias

### Métricas de Aplicação

wss://production-url/ws (production)- **📈 Análise de Risco**: Score automático baseado em denúncias

**Métricas Rastreadas**

- Tempos de requisição/resposta com percentis (p50, p95, p99)```- **🔔 Notificações**: Sistema de alertas para instituições

- Taxas de erro por endpoint e tipo de erro

- Contagem de conexões WebSocket ativas- **📱 Interface Responsiva**: Funciona em desktop e mobile

- Performance de queries de banco de dados

- Uso de memória e métricas de garbage collection### Message Format

- Utilização de CPU

- Throughput de rede### 🛠️ Stack Técnica da Demo



### Estratégia de Logging**Client to Server: Identification**



**Configuração de Logs**```json- **Frontend**: HTML5, CSS3, JavaScript (Vanilla), Tailwind CSS

- Formato de logging estruturado (JSON)

- Níveis de log: DEBUG, INFO, WARN, ERROR, FATAL{- **Backend**: Node.js, Express.js, CORS

- Agregação centralizada de logs (ELK Stack recomendado)

- Política de retenção de logs (30 dias para INFO, 90 dias para ERROR)  "type": "identify",- **API**: RESTful com dados mock para demonstração

- Trilha de auditoria para operações sensíveis

- IDs de correlação para rastreamento de requisições  "userId": "uuid"- **Funcional**: Totalmente operacional sem dependências externas



### Health Checks}



**Verificações Implementadas**```---

- Endpoint `/health` para verificação básica de saúde

- Verificação de conectividade de banco de dados

- Status do servidor WebSocket

- Disponibilidade de serviços Firebase**Server to Client: Notification**## �👥 Equipe de Desenvolvimento

- Monitoramento de espaço em disco

- Verificação de disponibilidade de memória```json



## Estrutura do Projeto{- **Arquiteto de Soluções**: Design da arquitetura de microsserviços



```  "type": "notification",- **Desenvolvedor Backend**: Implementação Java/Spring Boot

sentinela-pix/

├── backend/  "data": {- **Desenvolvedor Frontend**: Dashboard e interfaces

│   ├── server.js                 # Aplicação principal Express com WebSocket

│   ├── package.json              # Dependências e scripts Node.js    "id": "uuid",- **DevOps Engineer**: Docker, Azure, CI/CD

│   ├── database.sqlite           # Arquivo de banco de dados SQLite

│   ├── DEPLOY.md                 # Documentação de deploy do backend    "type": "fraud_alert",- **QA Engineer**: Testes automatizados e qualidade

│   └── Procfile                  # Configuração de deploy Heroku

│    "title": "New Fraud Report",

├── frontend/

│   ├── index.html                # Página inicial    "message": "A new fraud has been reported",---

│   ├── login.html                # Página de autenticação

│   ├── cadastro.html             # Página de registro de usuário    "icon": "warning",

│   ├── dashboard.html            # Dashboard principal da aplicação

│   ├── profile.html              # Gerenciamento de perfil de usuário (482 linhas)    "color": "red",## 📚 Referências e Estudos

│   ├── settings.html             # Configurações da aplicação (468 linhas)

│   ├── dashboard.js              # Lógica do dashboard e visualização de dados    "timestamp": "2024-10-24T10:30:00Z"

│   ├── user-system.js            # Sistema de usuário/notificação (548 linhas)

│   ├── styles.css                # Estilos customizados e tema  }- [Regulamento PIX - Banco Central](https://www.bcb.gov.br/estabilidadefinanceira/pix)

│   ├── firebase-config.js        # Configuração do Firebase SDK

│   ├── firebase-messaging-sw.js  # Service worker FCM (56 linhas)}- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)

│   ├── backend-config.js         # Configuração de endpoint da API backend

│   └── README.md                 # Documentação específica do frontend```- [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/)

│

├── microservices/                # Arquitetura de microsserviços planejada- [Microservices Patterns](https://microservices.io/patterns/)

│   ├── api-gateway/              # Spring Cloud Gateway

│   ├── fraud-report-service/     # Microsserviço de relatórios de fraude**Client to Server: Notification Read**- [Fraud Detection Best Practices](https://www.feedzai.com/fraud-detection-guide/)

│   ├── risk-analysis-service/    # Microsserviço de pontuação de risco

│   └── notification-service/     # Microsserviço de entrega de notificações```json

│

├── sentinela-pix-bradesco/       # Implementação específica Bradesco{---

│   ├── query-service/            # Microsserviço de consulta com PostgreSQL

│   ├── report-service/           # Serviço de geração de relatórios  "type": "notification_read",

│   └── web-interface/            # Interface web customizada

│  "notificationId": "uuid"**Projeto Sentinela PIX** - Combatendo fraudes PIX através de tecnologia e colaboração entre instituições financeiras.

├── docs/

│   ├── API-DOCUMENTATION.md      # Referência completa da API}

│   ├── DEPLOYMENT-GUIDE.md       # Guia abrangente de deployment

│   ├── FIREBASE-INTEGRATION.md   # Guia de integração Firebase```*Desenvolvido como solução acadêmica para o combate à fraude no sistema PIX brasileiro.*

│   └── NOTIFICATION-SYSTEM.md    # Detalhes do sistema de notificações

│## Installation and Setup

├── firebase.json                 # Configuração do projeto Firebase

├── firestore.rules               # Regras de segurança Firestore### Prerequisites

├── firestore.indexes.json        # Índices do banco de dados Firestore

├── docker-compose.yml            # Orquestração Docker- Node.js v18.0.0 or higher

├── .gitignore                    # Regras do Git ignore- Python 3.8+ (for frontend development server)

└── README.md                     # Este arquivo - Documentação principal do projeto- Git version control system

```- Firebase account with project created

- Modern web browser with WebSocket and Service Worker support

## Contribuição- Text editor or IDE (VS Code recommended)



Este é um projeto acadêmico desenvolvido para fins educacionais. Contribuições são bem-vindas nas seguintes áreas:### Local Development Setup



**Áreas de Contribuição****1. Clone the Repository**

- Correção de bugs```powershell

- Melhorias de documentaçãogit clone https://github.com/MatheusGino71/A3-sistemas.git

- Implementação de novas funcionalidadescd A3-sistemas/sentinela-pix

- Adição de cobertura de testes```

- Otimizações de performance

- Identificação e correção de vulnerabilidades de segurança**2. Backend Setup**

```powershell

### Diretrizes de Contribuiçãocd backend

npm install

1. Fazer fork do repositório```

2. Criar branch de feature (`git checkout -b feature/funcionalidade-incrivel`)

3. Fazer commit das alterações (`git commit -m 'Adiciona funcionalidade incrível'`)**3. Environment Configuration**

4. Push para o branch (`git push origin feature/funcionalidade-incrivel`)

5. Abrir Pull Request com descrição detalhadaCreate `.env` file in the backend directory:

```env

## LicençaPORT=3001

JWT_SECRET=your_secure_jwt_secret_key_minimum_32_characters

Este projeto é desenvolvido para fins acadêmicos como parte do curso A3 de Sistemas. Todos os direitos reservados à equipe de desenvolvimento.DATABASE_PATH=./database.sqlite

NODE_ENV=development

## AgradecimentosCORS_ORIGIN=http://localhost:8080

```

- Firebase pelos serviços de autenticação, banco de dados e mensagens

- Comunidade Express.js pelo framework backend robusto**4. Firebase Configuration**

- Tailwind CSS pelo framework CSS utility-first

- Banco Central do Brasil pela documentação e especificações do sistema PIXUpdate `frontend/firebase-config.js` with your Firebase project credentials:

- Protocolo WebSocket pelo padrão de comunicação em tempo real```javascript

- SQLite pelo banco de dados embutido leveconst firebaseConfig = {

  apiKey: "your_api_key",

## Recursos Adicionais  authDomain: "your-project.firebaseapp.com",

  projectId: "your-project-id",

- Documentação do Firebase: https://firebase.google.com/docs  storageBucket: "your-project.appspot.com",

- Guia do Express.js: https://expressjs.com/pt-br/guide/routing.html  messagingSenderId: "your_sender_id",

- RFC do Protocolo WebSocket: https://tools.ietf.org/html/rfc6455  appId: "your_app_id",

- Documentação do Tailwind CSS: https://tailwindcss.com/docs  measurementId: "your_measurement_id"

- Regulamentação PIX - Banco Central: https://www.bcb.gov.br/estabilidadefinanceira/pix};

```

## Contato e Suporte

**5. VAPID Key Configuration**

**Repositório GitHub**: https://github.com/MatheusGino71/A3-sistemas

Generate VAPID keys in Firebase Console (Project Settings > Cloud Messaging > Web Push certificates).

**Rastreador de Issues**: https://github.com/MatheusGino71/A3-sistemas/issues

Update `frontend/user-system.js` line 133:

**Equipe do Projeto**:```javascript

- Arquitetura de Sistema e Desenvolvimento Backendthis.fcmToken = await getToken(messaging, {

- Desenvolvimento Frontend e Design UI/UX  vapidKey: 'YOUR_VAPID_PUBLIC_KEY_FROM_FIREBASE_CONSOLE'

- Design e Otimização de Banco de Dados});

- DevOps e Deployment```

- Documentação e Testes

**6. Start Backend Server**

## Status do Projeto```powershell

cd backend

**Versão Atual**: 1.0.0node server.js

```

**Data de Lançamento**: Outubro de 2024

Expected console output:

**Status**: Desenvolvimento Ativo```

Database initialized successfully

**Status de Build**: AprovadoSentinela PIX Backend running on port 3001

WebSocket available at: ws://localhost:3001/ws

**Cobertura de Testes**: Em ProgressoReal-time notifications enabled via WebSocket

```

### Funcionalidades Completadas

**7. Start Frontend Development Server**

- Sistema de autenticação e autorização de usuários```powershell

- Criação e gerenciamento completo de relatórios de fraude# Open new terminal window

- Sistema de notificações WebSocket em tempo realcd frontend

- Integração com Firebase Cloud Messagingpython -m http.server 8080

- Gerenciamento abrangente de perfil de usuário```

- Interface completa de configurações da aplicação

- Motor de análise de risco com algoritmo de pontuação**8. Access the Application**

- Dashboard interativo com análise

- Design responsivo para mobile e desktopOpen your web browser and navigate to:

- Documentação completa da API- **Landing Page**: http://localhost:8080

- Guias de deploy para múltiplas plataformas- **User Registration**: http://localhost:8080/cadastro.html

- **Login**: http://localhost:8080/login.html

### Em Progresso- **Dashboard**: http://localhost:8080/dashboard.html (after login)

- **User Profile**: http://localhost:8080/profile.html (after login)

- Integração de machine learning para detecção de padrões de fraude- **Settings**: http://localhost:8080/settings.html (after login)

- Desenvolvimento de aplicação mobile (React Native)

- Dashboard de análise avançada com modelos preditivos## Testing

- Rate limiting de API e throttling de requisições

- Suite de testes automatizados (unitários, integração, e2e)### Manual Testing Procedures



### Funcionalidades Planejadas**1. User Registration and Authentication**

- Navigate to http://localhost:8080/cadastro.html

- Deploy multi-região para disponibilidade global- Fill in registration form with valid data

- Trilha de auditoria baseada em blockchain para imutabilidade- Verify email format validation

- Prevenção de fraude alimentada por IA com pontuação em tempo real- Test password strength requirements (minimum 8 characters)

- API pública para integração de terceiros- Submit registration

- Relatórios avançados com templates customizados- Verify successful registration and automatic login

- Suporte multi-idioma (internacionalização)- Test logout functionality

- Melhorias de modo escuro e acessibilidade- Test login with created credentials

- Exportação de relatórios em formatos adicionais (Excel, Word)

- Integração com principais bancos brasileiros**2. WebSocket Connection Testing**

- Suporte a notificações SMS- Open browser developer tools (F12)

- Suporte a webhooks para sistemas externos- Navigate to dashboard after login

- Check Console tab for connection messages:

---  - "WebSocket connected for real-time notifications"

  - "User {userId} identified via WebSocket"

**Sentinela PIX** - Protegendo o ecossistema de pagamentos brasileiro através de tecnologia e colaboração.- Verify connection status indicator in UI

- Test reconnection by closing and reopening tab

**Desenvolvido como solução acadêmica para combater fraudes no sistema de pagamentos PIX brasileiro.**

**3. Push Notification Permission**

**Última Atualização**: Outubro de 2024- Navigate to dashboard

- Browser should automatically request notification permission
- Grant permission when prompted
- Check console for: "FCM token obtained: {token}"
- Verify token is saved to backend
- Test notification permission revocation and re-request

**4. Create Test Notification**

Open browser console and execute:
```javascript
fetch('http://localhost:3001/api/v1/notifications/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    userId: localStorage.getItem('userId'),
    type: 'test',
    title: 'Test Notification',
    message: 'This is a test notification via WebSocket',
    icon: 'info',
    color: 'blue'
  })
})
.then(response => response.json())
.then(data => console.log('Notification created:', data))
.catch(error => console.error('Error:', error));
```

Expected results:
- Toast notification appears in UI immediately
- Notification badge counter increments
- Backend console shows: "Notification sent via WebSocket to user {userId}"

**5. Profile and Settings Testing**
- Click on user avatar in dashboard
- Select "My Profile" from dropdown menu
- Test profile information editing
- Save changes and verify persistence
- Test password change with current password verification
- Navigate to Settings page
- Test theme switching (light/dark/auto)
- Toggle notification preferences
- Verify settings are saved to localStorage

### Backend Monitoring

**Check Active WebSocket Connections**

Backend terminal will display:
```
New WebSocket connection established
User {userId} connected via WebSocket
User {userId} disconnected
```

**Database Queries for Verification**

```powershell
cd backend
sqlite3 database.sqlite

# View all tables
.tables

# Check registered users
SELECT id, email, full_name, created_at FROM users;

# Check notifications
SELECT id, user_id, type, title, created_at FROM notifications ORDER BY created_at DESC LIMIT 10;

# Check FCM tokens
SELECT user_id, updated_at FROM user_fcm_tokens;

# Exit SQLite
.exit
```

## Deployment

### Firebase Hosting (Frontend Deployment)

**1. Install Firebase CLI**
```powershell
npm install -g firebase-tools
```

**2. Authenticate with Firebase**
```powershell
firebase login
```

**3. Initialize Firebase in Project**
```powershell
cd sentinela-pix
firebase init hosting
```

Select options:
- Use existing project
- Set public directory to: `frontend`
- Configure as single-page app: No
- Set up automatic builds: No

**4. Deploy to Firebase Hosting**
```powershell
firebase deploy --only hosting
```

Your application will be available at: `https://your-project-id.web.app`

### Backend Deployment Options

**Option 1: Railway.app**

1. Create account at https://railway.app
2. Create new project from GitHub repository
3. Select backend folder as root directory
4. Configure environment variables:
   - PORT=3001
   - JWT_SECRET=(generate secure secret)
   - NODE_ENV=production
   - CORS_ORIGIN=(your frontend URL)
5. Deploy automatically on git push to main branch

**Option 2: Heroku**

```powershell
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create new application
heroku create sentinela-pix-backend

# Set environment variables
heroku config:set JWT_SECRET=your_secure_secret
heroku config:set NODE_ENV=production

# Deploy
cd backend
git subtree push --prefix backend heroku main
```

**Option 3: Azure App Service**

1. Create Azure account and subscription
2. Create App Service in Azure Portal
3. Configure deployment from GitHub repository
4. Set application settings (environment variables)
5. Enable WebSocket support in Configuration
6. Deploy and monitor via Azure Portal

### Production Configuration Checklist

**Backend (server.js)**
- [ ] Update CORS origins for production domain
- [ ] Configure SSL certificates for secure WebSocket (WSS)
- [ ] Set production database connection (consider PostgreSQL)
- [ ] Enable rate limiting middleware
- [ ] Configure production logging service (Winston, Morgan)
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Enable compression middleware
- [ ] Configure security headers (Helmet)
- [ ] Set up backup strategy for database

**Frontend**
- [ ] Update `backend-config.js` with production API URL
- [ ] Update WebSocket URL for WSS (secure WebSocket)
- [ ] Enable production Firebase configuration
- [ ] Minify and optimize JavaScript files
- [ ] Optimize images and assets
- [ ] Enable CDN for static resources
- [ ] Configure caching headers
- [ ] Set up analytics tracking
- [ ] Test all functionality in production environment

## Project Structure

```
sentinela-pix/
├── backend/
│   ├── server.js                 # Main Express application with WebSocket
│   ├── package.json              # Node.js dependencies and scripts
│   ├── database.sqlite           # SQLite database file
│   ├── DEPLOY.md                 # Backend deployment documentation
│   └── Procfile                  # Heroku deployment configuration
│
├── frontend/
│   ├── index.html                # Landing page
│   ├── login.html                # User authentication page
│   ├── cadastro.html             # User registration page
│   ├── dashboard.html            # Main application dashboard
│   ├── profile.html              # User profile management (482 lines)
│   ├── settings.html             # Application settings (468 lines)
│   ├── dashboard.js              # Dashboard logic and data visualization
│   ├── user-system.js            # User/notification system (548 lines)
│   ├── styles.css                # Custom styles and theme
│   ├── firebase-config.js        # Firebase SDK configuration
│   ├── firebase-messaging-sw.js  # FCM service worker (56 lines)
│   ├── backend-config.js         # Backend API endpoint configuration
│   └── README.md                 # Frontend-specific documentation
│
├── microservices/                # Planned Java Spring Boot microservices
│   ├── api-gateway/              # Spring Cloud Gateway
│   ├── fraud-report-service/     # Fraud reporting microservice
│   ├── risk-analysis-service/    # Risk scoring microservice
│   └── notification-service/     # Notification delivery microservice
│
├── sentinela-pix-bradesco/       # Bradesco-specific implementation
│   ├── query-service/            # Query microservice with PostgreSQL
│   ├── report-service/           # Report generation service
│   └── web-interface/            # Custom web interface
│
├── docs/
│   ├── API-DOCUMENTATION.md      # Complete API reference (this file)
│   ├── DEPLOYMENT-GUIDE.md       # Comprehensive deployment guide
│   ├── FIREBASE-INTEGRATION.md   # Firebase setup and configuration
│   └── NOTIFICATION-SYSTEM.md    # Real-time notification system details
│
├── firebase.json                 # Firebase project configuration
├── firestore.rules               # Firestore security rules
├── firestore.indexes.json        # Firestore database indexes
├── docker-compose.yml            # Docker orchestration for services
├── .gitignore                    # Git ignore rules
└── README.md                     # This file - Main project documentation
```

## Security Considerations

### Authentication and Authorization
- JWT tokens with 1-hour expiration time
- Secure password hashing with bcryptjs (10 salt rounds)
- Password complexity requirements (minimum 8 characters, recommended: letters, numbers, symbols)
- Session management with automatic token refresh
- Two-factor authentication support (framework in place)
- Account lockout after failed login attempts (configurable)

### Data Protection
- Input validation and sanitization on all endpoints
- SQL injection prevention via parameterized queries
- XSS attack prevention with content security policy
- CSRF token implementation for state-changing operations
- Secure HTTP headers (Helmet middleware)
- Data encryption at rest (database-level encryption recommended)
- Data encryption in transit (HTTPS/WSS required in production)

### Network Security
- HTTPS enforced in production environment
- Secure WebSocket (WSS) for real-time communication
- CORS configuration restricted to known origins
- Rate limiting to prevent DDoS attacks (100 req/min per IP)
- Request size limits (10MB for uploads)
- Firewall rules for backend infrastructure
- API authentication required for all protected endpoints

### Privacy Compliance
- GDPR compliance considerations implemented
- User consent management for data collection
- Data export functionality (JSON format)
- Account deletion with data purging
- Privacy policy and terms of service
- Audit logging for sensitive operations
- Data retention policies (configurable)

## Performance Optimization

### Backend Optimizations
- Database connection pooling (10 connections)
- Query optimization with indexes
- Caching strategy with Redis (recommended for production)
- Response compression (gzip)
- Load balancing support (horizontal scaling ready)
- Async/await pattern for non-blocking operations
- Connection timeout management

### Frontend Optimizations
- Asset minification and compression
- Code splitting for faster initial load
- Lazy loading of images and components
- Browser caching with cache-control headers
- CDN integration for static assets
- Service Worker for offline functionality
- Debouncing and throttling for user inputs

### WebSocket Optimizations
- Connection pooling and reuse
- Message batching for bulk operations
- Compression for large payloads
- Heartbeat mechanism for connection health (30s interval)
- Automatic cleanup of stale connections
- Load balancing for WebSocket servers

## Monitoring and Observability

### Application Metrics
- Request/response times with percentiles (p50, p95, p99)
- Error rates by endpoint and error type
- Active WebSocket connections count
- Database query performance
- Memory usage and garbage collection metrics
- CPU utilization
- Network throughput

### Logging Strategy
- Structured logging format (JSON)
- Log levels: DEBUG, INFO, WARN, ERROR, FATAL
- Centralized log aggregation (ELK Stack recommended)
- Log retention policy (30 days for INFO, 90 days for ERROR)
- Audit trail for sensitive operations
- Correlation IDs for request tracing

### Health Checks
- `/health` endpoint for basic health
- Database connectivity check
- WebSocket server status
- Firebase service availability
- Disk space monitoring
- Memory availability check

### Alerting Rules
- Error rate > 5% for 5 minutes
- Response time > 1000ms for p95
- WebSocket disconnection rate > 10%
- Database connection failures
- Disk space < 10% free
- Memory usage > 90%

## Troubleshooting

### Common Issues and Solutions

**Issue: WebSocket Connection Fails**

Symptoms:
- Console error: "WebSocket connection failed"
- No real-time notifications received

Solutions:
1. Verify backend server is running on port 3001
2. Check browser console for specific error messages
3. Verify firewall allows WebSocket connections
4. Ensure user is authenticated (token in localStorage)
5. Check backend logs for connection attempts
6. Try clearing browser cache and localStorage
7. Test with different browser to rule out browser-specific issues

**Issue: Push Notifications Not Working**

Symptoms:
- No browser notification permission request
- FCM token not obtained
- Notifications not appearing

Solutions:
1. Verify VAPID key is correctly configured in user-system.js
2. Check browser notification permission status
3. Verify service worker is registered (check Application tab in DevTools)
4. Check console for FCM initialization errors
5. Verify FCM token is saved in backend database
6. Test in incognito mode to rule out permission issues
7. Ensure HTTPS is used in production (FCM requirement)

**Issue: Login/Authentication Failures**

Symptoms:
- "Invalid credentials" error
- Unable to access protected pages
- Token expiration errors

Solutions:
1. Verify Firebase configuration in firebase-config.js
2. Check network connectivity to Firebase services
3. Clear browser cache, localStorage, and cookies
4. Verify email/password are correct
5. Check Firebase Console for authentication errors
6. Ensure Firebase Authentication is enabled
7. Review backend JWT secret configuration

**Issue: Database Errors**

Symptoms:
- "Database locked" errors
- "Table doesn't exist" errors
- Data not persisting

Solutions:
1. Check database file permissions (read/write access)
2. Verify SQLite is properly installed
3. Check database schema is initialized on first run
4. Review server.js logs for database errors
5. Ensure no concurrent write operations
6. Try deleting database.sqlite and restarting (development only)
7. Check disk space availability

**Issue: CORS Errors**

Symptoms:
- "Blocked by CORS policy" in console
- API requests failing from frontend

Solutions:
1. Verify CORS origin matches frontend URL in server.js
2. Check CORS middleware is properly configured
3. Ensure requests include proper headers
4. Verify authentication token format
5. Test API endpoints with Postman/curl
6. Check production CORS configuration

## Contributing

This is an academic project developed for educational purposes. We welcome contributions in the following areas:

- **Bug Fixes**: Report and fix issues
- **Documentation**: Improve existing documentation
- **Features**: Propose and implement new features
- **Tests**: Add test coverage
- **Performance**: Optimize code and queries
- **Security**: Identify and fix security vulnerabilities

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request with detailed description

## License

This project is developed for academic purposes as part of the A3 Systems course at [University Name]. All rights reserved to the development team.

## Acknowledgments

- **Firebase**: For authentication, database, and messaging services
- **Express.js Community**: For the robust backend framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Brazilian Central Bank**: For PIX system documentation and specifications
- **WebSocket Protocol**: For real-time communication standard
- **SQLite**: For the lightweight embedded database

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [WebSocket Protocol RFC](https://tools.ietf.org/html/rfc6455)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PIX Regulations - Brazilian Central Bank](https://www.bcb.gov.br/estabilidadefinanceira/pix)

## Contact and Support

**GitHub Repository**: https://github.com/MatheusGino71/A3-sistemas

**Issue Tracker**: https://github.com/MatheusGino71/A3-sistemas/issues

**Project Team**:
- System Architecture and Backend Development
- Frontend Development and UI/UX Design
- Database Design and Optimization
- DevOps and Deployment
- Documentation and Testing

## Project Status

**Current Version**: 1.0.0

**Release Date**: October 2024

**Status**: Active Development

**Build Status**: Passing

**Test Coverage**: In Progress

### Completed Features
- User authentication and authorization system
- Complete fraud report creation and management
- Real-time WebSocket notification system
- Firebase Cloud Messaging integration
- Comprehensive user profile management
- Full-featured application settings interface
- Risk analysis engine with scoring algorithm
- Interactive dashboard with analytics
- Responsive design for mobile and desktop
- Complete API documentation
- Deployment guides for multiple platforms

### In Progress
- Machine learning integration for fraud pattern detection
- Mobile application development (React Native)
- Advanced analytics dashboard with predictive models
- API rate limiting and request throttling
- Automated testing suite (unit, integration, e2e)

### Planned Features
- Multi-region deployment for global availability
- Blockchain-based audit trail for immutability
- AI-powered fraud prevention with real-time scoring
- Public API for third-party integration
- Advanced reporting with custom templates
- Multi-language support (internationalization)
- Dark mode and accessibility improvements
- Export reports in additional formats (Excel, Word)
- Integration with major Brazilian banks
- SMS notification support
- Webhook support for external systems

---

**Sentinela PIX** - Protecting the Brazilian payment ecosystem through technology and collaboration.

*Developed as an academic solution to combat fraud in the Brazilian PIX payment system.*

*Last Updated: October 2024*
