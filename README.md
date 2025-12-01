# ZENIT - Plataforma de Detecção de Fraudes PIX

![Java](https://img.shields.io/badge/Java-25-orange?logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen?logo=springboot)
![Jetty](https://img.shields.io/badge/Jetty-9.4.53-blue?logo=eclipse)
![H2](https://img.shields.io/badge/H2-Database-blue?logo=database)
![Status](https://img.shields.io/badge/Status-Production--Ready-success)

Sistema profissional de detecção e análise de fraudes em chaves PIX com validação em tempo real e scoring inteligente.

---

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Uso](#uso)
- [API Reference](#api-reference)
- [Banco de Dados](#banco-de-dados)

---

## Visão Geral

**ZENIT** é uma plataforma completa de detecção e análise de fraudes em transações PIX. O sistema oferece:

- **Validação em Tempo Real** de chaves PIX
- **Dashboard Interativo** com estatísticas atualizadas
- **Sistema de Scoring** baseado em padrões de risco
- **Gestão de Denúncias** com protocolos únicos
- **Análise de Riscos** com detecção automática
- **Alertas Inteligentes** para transações suspeitas

### Diferenciais

- **100% Real Data**: Nenhum dado mockado - todas as informações vêm da API
- **Scoring Profissional**: Algoritmo de análise de padrões em chaves PIX
- **Atualização Automática**: Dados recarregados a cada 30 segundos
- **Session Management**: Armazenamento inteligente de verificações e denúncias
- **Production-Ready**: Código limpo, organizado e pronto para produção

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (JSP)                      │
│              Jetty 9.4.53 - Port 8082                   │
├─────────────────────────────────────────────────────────┤
│  • index.jsp          (Dashboard com stats em tempo real)
│  • verificar-pix.jsp  (Validação de chaves PIX)
│  • denuncias.jsp      (Gestão de denúncias)
│  • analise-riscos.jsp (Análise e relatórios)
└─────────────────────────────────────────────────────────┘
                            ↓
                      Fetch API (JSON)
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   SERVLET LAYER                         │
├─────────────────────────────────────────────────────────┤
│  • DashboardServlet       → /api/dashboard/stats        │
│  • VerificacaoPixServlet  → /api/verificar-pix          │
│  • DenunciaServlet        → /api/denuncias              │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│               BACKEND API (Spring Boot)                 │
│            Spring Boot 3.2.5 - Port 8080                │
├─────────────────────────────────────────────────────────┤
│  • OcorrenciaController   → /api/ocorrencias            │
│  • OcorrenciaService      (Business Logic)              │
│  • OcorrenciaRepository   (Data Access)                 │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   DATABASE (H2)                         │
│           In-Memory Database - Dev Mode                 │
└─────────────────────────────────────────────────────────┘
```

---

## Funcionalidades

### 1. Dashboard Inteligente

- **Estatísticas em Tempo Real**: Total de transações, fraudes detectadas, taxa de precisão, valor protegido
- **Auto-refresh**: Atualização automática a cada 30 segundos
- **Últimas 10 verificações** de chaves PIX
- **Últimas 20 denúncias** registradas

### 2. Verificação de Chaves PIX

- **Algoritmo de Scoring**:
  - Base score: 85 pontos
  - Penalidades: Chaves curtas (-20), Padrões repetitivos (-15), E-mails suspeitos (-25)
- **Classificação de Risco**: BAIXO (≥70) | MÉDIO (50-69) | ALTO (<50)

### 3. Gestão de Denúncias

- **Protocolo Único**: `ZENIT-{timestamp}`
- **Armazenamento em Sessão**: Últimas 20 denúncias
- **Mascaramento de Dados**: Privacidade de chaves PIX

### 4. Análise de Riscos

- **Tabela de Ocorrências**: Dados diretos da API
- **Status Color-Coded**: NORMAL | SUSPEITO | FRAUDE
- **Detecção Automática**: Valores > R$ 1.000,00

---

## Tecnologias

### Backend
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Java** | 25 | Linguagem principal |
| **Spring Boot** | 3.2.5 | Framework REST API |
| **Spring Data JPA** | 3.2.5 | ORM e persistência |
| **H2 Database** | 2.2.224 | Banco em memória |

### Frontend
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Jetty** | 9.4.53 | Servidor web |
| **JSP/Servlets** | Jakarta EE 10 | Interface web |
| **Bootstrap** | 5.3 | Framework CSS |
| **Fetch API** | ES6 | Requisições assíncronas |

---

## Instalação

### Pré-requisitos
```bash
# Java 25
java -version

# Maven 3.9+
mvn -version
```

### Instalação Local

**1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/zenit.git
cd zenit
```

**2. Compile o backend**
```bash
cd zenit-core-api
mvn clean install
```

**3. Compile o frontend**
```bash
cd ../zenit-frontend-java
mvn clean install
```

### Usando Docker

```bash
# Build e start de todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

---

## Uso

### Iniciando a Aplicação

**Terminal 1 - Backend:**
```bash
cd zenit-core-api
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd zenit-frontend-java
mvn jetty:run
```

### Acessando

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:8082 | Interface principal |
| **Backend API** | http://localhost:8080/api/ocorrencias | REST API |
| **H2 Console** | http://localhost:8080/h2-console | Console do banco |

---

## API Reference

### Backend API (Port 8080)

#### `GET /api/ocorrencias`
Retorna todas as ocorrências.

**Response:**
```json
[
  {
    "id": 1,
    "status": "NORMAL",
    "valor": 150.50,
    "chavePix": "usuario@email.com",
    "tipoChave": "EMAIL",
    "scoreRisco": 85,
    "protocolo": "ZENIT-1701234567890",
    "dataCriacao": "2024-12-01T10:30:00"
  }
]
```

#### `POST /api/ocorrencias`
Cria nova ocorrência.

**Request:**
```json
{
  "status": "NORMAL",
  "valor": 500.00,
  "chavePix": "usuario@email.com"
}
```

### Servlet API (Port 8082)

#### `GET /api/dashboard/stats`
Estatísticas do dashboard.

**Response:**
```json
{
  "transacoesHoje": 125,
  "fraudesDetectadas": 8,
  "taxaPrecisao": 96.8,
  "valorProtegido": 45000.00
}
```

#### `POST /api/verificar-pix`
Valida chave PIX.

**Response:**
```json
{
  "score": 85,
  "risco": "BAIXO",
  "status": "SEGURO"
}
```

#### `POST /api/denuncias`
Registra denúncia.

**Response:**
```json
{
  "success": true,
  "protocolo": "ZENIT-1701234567890"
}
```

---

## Banco de Dados

### Schema: ocorrencias

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | BIGINT | ID único |
| `status` | VARCHAR(20) | NORMAL/SUSPEITO/FRAUDE |
| `valor` | DECIMAL(10,2) | Valor da transação |
| `chave_pix` | VARCHAR(100) | Chave PIX |
| `tipo_chave` | VARCHAR(20) | CPF/EMAIL/TELEFONE |
| `score_risco` | INTEGER | Score 0-100 |
| `protocolo` | VARCHAR(50) | Protocolo único |
| `data_criacao` | TIMESTAMP | Data de criação |

---

<div align="center">

**Desenvolvido com ❤️ pela Equipe ZENIT**

</div>
