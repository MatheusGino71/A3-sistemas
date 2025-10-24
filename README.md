# Sentinela PIX - Fraud Detection and Prevention Platform# Sentinela PIX - Fraud Detection and Prevention Platform



## Overview## Overview



Sentinela PIX is a comprehensive real-time fraud detection and prevention platform designed to combat PIX payment system scams in Brazil. The platform provides centralized fraud reporting, risk analysis, and automated notification systems to facilitate rapid response between financial institutions.Sentinela PIX is a comprehensive real-time fraud detection and prevention platform designed to combat PIX payment system scams in Brazil. The platform provides centralized fraud reporting, risk analysis, and automated notification systems to facilitate rapid response between financial institutions.



## Problem Statement## Problem Statement



The primary vulnerability in PIX fraud is time. Money transfers occur almost instantaneously, making blocking and recovery extremely difficult. The current banking system lacks a centralized mechanism for rapid fraud communication between different institutions.The primary vulnerability in PIX fraud is time. Money transfers occur almost instantaneously, making blocking and recovery extremely difficult. The current banking system lacks a centralized mechanism for rapid fraud communication between different institutions.



## Solution Architecture## Solution Architecture



The Sentinela PIX platform addresses this challenge through:The Sentinela PIX platform addresses this challenge through:



- **Rapid Notification System**: Creates an ultra-fast channel for victim institutions to communicate with fraud recipient institutions- **Rapid Notification System**: Creates an ultra-fast channel for victim institutions to communicate with fraud recipient institutions

- **Risk Scoring**: Analyzes and flags PIX keys and accounts that receive multiple fraud reports- **Risk Scoring**: Analyzes and flags PIX keys and accounts that receive multiple fraud reports

- **Prevention Mechanism**: Helps prevent future transactions to fraudulent accounts through real-time alerts- **Prevention Mechanism**: Helps prevent future transactions to fraudulent accounts through real-time alerts



## Technical Stack## 🚀 Demonstração



### Backend TechnologiesO projeto está totalmente funcional e pode ser executado localmente:

- **Node.js v18+**: JavaScript runtime for backend services

- **Express.js 4.18**: Web application framework- **🖥️ Dashboard Web**: http://localhost:8080

- **SQLite3**: Embedded database for data persistence- **🔧 API Backend**: http://localhost:3001/api/v1

- **bcryptjs**: Password hashing and authentication- **❤️ Health Check**: http://localhost:3001/health

- **jsonwebtoken**: JWT-based authentication system

- **ws (WebSocket)**: Real-time bidirectional communication library### Screenshots

- **node-cron**: Scheduled task management

<details>

### Frontend Technologies<summary>🖼️ Ver Capturas de Tela</summary>

- **HTML5 / CSS3**: Modern web standards

- **JavaScript ES6+**: Modern JavaScript with module system- Dashboard principal com KPIs em tempo real

- **Tailwind CSS 3.x**: Utility-first CSS framework- Sistema de denúncias interativo

- **Material Symbols**: Google's comprehensive icon system- Análise de risco por chave PIX

- Gráficos e relatórios detalhados

### Firebase Integration

- **Firebase Authentication**: User authentication and management</details>

- **Firebase Firestore**: Cloud-based NoSQL database

- **Firebase Cloud Messaging (FCM)**: Push notification service---

- **Firebase Hosting**: Static content hosting and delivery

## 🎭 Atores do Sistema

### Real-Time Communication

- **WebSocket Protocol**: Persistent bidirectional connections| Ator | Descrição | Responsabilidade |

- **Automatic Reconnection**: Exponential backoff strategy with polling fallback|------|-----------|-----------------|

- **Message Queue Architecture**: Event-driven notification system| **👤 Usuário Vítima** | Pessoa que foi vítima de golpe PIX | Inicia o processo de denúncia através do app de seu banco |

| **🏦 Instituição Financeira A** | Banco da Vítima | Consome a API do Sentinela PIX para registrar a denúncia de golpe |

## System Architecture| **🔒 Plataforma Sentinela PIX** | Nossa Solução | O cérebro da operação: recebe, processa, armazena e distribui as informações de fraude |

| **🏛️ Instituição Financeira B** | Banco do Golpista | É notificada pela plataforma para tomar ações de bloqueio preventivo na conta suspeita |

```

┌─────────────────────────────────────────────────────────────┐---

│                    Client Applications                       │

│  (Web Dashboard, Mobile Apps, Banking Interfaces)           │## 🏗️ Arquitetura de Microsserviços

└────────────────────────┬────────────────────────────────────┘

                         │### Visão Arquitetural

                         │ HTTPS / WSS

                         │```

┌────────────────────────▼────────────────────────────────────┐┌─────────────────┐    ┌─────────────────────┐    ┌──────────────────────┐

│                   Frontend Layer                             ││   App Bancário  │───▶│   API Gateway       │───▶│    Load Balancer     │

│  - User Interface (HTML/CSS/JavaScript)                     ││   (Banco A)     │    │ (Spring Cloud GW)   │    │                      │

│  - Firebase Authentication                                   │└─────────────────┘    └─────────────────────┘    └──────────────────────┘

│  - WebSocket Client                                         │                                  │

│  - FCM Service Worker                                       │                ┌─────────────────┼─────────────────┐

└────────────────────────┬────────────────────────────────────┘                │                 │                 │

                         │                ▼                 ▼                 ▼

                         │ REST API / WebSocket    ┌───────────────────┐ ┌─────────────────┐ ┌─────────────────┐

                         │    │ fraud-report-     │ │ risk-analysis-  │ │ notification-   │

┌────────────────────────▼────────────────────────────────────┐    │ service           │ │ service         │ │ service         │

│                   Backend Services                           │    │                   │ │                 │ │                 │

│  - Express.js REST API (Port 3001)                          │    │ • Recebe denúncias│ │ • Score de risco│ │ • Notifica bancos│

│  - WebSocket Server (ws://localhost:3001/ws)                │    │ • Valida dados    │ │ • 1→suspeita    │ │ • Webhooks       │

│  - Authentication & Authorization                            │    │ • Persiste no BD  │ │ • 3→alto risco  │ │ • REST API       │

│  - Business Logic & Validation                              │    │ • Publica eventos │ │ • Consulta keys │ │ • Auto notif.    │

└────────────────────────┬────────────────────────────────────┘    └───────────────────┘ └─────────────────┘ └─────────────────┘

                         │                │                 │                 │

                         │                └────────────────▼─────────────────┘

         ┌───────────────┼───────────────┐                        ┌─────────────────┐

         │               │               │                        │   RabbitMQ      │

         ▼               ▼               ▼                        │   (Mensageria)  │

┌────────────────┐ ┌─────────────┐ ┌──────────────┐                        │                 │

│ SQLite Database│ │  Firebase   │ │  File System │                        │ • NovaDenuncia  │

│                │ │  Firestore  │ │              │                        │ • Async Events  │

│ - Users        │ │  - Users    │ │ - Uploads    │                        │ • Pub/Sub       │

│ - Reports      │ │  - Profiles │ │ - Logs       │                        └─────────────────┘

│ - Notifications│ │  - Settings │ │ - Cache      │                                │

│ - FCM Tokens   │ │             │ │              │                        ┌─────────────────┐

└────────────────┘ └─────────────┘ └──────────────┘                        │   PostgreSQL    │

```                        │   (Database)    │

                        │                 │

## Core Features                        │ • Denúncias     │

                        │ • Scores PIX    │

### 1. User Management System                        │ • Históricos    │

                        └─────────────────┘

**Authentication**```

- Firebase Authentication integration

- Email/password authentication with validation### 🔧 Microsserviços Detalhados

- JWT token-based session management

- Secure password hashing with bcryptjs (10 rounds)#### 1️⃣ **api-gateway** (Gateway de API)

- Password change with reauthentication requirement- **Tecnologia**: Spring Boot + Spring Cloud Gateway

- Session expiration and automatic renewal- **Porta**: 8080

- Logout functionality with token invalidation- **Responsabilidade**: 

  - Ponto de entrada único para todas as requisições externas dos bancos

**User Profiles**  - Autenticação e autorização de APIs

- Complete profile management interface (profile.html)  - Roteamento inteligente para microsserviços

- Personal information editing (name, email, CPF, phone)  - Rate limiting e circuit breaker

- Bank institution selection (8 Brazilian banks supported)

- Avatar system with automatic initials generation**Endpoints Principais:**

- Two-factor authentication toggle```

- Account statistics dashboard (reports sent, frauds detected, success rate)POST /api/v1/reports          → fraud-report-service

- Data export functionality in JSON formatGET  /api/v1/keys/{key}/risk  → risk-analysis-service

- Account deletion with confirmation dialogPOST /api/v1/notifications    → notification-service

```

**Settings Management**

- Comprehensive settings interface (settings.html)#### 2️⃣ **fraud-report-service** (Serviço de Denúncias)

- Theme customization (light/dark/auto modes)- **Tecnologia**: Java 17+, Spring Boot, JPA/Hibernate

- Language preferences (Portuguese, English, Spanish)- **Porta**: 8081

- UI density control (comfortable, compact, spacious)- **Responsabilidade**:

- Notification preferences configuration  - Receber detalhes da denúncia (chave PIX do golpista, valor, horário, ID da transação)

- Privacy settings management  - Validar dados de entrada

- Security options (2FA, active sessions, login history)  - Persistir denúncias no PostgreSQL

- Developer mode toggle  - Publicar evento "NovaDenunciaRecebida" para RabbitMQ

- Cache management tools

- Settings import/export in JSON format**Modelo de Dados:**

- Reset all settings functionality```java

@Entity

### 2. Fraud Reporting Systempublic class FraudReport {

    private Long id;

**Report Creation**    private String pixKey;           // Chave PIX do golpista

- Structured fraud report submission interface    private BigDecimal amount;       // Valor da transação

- PIX key validation (email, phone, CPF, CNPJ, random key)    private LocalDateTime timestamp; // Horário da transação

- Transaction amount tracking with currency formatting    private String transactionId;    // ID da transação PIX

- Transaction ID registration and validation    private String victimBank;       // Banco da vítima

- Institution identification (victim and fraudster banks)    private String reporterInfo;     // Dados do denunciante

- Precise timestamp recording    private FraudStatus status;      // PENDING, CONFIRMED, FALSE_POSITIVE

- Reporter information capture with privacy controls}

- Status tracking (pending, confirmed, false positive)```

- Attachment support for evidence

#### 3️⃣ **risk-analysis-service** (Serviço de Análise de Risco)

**Report Management**- **Tecnologia**: Java 17+, Spring Boot

- Comprehensive report listing with pagination- **Porta**: 8082  

- Advanced filtering capabilities (status, date range, amount, institution)- **Responsabilidade**:

- Full-text search functionality  - Escutar eventos de novas denúncias

- Bulk status updates  - Manter registro de chaves PIX e contas denunciadas

- Detailed report view with complete history  - Calcular score de risco automático

- Export reports to multiple formats (CSV, JSON, PDF)  - Expor endpoint de consulta de risco

- Bulk operations support (delete, update status, export)

**Lógica de Score:**

### 3. Risk Analysis Engine- 📊 **1 denúncia** = Chave marcada como "suspeita"

- 🚨 **3 denúncias em 24h** = Chave marcada como "alto risco"

**Risk Scoring Algorithm**- 🔍 **Histórico** = Análise de padrões comportamentais

- **1 report**: Account marked as "suspicious"

- **3+ reports in 24 hours**: Account marked as "high risk"**Endpoint de Consulta:**

- **5+ reports in 7 days**: Account marked as "critical risk"```

- Historical pattern analysis with machine learning preparationGET /api/v1/keys/{chavePix}/risk

- Behavioral anomaly detectionResponse: {

- Risk level classification (low, medium, high, critical)  "pixKey": "golpista@email.com",

- Temporal analysis of fraud patterns  "riskLevel": "HIGH_RISK",

- Cross-institution risk correlation  "reportCount": 5,

  "firstReportDate": "2024-10-15T14:30:00Z",

**Risk Query API**  "lastReportDate": "2024-10-17T09:15:00Z"

```http}

GET /api/v1/keys/{pixKey}/risk```

Authorization: Bearer {token}

#### 4️⃣ **notification-service** (Serviço de Notificações)  

Response: 200 OK- **Tecnologia**: Java 17+, Spring Boot

{- **Porta**: 8083

  "pixKey": "fraudster@email.com",- **Responsabilidade**:

  "riskLevel": "HIGH_RISK",  - Escutar eventos de "NovaDenunciaRecebida"

  "riskScore": 85,  - Identificar instituição financeira do golpista

  "reportCount": 5,  - Enviar notificação automática via webhook/REST API

  "firstReportDate": "2024-10-15T14:30:00Z",  - Retry logic para garantia de entrega

  "lastReportDate": "2024-10-24T09:15:00Z",

  "affectedInstitutions": ["Banco A", "Banco B", "Banco C"],**Fluxo de Notificação:**

  "totalAmount": 25000.001. Evento recebido do RabbitMQ

}2. Identificação do banco pela chave PIX

```3. Lookup de webhook da instituição

4. Envio da notificação com retry automático

### 4. Real-Time Notification System5. Log de auditoria da entrega



**WebSocket Communication**---

- Persistent WebSocket connections on ws://localhost:3001/ws

- Automatic user identification after connection establishment## 🌊 Fluxo Operacional Completo

- Real-time message delivery with sub-second latency

- Connection state management and monitoring### 📱 Cenário: Denúncia de Golpe PIX

- Automatic reconnection with exponential backoff algorithm

- Maximum 5 reconnection attempts before fallback**1. 🎣 O Golpe Acontece**

- Fallback to polling mechanism (30-second interval)```

- Connection pooling for scalabilityVítima → PIX R$ 5.000 → golpista@email.com (Banco B)

- Message queuing during disconnection periods```



**Push Notifications****2. 🚨 Denúncia Imediata**

- Firebase Cloud Messaging (FCM) integration```

- VAPID key configuration for web pushVítima → App Banco A → "Reportar Fraude PIX"

- FCM token management and refresh```

- Background notification support via Service Worker

- Foreground notification handling with custom UI**3. 🔄 Processamento Sentinela PIX**

- Custom notification icons, badges, and sounds

- Notification click handling with deep linking```mermaid

- Browser permission management with user-friendly promptssequenceDiagram

- Multi-device support with token synchronization    participant V as Vítima

    participant BA as Banco A

**Notification Types**    participant GW as API Gateway  

- **Fraud Alerts**: Immediate notifications for new fraud reports    participant FR as fraud-report-service

- **Report Status Updates**: Notifications when report status changes    participant MQ as RabbitMQ

- **System Announcements**: Platform updates and maintenance notices    participant RA as risk-analysis-service

- **Security Alerts**: Suspicious activity or login from new device    participant NS as notification-service

- **Account Activity**: Profile changes, password updates, etc.    participant BB as Banco B



**Delivery Mechanisms**    V->>BA: Reportar fraude PIX

- **WebSocket** (primary, real-time): Sub-second delivery    BA->>GW: POST /api/v1/reports

- **Push Notifications** (browser native): Delivered even when tab closed    GW->>FR: Route to fraud-report

- **Email Notifications** (configurable): For critical alerts    FR->>FR: Validar dados

- **In-app Notification Center**: Persistent notification history    FR->>DB: Salvar denúncia

    FR->>MQ: Publish "NovaDenunciaRecebida"

### 5. Dashboard and Analytics    

    MQ->>RA: Event: Nova denúncia

**Key Performance Indicators (KPIs)**    RA->>RA: Atualizar score golpista@email.com

- Total fraud reports (all-time and period-specific)    RA->>DB: Salvar novo score

- Detected fraud cases with confirmation rate    

- Success rate metrics (prevented transactions)    MQ->>NS: Event: Nova denúncia  

- Active users count and growth trends    NS->>NS: Identificar Banco B

- Average response time statistics    NS->>BB: POST webhook notificação

- System uptime and availability metrics    BB->>BB: Processo interno bloqueio

```

**Data Visualization**

- Interactive charts and graphs using Chart.js**4. ⚡ Ação do Banco B**

- Fraud trends over time (daily, weekly, monthly views)- Sistema recebe notificação automática

- Geographic distribution maps of fraud cases- Processo interno de bloqueio preventivo disparado

- Risk distribution analysis with drill-down- Conta do golpista pode ser congelada

- Institution-wise statistics and comparisons- Impedimento de saque/transferência do dinheiro

- Real-time updating dashboards

---

**Reporting**

- Automated report generation on schedule## 🛠️ Stack Tecnológica

- Customizable date ranges and filters

- Export capabilities (PDF, CSV, JSON, Excel)### Backend

- Scheduled report delivery via email- **☕ Java 17 LTS** - Linguagem principal

- Custom report templates- **🍃 Spring Boot 3.1** - Framework de aplicação

- Executive summary generation- **🌐 Spring Cloud Gateway** - API Gateway

- **🔄 Spring AMQP** - Integração RabbitMQ

## Database Schema- **🗄️ Spring Data JPA** - Persistência de dados

- **🔒 Spring Security** - Autenticação e autorização

### Users Table

```sql### Infraestrutura

CREATE TABLE users (- **🐳 Docker** - Containerização

    id TEXT PRIMARY KEY,- **🐰 RabbitMQ** - Sistema de mensageria

    email TEXT UNIQUE NOT NULL,- **🐘 PostgreSQL** - Banco de dados principal

    password_hash TEXT NOT NULL,- **📦 Redis** - Cache distribuído

    full_name TEXT,- **☁️ Azure** - Plataforma de nuvem

    cpf TEXT,

    phone TEXT,### Qualidade & Testes

    bank TEXT,- **🧪 JUnit 5** - Testes unitários

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,- **🎭 Mockito** - Mocking para testes

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,- **🔍 SonarQube** - Análise de código

    last_login DATETIME,- **📊 Actuator** - Monitoramento e métricas

    is_active BOOLEAN DEFAULT 1,

    two_factor_enabled BOOLEAN DEFAULT 0---

);

```## 🔧 Pré-requisitos



### Fraud Reports Table### Desenvolvimento Local

```sql- Java 17 LTS

CREATE TABLE fraud_reports (- Docker Desktop

    id TEXT PRIMARY KEY,- Maven 3.8+

    user_id TEXT NOT NULL,- PostgreSQL (ou via Docker)

    pix_key TEXT NOT NULL,- Python 3.x ou Node.js (para frontend)

    pix_key_type TEXT NOT NULL,

    amount REAL NOT NULL,---

    transaction_id TEXT,

    victim_bank TEXT NOT NULL,## 🚀 Execução Local

    fraudster_bank TEXT,

    description TEXT,### 📊 Dashboard Frontend (Demo Rápido)

    status TEXT DEFAULT 'pending',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,```powershell

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,# Iniciar frontend dashboard

    FOREIGN KEY (user_id) REFERENCES users(id)cd frontend

);python -m http.server 8080

```# Acesse: http://localhost:8080

```

### Notifications Table

```sql### 🏗️ Setup Completo do Sistema

CREATE TABLE notifications (

    id TEXT PRIMARY KEY,```powershell

    user_id TEXT NOT NULL,# 1. Setup completo (infraestrutura + backend)

    fraud_report_id TEXT,.\scripts\setup-local.ps1

    type TEXT NOT NULL,

    title TEXT NOT NULL,# 2. Testar APIs

    message TEXT NOT NULL,.\scripts\test-api.ps1

    icon TEXT,

    color TEXT,# 3. Iniciar frontend  

    read_at DATETIME,.\scripts\start-frontend.ps1

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,```

    FOREIGN KEY (user_id) REFERENCES users(id),

    FOREIGN KEY (fraud_report_id) REFERENCES fraud_reports(id)### 🔧 Execução Manual dos Serviços

);

``````bash

# 1. Infraestrutura

### FCM Tokens Tabledocker-compose up -d postgres redis rabbitmq

```sql

CREATE TABLE user_fcm_tokens (# 2. API Gateway

    user_id TEXT PRIMARY KEY,cd microservices/api-gateway

    fcm_token TEXT NOT NULL,mvn spring-boot:run

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)# 3. Executar microsserviços (terminais separados)

);cd microservices/fraud-report-service

```mvn spring-boot:run



## API Documentationcd microservices/risk-analysis-service  

mvn spring-boot:run

### Authentication Endpoints

cd microservices/notification-service

**Register User**mvn spring-boot:run

```http

POST /api/v1/auth/register# 4. Frontend

Content-Type: application/jsoncd frontend

python -m http.server 8080

{```

  "email": "user@example.com",

  "password": "securePassword123",### 📱 URLs dos Serviços

  "full_name": "John Doe",

  "cpf": "12345678901",- **Dashboard**: <http://localhost:8080>

  "phone": "+5511999999999",- **API Gateway**: <http://localhost:8080/api>

  "bank": "Banco do Brasil"- **Fraud Report Service**: <http://localhost:8081>

}- **Risk Analysis Service**: <http://localhost:8082>

- **Notification Service**: <http://localhost:8083>

Response: 201 Created- **Swagger UI**: <http://localhost:8080/swagger-ui.html>

{

  "userId": "uuid",---

  "email": "user@example.com",

  "token": "jwt_token"## 🧪 Testes

}

```### Testes Unitários

```bash

**Login**# Executar todos os testes

```httpmvn test

POST /api/v1/auth/login

Content-Type: application/json# Executar testes com coverage

mvn test jacoco:report

{

  "email": "user@example.com",# Testes específicos por serviço

  "password": "securePassword123"cd microservices/fraud-report-service

}mvn test

```

Response: 200 OK

{### Testes de Integração

  "userId": "uuid",```bash

  "email": "user@example.com",# Testes end-to-end

  "token": "jwt_token",.\scripts\test-integration.ps1

  "expiresIn": 3600

}# Teste de carga

```.\scripts\test-load.ps1

```

### Fraud Report Endpoints

---

**Create Report**

```http## 📊 Monitoramento e Observabilidade

POST /api/v1/reports

Authorization: Bearer {token}### Métricas Disponíveis

Content-Type: application/json- **📈 Throughput**: Requisições por segundo

- **⏱️ Latência**: Tempo de resposta médio

{- **🚨 Taxa de Erro**: Percentual de falhas

  "pixKey": "fraudster@email.com",- **💾 Uso de Recursos**: CPU, Memória, Rede

  "pixKeyType": "email",

  "amount": 5000.00,### Dashboards

  "transactionId": "E12345678",- **Grafana**: Visualização de métricas

  "victimBank": "Banco do Brasil",- **Prometheus**: Coleta de métricas

  "description": "Detailed fraud description"- **ELK Stack**: Logs centralizados

}- **Jaeger**: Tracing distribuído



Response: 201 Created---

{

  "reportId": "uuid",## ☁️ Deploy em Azure

  "status": "pending",

  "createdAt": "2024-10-24T10:30:00Z"### Recursos Azure Utilizados

}- **🎯 Azure Kubernetes Service (AKS)** - Orquestração de containers

```- **📦 Azure Container Registry (ACR)** - Registry de imagens Docker

- **🗄️ Azure Database for PostgreSQL** - Banco de dados gerenciado

**List Reports**- **🚀 Azure Service Bus** - Mensageria (alternativa ao RabbitMQ)

```http- **📊 Azure Monitor** - Observabilidade e alertas

GET /api/v1/reports?status=pending&limit=20&offset=0

Authorization: Bearer {token}### Pipeline CI/CD

```yaml

Response: 200 OK# .github/workflows/azure-deploy.yml

{name: Deploy to Azure

  "reports": [...],on:

  "total": 100,  push:

  "limit": 20,    branches: [main]

  "offset": 0jobs:

}  deploy:

```    runs-on: ubuntu-latest

    steps:

### Risk Analysis Endpoints      - uses: actions/checkout@v3

      - name: Build and Push to ACR

**Get Risk Score**      - name: Deploy to AKS

```http      - name: Run Integration Tests

GET /api/v1/keys/{pixKey}/risk```

Authorization: Bearer {token}

---

Response: 200 OK

{## 📁 Estrutura do Projeto

  "pixKey": "fraudster@email.com",

  "riskLevel": "HIGH_RISK",```

  "riskScore": 85,sentinela-pix/

  "reportCount": 5,├── 📄 README.md                    # Documentação principal

  "firstReportDate": "2024-10-15T14:30:00Z",├── 📄 EXECUTIVE_SUMMARY.md         # Resumo executivo

  "lastReportDate": "2024-10-24T09:15:00Z"├── 📄 IMPLEMENTATION_GUIDE.md      # Guia de implementação

}├── 🐳 docker-compose.yml           # Orquestração de containers

```├── 📂 microservices/              # Microsserviços backend

│   ├── api-gateway/               # Spring Cloud Gateway

### Notification Endpoints│   ├── fraud-report-service/      # Serviço de denúncias

│   ├── risk-analysis-service/     # Serviço de análise de risco

**Register FCM Token**│   └── notification-service/      # Serviço de notificações

```http├── 📂 frontend/                   # Dashboard web

POST /api/v1/users/fcm-token│   ├── index.html                # Interface principal

Authorization: Bearer {token}│   ├── dashboard.js              # Lógica JavaScript

Content-Type: application/json│   ├── styles.css                # Estilos customizados

│   └── README.md                 # Documentação frontend

{├── 📂 scripts/                   # Scripts de automação

  "userId": "uuid",│   ├── setup-local.ps1          # Setup completo

  "fcmToken": "fcm_device_token"│   ├── test-api.ps1             # Teste das APIs

}│   ├── test-integration.ps1     # Testes de integração

│   └── deploy-azure.ps1         # Deploy para Azure

Response: 200 OK└── 📂 docs/                     # Documentação adicional

{    ├── api-spec.yaml            # OpenAPI Specification

  "success": true,    ├── architecture.md          # Detalhes arquiteturais

  "message": "FCM token registered successfully"    └── deployment.md            # Guia de deploy

}```

```

---

**Create Notification**

```http## 🎯 Requisitos Atendidos

POST /api/v1/notifications/create

Authorization: Bearer {token}| Requisito/Diferencial | Implementação na Solução Sentinela PIX |

Content-Type: application/json|----------------------|----------------------------------------|

| **🔧 Desenvolvimento de Aplicações** | 4 microsserviços distintos e funcionais |

{| **🧠 Lógica de Programação** | Regras de negócio no risk-analysis-service e validações no fraud-report-service |

  "userId": "uuid",| **☕ Linguagem Java** | Todos os microsserviços em Java 17+ |

  "type": "fraud_alert",| **🌐 REST API** | Cada microsserviço expõe APIs REST (POST /reports, GET /keys/{key}/risk) |

  "title": "New Fraud Alert",| **🗄️ Conexão a Banco de Dados** | PostgreSQL com Spring Data JPA |

  "message": "Suspicious activity detected",| **🍃 Uso de Spring Boot** | Base de toda arquitetura, simplificando configuração e criação das APIs |

  "icon": "warning",| **🏗️ Arquitetura de Microsserviços** | Solução nativamente desenhada com essa arquitetura |

  "color": "red"| **🐳 Containers Docker** | Cada microsserviço empacotado em imagem Docker |

}| **☁️ Integração em Cloud Azure** | Deploy via Azure Container Registry (ACR) e Azure Kubernetes Service (AKS) |

| **📚 Controle de Versionamento** | Projeto hospedado no GitHub com monorepo |

Response: 201 Created| **🧪 Testes Unitários** | JUnit 5 e Mockito para testes de Serviços e Controladores |

{

  "notificationId": "uuid",---

  "deliveryStatus": "sent_via_websocket"

}## 🔮 Roadmap Futuro

```

### Fase 1: MVP (Atual)

**Get User Notifications**- ✅ Microsserviços base

```http- ✅ APIs REST funcionais

GET /api/v1/notifications?unread=true&limit=50- ✅ Dashboard de monitoramento

Authorization: Bearer {token}- ✅ Documentação completa



Response: 200 OK### Fase 2: Melhorias

{- 🔄 Machine Learning para detecção de padrões

  "notifications": [...],- 📱 App mobile para denúncias

  "unreadCount": 5,- 🔔 Notificações push em tempo real

  "total": 50- 🌐 API pública para terceiros

}

```### Fase 3: Escala

- 🚀 Deploy multi-região

**Mark Notification as Read**- 📊 Analytics avançados

```http- 🔒 Blockchain para auditoria

PUT /api/v1/notifications/{notificationId}/read- 🤖 IA para prevenção proativa

Authorization: Bearer {token}

---

Response: 200 OK

{## � Como Executar o Projeto

  "success": true,

  "notificationId": "uuid"### 🎯 Execução Rápida (Demo Funcional)

}

```O projeto possui uma versão completa funcional com backend Node.js e frontend responsivo:



### Health Check```powershell

# 1. Clone o repositório

```httpgit clone https://github.com/MatheusGino71/A3-sistemas.git

GET /healthcd A3-sistemas



Response: 200 OK# 2. Instalar dependências do backend

{cd backend

  "status": "healthy",npm install

  "timestamp": "2024-10-24T10:30:00Z",

  "uptime": 86400,# 3. Iniciar backend (Terminal 1)

  "services": {npm start

    "database": "connected",# ✅ Backend rodando em http://localhost:3001

    "websocket": "running",

    "firebase": "connected"# 4. Iniciar frontend (Terminal 2)

  }cd ../frontend

}python -m http.server 8080

```# ✅ Dashboard disponível em http://localhost:8080

```

## WebSocket Protocol

### 🌟 Funcionalidades Disponíveis

### Connection

```- **📊 Dashboard Interativo**: KPIs em tempo real, gráficos dinâmicos

ws://localhost:3001/ws (development)- **🚨 Sistema de Denúncias**: Criar, visualizar e gerenciar denúncias

wss://production-url/ws (production)- **📈 Análise de Risco**: Score automático baseado em denúncias

```- **🔔 Notificações**: Sistema de alertas para instituições

- **📱 Interface Responsiva**: Funciona em desktop e mobile

### Message Format

### 🛠️ Stack Técnica da Demo

**Client to Server: Identification**

```json- **Frontend**: HTML5, CSS3, JavaScript (Vanilla), Tailwind CSS

{- **Backend**: Node.js, Express.js, CORS

  "type": "identify",- **API**: RESTful com dados mock para demonstração

  "userId": "uuid"- **Funcional**: Totalmente operacional sem dependências externas

}

```---



**Server to Client: Notification**## �👥 Equipe de Desenvolvimento

```json

{- **Arquiteto de Soluções**: Design da arquitetura de microsserviços

  "type": "notification",- **Desenvolvedor Backend**: Implementação Java/Spring Boot

  "data": {- **Desenvolvedor Frontend**: Dashboard e interfaces

    "id": "uuid",- **DevOps Engineer**: Docker, Azure, CI/CD

    "type": "fraud_alert",- **QA Engineer**: Testes automatizados e qualidade

    "title": "New Fraud Report",

    "message": "A new fraud has been reported",---

    "icon": "warning",

    "color": "red",## 📚 Referências e Estudos

    "timestamp": "2024-10-24T10:30:00Z"

  }- [Regulamento PIX - Banco Central](https://www.bcb.gov.br/estabilidadefinanceira/pix)

}- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)

```- [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/)

- [Microservices Patterns](https://microservices.io/patterns/)

**Client to Server: Notification Read**- [Fraud Detection Best Practices](https://www.feedzai.com/fraud-detection-guide/)

```json

{---

  "type": "notification_read",

  "notificationId": "uuid"**Projeto Sentinela PIX** - Combatendo fraudes PIX através de tecnologia e colaboração entre instituições financeiras.

}

```*Desenvolvido como solução acadêmica para o combate à fraude no sistema PIX brasileiro.*

## Installation and Setup

### Prerequisites

- Node.js v18.0.0 or higher
- Python 3.8+ (for frontend development server)
- Git version control system
- Firebase account with project created
- Modern web browser with WebSocket and Service Worker support
- Text editor or IDE (VS Code recommended)

### Local Development Setup

**1. Clone the Repository**
```powershell
git clone https://github.com/MatheusGino71/A3-sistemas.git
cd A3-sistemas/sentinela-pix
```

**2. Backend Setup**
```powershell
cd backend
npm install
```

**3. Environment Configuration**

Create `.env` file in the backend directory:
```env
PORT=3001
JWT_SECRET=your_secure_jwt_secret_key_minimum_32_characters
DATABASE_PATH=./database.sqlite
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
```

**4. Firebase Configuration**

Update `frontend/firebase-config.js` with your Firebase project credentials:
```javascript
const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id",
  measurementId: "your_measurement_id"
};
```

**5. VAPID Key Configuration**

Generate VAPID keys in Firebase Console (Project Settings > Cloud Messaging > Web Push certificates).

Update `frontend/user-system.js` line 133:
```javascript
this.fcmToken = await getToken(messaging, {
  vapidKey: 'YOUR_VAPID_PUBLIC_KEY_FROM_FIREBASE_CONSOLE'
});
```

**6. Start Backend Server**
```powershell
cd backend
node server.js
```

Expected console output:
```
Database initialized successfully
Sentinela PIX Backend running on port 3001
WebSocket available at: ws://localhost:3001/ws
Real-time notifications enabled via WebSocket
```

**7. Start Frontend Development Server**
```powershell
# Open new terminal window
cd frontend
python -m http.server 8080
```

**8. Access the Application**

Open your web browser and navigate to:
- **Landing Page**: http://localhost:8080
- **User Registration**: http://localhost:8080/cadastro.html
- **Login**: http://localhost:8080/login.html
- **Dashboard**: http://localhost:8080/dashboard.html (after login)
- **User Profile**: http://localhost:8080/profile.html (after login)
- **Settings**: http://localhost:8080/settings.html (after login)

## Testing

### Manual Testing Procedures

**1. User Registration and Authentication**
- Navigate to http://localhost:8080/cadastro.html
- Fill in registration form with valid data
- Verify email format validation
- Test password strength requirements (minimum 8 characters)
- Submit registration
- Verify successful registration and automatic login
- Test logout functionality
- Test login with created credentials

**2. WebSocket Connection Testing**
- Open browser developer tools (F12)
- Navigate to dashboard after login
- Check Console tab for connection messages:
  - "WebSocket connected for real-time notifications"
  - "User {userId} identified via WebSocket"
- Verify connection status indicator in UI
- Test reconnection by closing and reopening tab

**3. Push Notification Permission**
- Navigate to dashboard
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
