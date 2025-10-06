# Sentinela PIX - Sistema de Prevenção à Fraude

## 📋 Descrição

O **Sentinela PIX** é um sistema inovador de prevenção à fraude desenvolvido para o Bradesco, focado na detecção e análise de transações PIX suspeitas. O sistema utiliza uma arquitetura de microsserviços para fornecer análise em tempo real e relatórios detalhados sobre possíveis fraudes.

## 🏗️ Arquitetura

O sistema é composto por três componentes principais:

### 🔧 Microsserviços Backend

1. **Report Service** (Porta 8081)
   - Responsável pelo armazenamento de relatórios de fraude
   - API REST para criação e recuperação de relatórios
   - Banco de dados H2 em memória
   - Spring Boot 3.2 + Spring Data JPA

2. **Query Service** (Porta 8082)
   - Serviço de análise e consulta de riscos
   - Cálculo de score de risco baseado em múltiplos fatores
   - Integração com Report Service via WebClient
   - Spring Boot 3.2 + Spring WebFlux

### 🌐 Interface Web (Porta 8080)

- Interface moderna e responsiva
- Dashboard com métricas de fraude
- Formulários para reportar transações suspeitas
- Consulta de histórico de relatórios
- HTML5, CSS3, JavaScript ES6+

## 🚀 Tecnologias Utilizadas

- **Backend**: Java 25, Spring Boot 3.2, Spring Data JPA, Spring WebFlux
- **Banco de Dados**: H2 Database (In-Memory)
- **Build**: Maven 3.9.5
- **Frontend**: HTML5, CSS3, JavaScript, Font Awesome, Google Fonts
- **Servidor Web**: Python HTTP Server
- **Containerização**: Docker & Docker Compose

## 📦 Estrutura do Projeto

```
sentinela-pix-bradesco/
├── report-service/          # Microsserviço de relatórios
│   ├── src/main/java/      # Código fonte Java
│   ├── src/main/resources/ # Configurações (application.yml)
│   ├── src/test/           # Testes unitários
│   ├── Dockerfile          # Container Docker
│   └── pom.xml            # Dependências Maven
├── query-service/          # Microsserviço de consultas
│   ├── src/main/java/      # Código fonte Java
│   ├── src/main/resources/ # Configurações (application.yml)
│   ├── src/test/           # Testes unitários
│   ├── Dockerfile          # Container Docker
│   └── pom.xml            # Dependências Maven
├── web-interface/          # Interface web
│   ├── index.html         # Página principal
│   ├── styles.css         # Estilos CSS
│   ├── script.js          # JavaScript
│   └── README.md          # Documentação da interface
├── docker-compose.yml     # Orquestração dos serviços
└── README.md             # Este arquivo
```

## 🔧 Instalação e Execução

### Pré-requisitos

- Java 25 (Eclipse Adoptium)
- Maven 3.9.5+
- Python 3.8+
- Docker & Docker Compose (opcional)

### Execução Local

1. **Clone o repositório**
```bash
git clone git@github.com:MatheusGino71/A3-sistemas.git
cd A3-sistemas
```

2. **Configurar variáveis de ambiente**
```bash
# Windows PowerShell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-25.0.0.36-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

3. **Executar Report Service**
```bash
cd sentinela-pix-bradesco/report-service
mvn spring-boot:run
```

4. **Executar Query Service** (em outro terminal)
```bash
cd sentinela-pix-bradesco/query-service
mvn spring-boot:run
```

5. **Executar Interface Web** (em outro terminal)
```bash
cd sentinela-pix-bradesco/web-interface
python -m http.server 8080
```

### Execução com Docker

```bash
cd sentinela-pix-bradesco
docker-compose up --build -d
```

## 🔗 Endpoints da API

### Report Service (http://localhost:8081)

- `POST /api/reports` - Criar novo relatório de fraude
- `GET /api/reports` - Listar todos os relatórios
- `GET /api/reports/{id}` - Buscar relatório por ID
- `GET /actuator/health` - Health check

### Query Service (http://localhost:8082)

- `POST /api/query/risk-assessment` - Análise de risco de transação
- `GET /actuator/health` - Health check

## 🧪 Testes

```bash
# Executar testes do Report Service
cd sentinela-pix-bradesco/report-service
mvn test

# Executar testes do Query Service
cd sentinela-pix-bradesco/query-service
mvn test
```

## 📊 Funcionalidades

### Dashboard Principal
- Visualização de métricas de fraude em tempo real
- Gráficos de tendências e estatísticas
- Alertas de transações suspeitas

### Análise de Risco
- Algoritmo proprietário de scoring
- Análise baseada em valor, horário, frequência e histórico
- Classificação de risco: BAIXO, MÉDIO, ALTO, CRÍTICO

### Relatórios de Fraude
- Formulário intuitivo para reportar suspeitas
- Validação de dados em tempo real
- Armazenamento seguro e recuperação rápida

### Histórico e Auditoria
- Consulta de relatórios anteriores
- Filtros por data, valor e status
- Exportação de dados para análise

## 🔒 Segurança

- Configuração CORS para comunicação entre serviços
- Validação de entrada de dados
- Tratamento seguro de exceções
- Logs de auditoria para rastreabilidade

## 🚀 Melhorias Futuras

- [ ] Autenticação e autorização (JWT)
- [ ] Banco de dados PostgreSQL para produção
- [ ] Machine Learning para detecção avançada
- [ ] Notificações em tempo real (WebSocket)
- [ ] API de integração com sistemas bancários
- [ ] Dashboard administrativo completo
- [ ] Relatórios exportáveis (PDF, Excel)

## 👥 Contribuição

Este projeto foi desenvolvido como parte do trabalho acadêmico A3 - Sistemas Distribuídos e Mobile.

## 📄 Licença

Este projeto é destinado para fins acadêmicos e demonstração de competências técnicas.

---

**Desenvolvido com ❤️ para o desafio Bradesco de prevenção à fraude PIX**
