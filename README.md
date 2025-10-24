# Sentinela PIX - Plataforma de Detecção e Prevenção de Fraudes# Sentinela PIX - Fraud Detection and Prevention Platform# Sentinela PIX - Fraud Detection and Prevention Platform



## Índice



1. [Visão Geral](#visão-geral)## Overview## Overview

2. [Problema e Solução](#problema-e-solução)

3. [Arquitetura do Sistema](#arquitetura-do-sistema)

4. [Stack Tecnológica](#stack-tecnológica)

5. [Funcionalidades Principais](#funcionalidades-principais)Sentinela PIX is a comprehensive real-time fraud detection and prevention platform designed to combat PIX payment system scams in Brazil. The platform provides centralized fraud reporting, risk analysis, and automated notification systems to facilitate rapid response between financial institutions.Sentinela PIX is a comprehensive real-time fraud detection and prevention platform designed to combat PIX payment system scams in Brazil. The platform provides centralized fraud reporting, risk analysis, and automated notification systems to facilitate rapid response between financial institutions.

6. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)

7. [Documentação da API](#documentação-da-api)

8. [Instalação e Configuração](#instalação-e-configuração)

9. [Execução Local](#execução-local)## Problem Statement## Problem Statement

10. [Testes](#testes)

11. [Deploy em Produção](#deploy-em-produção)

12. [Segurança](#segurança)

13. [Monitoramento](#monitoramento)The primary vulnerability in PIX fraud is time. Money transfers occur almost instantaneously, making blocking and recovery extremely difficult. The current banking system lacks a centralized mechanism for rapid fraud communication between different institutions.The primary vulnerability in PIX fraud is time. Money transfers occur almost instantaneously, making blocking and recovery extremely difficult. The current banking system lacks a centralized mechanism for rapid fraud communication between different institutions.

14. [Estrutura do Projeto](#estrutura-do-projeto)

15. [Contribuição](#contribuição)

16. [Licença](#licença)

## Solution Architecture## Solution Architecture

## Visão Geral



O Sentinela PIX é uma plataforma abrangente de detecção e prevenção de fraudes em tempo real, projetada para combater golpes no sistema de pagamentos PIX brasileiro. A plataforma fornece relatórios centralizados de fraudes, análise de risco e sistemas automatizados de notificação para facilitar a resposta rápida entre instituições financeiras.

The Sentinela PIX platform addresses this challenge through:The Sentinela PIX platform addresses this challenge through:

### Características Principais



- Sistema de notificação em tempo real via WebSocket

- Análise de risco automatizada com pontuação dinâmica- **Rapid Notification System**: Creates an ultra-fast channel for victim institutions to communicate with fraud recipient institutions- **Rapid Notification System**: Creates an ultra-fast channel for victim institutions to communicate with fraud recipient institutions

- Integração com Firebase Cloud Messaging para notificações push

- Interface web responsiva e intuitiva- **Risk Scoring**: Analyzes and flags PIX keys and accounts that receive multiple fraud reports- **Risk Scoring**: Analyzes and flags PIX keys and accounts that receive multiple fraud reports

- API RESTful completa e documentada

- Autenticação segura com JWT e Firebase- **Prevention Mechanism**: Helps prevent future transactions to fraudulent accounts through real-time alerts- **Prevention Mechanism**: Helps prevent future transactions to fraudulent accounts through real-time alerts

- Suporte a múltiplos dispositivos e sessões



## Problema e Solução

## Technical Stack## 🚀 Demonstração

### O Problema



A principal vulnerabilidade nas fraudes PIX é o tempo. As transferências de dinheiro ocorrem quase instantaneamente, tornando o bloqueio e a recuperação extremamente difíceis. O sistema bancário atual carece de um mecanismo centralizado para comunicação rápida de fraudes entre diferentes instituições.

### Backend TechnologiesO projeto está totalmente funcional e pode ser executado localmente:

### A Solução

- **Node.js v18+**: JavaScript runtime for backend services

A plataforma Sentinela PIX aborda este desafio através de:

- **Express.js 4.18**: Web application framework- **🖥️ Dashboard Web**: http://localhost:8080

- **Sistema de Notificação Rápida**: Cria um canal ultrarrápido para que instituições vítimas comuniquem instituições receptoras de fraude

- **Pontuação de Risco**: Analisa e sinaliza chaves PIX e contas que recebem múltiplas denúncias de fraude- **SQLite3**: Embedded database for data persistence- **🔧 API Backend**: http://localhost:3001/api/v1

- **Mecanismo de Prevenção**: Ajuda a prevenir transações futuras para contas fraudulentas através de alertas em tempo real

- **bcryptjs**: Password hashing and authentication- **❤️ Health Check**: http://localhost:3001/health

## Arquitetura do Sistema

- **jsonwebtoken**: JWT-based authentication system

### Visão Arquitetural de Alto Nível

- **ws (WebSocket)**: Real-time bidirectional communication library### Screenshots

```

┌─────────────────────────────────────────────────────────────┐- **node-cron**: Scheduled task management

│                   Aplicações Cliente                         │

│  (Dashboard Web, Apps Mobile, Interfaces Bancárias)         │<details>

└────────────────────────┬────────────────────────────────────┘

                         │### Frontend Technologies<summary>🖼️ Ver Capturas de Tela</summary>

                         │ HTTPS / WSS

                         │- **HTML5 / CSS3**: Modern web standards

┌────────────────────────▼────────────────────────────────────┐

│                   Camada Frontend                            │- **JavaScript ES6+**: Modern JavaScript with module system- Dashboard principal com KPIs em tempo real

│  - Interface do Usuário (HTML/CSS/JavaScript)               │

│  - Autenticação Firebase                                     │- **Tailwind CSS 3.x**: Utility-first CSS framework- Sistema de denúncias interativo

│  - Cliente WebSocket                                        │

│  - Service Worker FCM                                       │- **Material Symbols**: Google's comprehensive icon system- Análise de risco por chave PIX

└────────────────────────┬────────────────────────────────────┘

                         │- Gráficos e relatórios detalhados

                         │ API REST / WebSocket

                         │### Firebase Integration

┌────────────────────────▼────────────────────────────────────┐

│                   Serviços Backend                           │- **Firebase Authentication**: User authentication and management</details>

│  - API REST Express.js (Porta 3001)                         │

│  - Servidor WebSocket (ws://localhost:3001/ws)              │- **Firebase Firestore**: Cloud-based NoSQL database

│  - Autenticação e Autorização                               │

│  - Lógica de Negócio e Validação                           │- **Firebase Cloud Messaging (FCM)**: Push notification service---

└────────────────────────┬────────────────────────────────────┘

                         │- **Firebase Hosting**: Static content hosting and delivery

                         │

         ┌───────────────┼───────────────┐## 🎭 Atores do Sistema

         │               │               │

         ▼               ▼               ▼### Real-Time Communication

┌────────────────┐ ┌─────────────┐ ┌──────────────┐

│ Banco SQLite   │ │  Firebase   │ │Sistema Arquivos│- **WebSocket Protocol**: Persistent bidirectional connections| Ator | Descrição | Responsabilidade |

│                │ │  Firestore  │ │              │

│ - Usuários     │ │  - Usuários │ │ - Uploads    │- **Automatic Reconnection**: Exponential backoff strategy with polling fallback|------|-----------|-----------------|

│ - Denúncias    │ │  - Perfis   │ │ - Logs       │

│ - Notificações │ │  - Config.  │ │ - Cache      │- **Message Queue Architecture**: Event-driven notification system| **👤 Usuário Vítima** | Pessoa que foi vítima de golpe PIX | Inicia o processo de denúncia através do app de seu banco |

│ - Tokens FCM   │ │             │ │              │

└────────────────┘ └─────────────┘ └──────────────┘| **🏦 Instituição Financeira A** | Banco da Vítima | Consome a API do Sentinela PIX para registrar a denúncia de golpe |

```

## System Architecture| **🔒 Plataforma Sentinela PIX** | Nossa Solução | O cérebro da operação: recebe, processa, armazena e distribui as informações de fraude |

### Componentes do Sistema

| **🏛️ Instituição Financeira B** | Banco do Golpista | É notificada pela plataforma para tomar ações de bloqueio preventivo na conta suspeita |

#### Camada de Apresentação

```

**Interface Web**

- Dashboard interativo com visualização de dados em tempo real┌─────────────────────────────────────────────────────────────┐---

- Páginas de perfil de usuário e configurações

- Sistema de relatórios de fraude│                    Client Applications                       │

- Centro de notificações

│  (Web Dashboard, Mobile Apps, Banking Interfaces)           │## 🏗️ Arquitetura de Microsserviços

**Tecnologias Utilizadas**

- HTML5 e CSS3 para estrutura e estilização└────────────────────────┬────────────────────────────────────┘

- JavaScript ES6+ para lógica da aplicação

- Tailwind CSS para design responsivo                         │### Visão Arquitetural

- Material Symbols para iconografia

                         │ HTTPS / WSS

#### Camada de Aplicação

                         │```

**Servidor Backend**

- Node.js versão 18 ou superior┌────────────────────────▼────────────────────────────────────┐┌─────────────────┐    ┌─────────────────────┐    ┌──────────────────────┐

- Express.js para roteamento e middleware

- WebSocket Server para comunicação em tempo real│                   Frontend Layer                             ││   App Bancário  │───▶│   API Gateway       │───▶│    Load Balancer     │

- Sistema de autenticação JWT

│  - User Interface (HTML/CSS/JavaScript)                     ││   (Banco A)     │    │ (Spring Cloud GW)   │    │                      │

**Gerenciamento de Estado**

- Armazenamento local para preferências do usuário│  - Firebase Authentication                                   │└─────────────────┘    └─────────────────────┘    └──────────────────────┘

- Cache em memória para dados frequentemente acessados

- Sincronização de estado via WebSocket│  - WebSocket Client                                         │                                  │



#### Camada de Dados│  - FCM Service Worker                                       │                ┌─────────────────┼─────────────────┐



**Banco de Dados SQLite**└────────────────────────┬────────────────────────────────────┘                │                 │                 │

- Armazenamento de usuários e autenticação

- Relatórios de fraude e histórico                         │                ▼                 ▼                 ▼

- Notificações e status de leitura

- Tokens FCM para dispositivos                         │ REST API / WebSocket    ┌───────────────────┐ ┌─────────────────┐ ┌─────────────────┐



**Firebase Services**                         │    │ fraud-report-     │ │ risk-analysis-  │ │ notification-   │

- Firebase Authentication para gerenciamento de usuários

- Firestore para perfis de usuário┌────────────────────────▼────────────────────────────────────┐    │ service           │ │ service         │ │ service         │

- Firebase Cloud Messaging para notificações push

- Firebase Hosting para hospedagem da aplicação│                   Backend Services                           │    │                   │ │                 │ │                 │



## Stack Tecnológica│  - Express.js REST API (Port 3001)                          │    │ • Recebe denúncias│ │ • Score de risco│ │ • Notifica bancos│



### Tecnologias Backend│  - WebSocket Server (ws://localhost:3001/ws)                │    │ • Valida dados    │ │ • 1→suspeita    │ │ • Webhooks       │



**Runtime e Framework**│  - Authentication & Authorization                            │    │ • Persiste no BD  │ │ • 3→alto risco  │ │ • REST API       │

- Node.js v18.0.0 ou superior - Ambiente de execução JavaScript

- Express.js 4.18.x - Framework web minimalista e flexível│  - Business Logic & Validation                              │    │ • Publica eventos │ │ • Consulta keys │ │ • Auto notif.    │

- SQLite3 - Banco de dados relacional embutido

- bcryptjs - Biblioteca para hash de senhas└────────────────────────┬────────────────────────────────────┘    └───────────────────┘ └─────────────────┘ └─────────────────┘

- jsonwebtoken - Implementação JWT para autenticação

- ws 8.14.2 - Biblioteca WebSocket para comunicação em tempo real                         │                │                 │                 │

- node-cron - Agendador de tarefas

                         │                └────────────────▼─────────────────┘

### Tecnologias Frontend

         ┌───────────────┼───────────────┐                        ┌─────────────────┐

**Linguagens e Frameworks**

- HTML5 - Estrutura semântica da aplicação         │               │               │                        │   RabbitMQ      │

- CSS3 - Estilização e layout responsivo

- JavaScript ES6+ - Lógica da aplicação e interatividade         ▼               ▼               ▼                        │   (Mensageria)  │

- Tailwind CSS 3.x - Framework CSS utility-first

- Material Symbols - Sistema de ícones do Google┌────────────────┐ ┌─────────────┐ ┌──────────────┐                        │                 │



### Integrações Firebase│ SQLite Database│ │  Firebase   │ │  File System │                        │ • NovaDenuncia  │



**Serviços Utilizados**│                │ │  Firestore  │ │              │                        │ • Async Events  │

- Firebase Authentication - Autenticação de usuários

- Firebase Firestore - Banco de dados NoSQL em nuvem│ - Users        │ │  - Users    │ │ - Uploads    │                        │ • Pub/Sub       │

- Firebase Cloud Messaging (FCM) - Serviço de notificações push

- Firebase Hosting - Hospedagem de conteúdo estático│ - Reports      │ │  - Profiles │ │ - Logs       │                        └─────────────────┘



### Comunicação em Tempo Real│ - Notifications│ │  - Settings │ │ - Cache      │                                │



**Protocolos e Bibliotecas**│ - FCM Tokens   │ │             │ │              │                        ┌─────────────────┐

- Protocolo WebSocket - Conexões bidirecionais persistentes

- Reconexão Automática - Estratégia de backoff exponencial com fallback└────────────────┘ └─────────────┘ └──────────────┘                        │   PostgreSQL    │

- Arquitetura de Fila de Mensagens - Sistema de notificações orientado a eventos

```                        │   (Database)    │

## Funcionalidades Principais

                        │                 │

### 1. Sistema de Gerenciamento de Usuários

## Core Features                        │ • Denúncias     │

#### Autenticação

                        │ • Scores PIX    │

**Recursos de Autenticação**

- Integração com Firebase Authentication### 1. User Management System                        │ • Históricos    │

- Autenticação via email e senha com validação

- Gerenciamento de sessão baseado em tokens JWT                        └─────────────────┘

- Hash seguro de senhas com bcryptjs (10 rounds)

- Troca de senha com requisito de reautenticação**Authentication**```

- Expiração e renovação automática de sessão

- Funcionalidade de logout com invalidação de token- Firebase Authentication integration



**Perfis de Usuário**- Email/password authentication with validation### 🔧 Microsserviços Detalhados

- Interface completa de gerenciamento de perfil (profile.html)

- Edição de informações pessoais (nome, email, CPF, telefone)- JWT token-based session management

- Seleção de instituição bancária (8 bancos brasileiros suportados)

- Sistema de avatar com geração automática de iniciais- Secure password hashing with bcryptjs (10 rounds)#### 1️⃣ **api-gateway** (Gateway de API)

- Toggle de autenticação de dois fatores

- Dashboard de estatísticas da conta (relatórios enviados, fraudes detectadas, taxa de sucesso)- Password change with reauthentication requirement- **Tecnologia**: Spring Boot + Spring Cloud Gateway

- Funcionalidade de exportação de dados em formato JSON

- Exclusão de conta com diálogo de confirmação- Session expiration and automatic renewal- **Porta**: 8080



**Gerenciamento de Configurações**- Logout functionality with token invalidation- **Responsabilidade**: 

- Interface abrangente de configurações (settings.html)

- Personalização de tema (modos claro/escuro/automático)  - Ponto de entrada único para todas as requisições externas dos bancos

- Preferências de idioma (Português, Inglês, Espanhol)

- Controle de densidade da interface (confortável, compacto, espaçoso)**User Profiles**  - Autenticação e autorização de APIs

- Configuração de preferências de notificação

- Gerenciamento de configurações de privacidade- Complete profile management interface (profile.html)  - Roteamento inteligente para microsserviços

- Opções de segurança (2FA, sessões ativas, histórico de login)

- Toggle de modo desenvolvedor- Personal information editing (name, email, CPF, phone)  - Rate limiting e circuit breaker

- Ferramentas de gerenciamento de cache

- Importação e exportação de configurações em formato JSON- Bank institution selection (8 Brazilian banks supported)

- Funcionalidade de reset de todas as configurações

- Avatar system with automatic initials generation**Endpoints Principais:**

### 2. Sistema de Relatórios de Fraude

- Two-factor authentication toggle```

#### Criação de Relatórios

- Account statistics dashboard (reports sent, frauds detected, success rate)POST /api/v1/reports          → fraud-report-service

**Interface de Submissão**

- Interface estruturada de submissão de relatórios de fraude- Data export functionality in JSON formatGET  /api/v1/keys/{key}/risk  → risk-analysis-service

- Validação de chave PIX (email, telefone, CPF, CNPJ, chave aleatória)

- Rastreamento de valor de transação com formatação de moeda- Account deletion with confirmation dialogPOST /api/v1/notifications    → notification-service

- Registro e validação de ID de transação

- Identificação de instituição (bancos vítima e fraudador)```

- Registro preciso de timestamp

- Captura de informações do denunciante com controles de privacidade**Settings Management**

- Rastreamento de status (pendente, confirmado, falso positivo)

- Suporte para anexos de evidência- Comprehensive settings interface (settings.html)#### 2️⃣ **fraud-report-service** (Serviço de Denúncias)



#### Gerenciamento de Relatórios- Theme customization (light/dark/auto modes)- **Tecnologia**: Java 17+, Spring Boot, JPA/Hibernate



**Recursos de Gerenciamento**- Language preferences (Portuguese, English, Spanish)- **Porta**: 8081

- Lista abrangente de relatórios com paginação

- Capacidades avançadas de filtro (status, intervalo de datas, valor, instituição)- UI density control (comfortable, compact, spacious)- **Responsabilidade**:

- Funcionalidade de busca em texto completo

- Atualizações de status em massa- Notification preferences configuration  - Receber detalhes da denúncia (chave PIX do golpista, valor, horário, ID da transação)

- Visualização detalhada de relatórios com histórico completo

- Exportação de relatórios em múltiplos formatos (CSV, JSON, PDF)- Privacy settings management  - Validar dados de entrada

- Suporte a operações em massa (excluir, atualizar status, exportar)

- Security options (2FA, active sessions, login history)  - Persistir denúncias no PostgreSQL

### 3. Motor de Análise de Risco

- Developer mode toggle  - Publicar evento "NovaDenunciaRecebida" para RabbitMQ

#### Algoritmo de Pontuação de Risco

- Cache management tools

**Níveis de Risco**

- 1 denúncia: Conta marcada como "suspeita"- Settings import/export in JSON format**Modelo de Dados:**

- 3 ou mais denúncias em 24 horas: Conta marcada como "risco alto"

- 5 ou mais denúncias em 7 dias: Conta marcada como "risco crítico"- Reset all settings functionality```java

- Análise de padrões históricos com preparação para machine learning

- Detecção de anomalias comportamentais@Entity

- Classificação de nível de risco (baixo, médio, alto, crítico)

- Análise temporal de padrões de fraude### 2. Fraud Reporting Systempublic class FraudReport {

- Correlação de risco entre instituições

    private Long id;

#### API de Consulta de Risco

**Report Creation**    private String pixKey;           // Chave PIX do golpista

**Endpoint de Consulta**

```http- Structured fraud report submission interface    private BigDecimal amount;       // Valor da transação

GET /api/v1/keys/{chavePix}/risk

Authorization: Bearer {token}- PIX key validation (email, phone, CPF, CNPJ, random key)    private LocalDateTime timestamp; // Horário da transação



Resposta: 200 OK- Transaction amount tracking with currency formatting    private String transactionId;    // ID da transação PIX

{

  "pixKey": "fraudador@email.com",- Transaction ID registration and validation    private String victimBank;       // Banco da vítima

  "riskLevel": "HIGH_RISK",

  "riskScore": 85,- Institution identification (victim and fraudster banks)    private String reporterInfo;     // Dados do denunciante

  "reportCount": 5,

  "firstReportDate": "2024-10-15T14:30:00Z",- Precise timestamp recording    private FraudStatus status;      // PENDING, CONFIRMED, FALSE_POSITIVE

  "lastReportDate": "2024-10-24T09:15:00Z",

  "affectedInstitutions": ["Banco A", "Banco B", "Banco C"],- Reporter information capture with privacy controls}

  "totalAmount": 25000.00

}- Status tracking (pending, confirmed, false positive)```

```

- Attachment support for evidence

### 4. Sistema de Notificações em Tempo Real

#### 3️⃣ **risk-analysis-service** (Serviço de Análise de Risco)

#### Comunicação WebSocket

**Report Management**- **Tecnologia**: Java 17+, Spring Boot

**Recursos de Conexão**

- Conexões WebSocket persistentes em ws://localhost:3001/ws- Comprehensive report listing with pagination- **Porta**: 8082  

- Identificação automática de usuário após estabelecimento de conexão

- Entrega de mensagens em tempo real com latência sub-segundo- Advanced filtering capabilities (status, date range, amount, institution)- **Responsabilidade**:

- Gerenciamento e monitoramento de estado de conexão

- Reconexão automática com algoritmo de backoff exponencial- Full-text search functionality  - Escutar eventos de novas denúncias

- Máximo de 5 tentativas de reconexão antes do fallback

- Fallback para mecanismo de polling (intervalo de 30 segundos)- Bulk status updates  - Manter registro de chaves PIX e contas denunciadas

- Pool de conexões para escalabilidade

- Enfileiramento de mensagens durante períodos de desconexão- Detailed report view with complete history  - Calcular score de risco automático



#### Notificações Push- Export reports to multiple formats (CSV, JSON, PDF)  - Expor endpoint de consulta de risco



**Firebase Cloud Messaging**- Bulk operations support (delete, update status, export)

- Integração com Firebase Cloud Messaging (FCM)

- Configuração de chave VAPID para web push**Lógica de Score:**

- Gerenciamento e atualização de tokens FCM

- Suporte a notificações em segundo plano via Service Worker### 3. Risk Analysis Engine- 📊 **1 denúncia** = Chave marcada como "suspeita"

- Manipulação de notificações em primeiro plano com UI customizada

- Ícones, badges e sons de notificação personalizados- 🚨 **3 denúncias em 24h** = Chave marcada como "alto risco"

- Manipulação de cliques em notificação com deep linking

- Gerenciamento de permissões do navegador com prompts amigáveis**Risk Scoring Algorithm**- 🔍 **Histórico** = Análise de padrões comportamentais

- Suporte multi-dispositivo com sincronização de tokens

- **1 report**: Account marked as "suspicious"

#### Tipos de Notificação

- **3+ reports in 24 hours**: Account marked as "high risk"**Endpoint de Consulta:**

**Categorias Implementadas**

- Alertas de Fraude: Notificações imediatas para novos relatórios de fraude- **5+ reports in 7 days**: Account marked as "critical risk"```

- Atualizações de Status de Relatório: Notificações quando o status do relatório muda

- Anúncios do Sistema: Atualizações de plataforma e avisos de manutenção- Historical pattern analysis with machine learning preparationGET /api/v1/keys/{chavePix}/risk

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
