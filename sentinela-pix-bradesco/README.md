# Sentinela PIX - Sistema de Prevenção a Fraudes PIX

## 📋 Índice
- [Introdução](#introdução)
- [Arquitetura da Solução](#arquitetura-da-solução)
- [Stack de Tecnologias](#stack-de-tecnologias)
- [Como Executar](#como-executar)
- [Exemplos de Uso da API](#exemplos-de-uso-da-api)
- [Testes](#testes)
- [Guia de Implantação na Azure](#guia-de-implantação-na-azure)
- [Considerações de Produção](#considerações-de-produção)

## 🚀 Introdução

### O Problema
O golpe do PIX representa uma das fraudes financeiras mais comuns no Brasil, onde usuários realizam transferências e descobrem tardiamente que foram vítimas de golpistas. Segundo o Banco Central, estes golpes causam prejuízos de milhões de reais anualmente aos consumidores brasileiros.

### A Solução: Sentinela PIX
O **Sentinela PIX** é uma plataforma colaborativa que permite:

1. **Denunciar**: Vítimas podem registrar denúncias contra chaves PIX fraudulentas
2. **Consultar**: Usuários podem verificar o "score de risco" de uma chave PIX antes de efetuar transferências

Esta solução funciona como um "Waze das fraudes PIX", criando uma base de dados colaborativa para proteger a comunidade.

## 🏗️ Arquitetura da Solução

### Visão Geral
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Mobile App    │    │   Web Frontend  │    │  External APIs  │
│                 │    │                 │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────────┐
                    │                 │
                    │   API Gateway   │
                    │   (Futuro)      │
                    │                 │
                    └─────────┬───────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
┌─────────┴───────┐ ┌─────────┴───────┐ ┌─────────┴───────┐
│                 │ │                 │ │                 │
│  Query Service  │ │ Report Service  │ │   PostgreSQL    │
│   (Port 8082)   │ │   (Port 8081)   │ │   Database      │
│                 │ │                 │ │                 │
└─────────────────┘ └─────────┬───────┘ └─────────┬───────┘
                              │                   │
                              └───────────────────┘
```

### Microsserviços

#### 1. Report Service (Porta 8081)
- **Responsabilidade**: Sistema de registro (write model) das denúncias
- **Funcionalidades**:
  - Receber e validar denúncias de fraude
  - Persistir dados no PostgreSQL
  - Fornecer APIs para consulta de denúncias
- **Endpoints Principais**:
  - `POST /api/reports` - Criar denúncia
  - `GET /api/reports/key/{pixKey}` - Buscar denúncias por chave PIX

#### 2. Query Service (Porta 8082)
- **Responsabilidade**: Sistema de consulta (read model) e análise de risco
- **Funcionalidades**:
  - Consultar denúncias via Report Service
  - Calcular score de risco em tempo real
  - Fornecer análises e recomendações
- **Endpoints Principais**:
  - `POST /api/queries/check-key` - Verificar risco de chave PIX
  - `GET /api/queries/check-key/{pixKey}` - Verificação rápida via GET

### Padrões Arquiteturais
- **CQRS (Command Query Responsibility Segregation)**: Separação entre comandos (Report Service) e consultas (Query Service)
- **Microservices**: Serviços independentes e especializados
- **API-First**: Design orientado por APIs RESTful
- **Database per Service**: Cada serviço possui sua própria responsabilidade de dados

## 🛠️ Stack de Tecnologias

### Backend
- **Java 17**: Linguagem de programação principal
- **Spring Boot 3.2**: Framework para desenvolvimento de microsserviços
- **Spring Data JPA**: Abstração para acesso a dados
- **Spring WebFlux**: Para comunicação reativa entre serviços
- **PostgreSQL 15**: Banco de dados relacional

### DevOps & Containerização
- **Docker**: Containerização dos serviços
- **Docker Compose**: Orquestração local do ambiente
- **Maven**: Gerenciamento de dependências e build

### Testes
- **JUnit 5**: Framework de testes unitários
- **Mockito**: Mock objects para testes
- **TestContainers**: Testes de integração com containers

### Monitoramento
- **Spring Actuator**: Health checks e métricas
- **Micrometer**: Métricas de aplicação

### Justificativas das Escolhas

1. **Java 17 + Spring Boot**: Maturidade, performance, ecossistema robusto
2. **PostgreSQL**: ACID compliance, performance, suporte a JSON
3. **Docker**: Portabilidade, consistência entre ambientes
4. **Comunicação REST**: Simplicidade, padronização, debugabilidade
5. **Arquitetura de Microsserviços**: Escalabilidade, manutenibilidade, separação de responsabilidades

## 🚀 Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados
- Java 17+ (para desenvolvimento local)
- Maven 3.8+ (para desenvolvimento local)

### Execução com Docker (Recomendado)

1. **Clone o repositório**:
```bash
git clone <repository-url>
cd sentinela-pix-bradesco
```

2. **Execute o ambiente completo**:
```bash
docker-compose up --build
```

3. **Aguarde a inicialização** (aproximadamente 2-3 minutos)

4. **Verifique se os serviços estão funcionando**:
   - Report Service: http://localhost:8081/actuator/health
   - Query Service: http://localhost:8082/actuator/health
   - PostgreSQL: Porta 5432

### Execução Local (Desenvolvimento)

1. **Inicie o PostgreSQL**:
```bash
docker run -d --name postgres-sentinela \
  -e POSTGRES_DB=sentinela_pix \
  -e POSTGRES_USER=sentinela_user \
  -e POSTGRES_PASSWORD=sentinela_pass \
  -p 5432:5432 postgres:15-alpine
```

2. **Execute o Report Service**:
```bash
cd report-service
mvn spring-boot:run
```

3. **Execute o Query Service** (em outro terminal):
```bash
cd query-service
mvn spring-boot:run
```

## 📝 Exemplos de Uso da API

### 1. Criar uma Denúncia

```bash
curl -X POST http://localhost:8081/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "reportedPixKey": "golpista@email.com",
    "pixKeyType": "EMAIL",
    "scamCategory": "Falso Perfil no WhatsApp",
    "description": "Recebi mensagem de golpista se passando por familiar pedindo transferência PIX urgente."
  }'
```

**Resposta Esperada**:
```json
{
  "id": 1,
  "reportedPixKey": "golpista@email.com",
  "pixKeyType": "EMAIL",
  "scamCategory": "Falso Perfil no WhatsApp",
  "description": "Recebi mensagem de golpista se passando por familiar pedindo transferência PIX urgente.",
  "timestamp": "2025-10-06T14:30:00"
}
```

### 2. Verificar Risco de uma Chave PIX

```bash
curl -X POST http://localhost:8082/api/queries/check-key \
  -H "Content-Type: application/json" \
  -d '{
    "pixKey": "golpista@email.com"
  }'
```

**Resposta Esperada**:
```json
{
  "pixKey": "golpista@email.com",
  "riskLevel": "LOW",
  "reportCount": 1,
  "summary": "Esta chave PIX possui 1 denúncia registrada em nossa base de dados. Categoria mais comum: Falso Perfil no WhatsApp. Risco baixo, mas mantenha atenção.",
  "assessmentTime": "2025-10-06T14:35:00"
}
```

### 3. Verificação Rápida via GET

```bash
curl http://localhost:8082/api/queries/check-key/golpista@email.com
```

### 4. Listar Todas as Denúncias

```bash
curl http://localhost:8081/api/reports
```

### Cenários de Teste

#### Cenário 1: Chave Sem Denúncias
```bash
curl -X POST http://localhost:8082/api/queries/check-key \
  -H "Content-Type: application/json" \
  -d '{"pixKey": "usuario.legitimo@email.com"}'
```

#### Cenário 2: Múltiplas Denúncias (Alto Risco)
```bash
# Crie múltiplas denúncias para a mesma chave
for i in {1..3}; do
  curl -X POST http://localhost:8081/api/reports \
    -H "Content-Type: application/json" \
    -d "{
      \"reportedPixKey\": \"altorisco@email.com\",
      \"pixKeyType\": \"EMAIL\",
      \"scamCategory\": \"Loja Online Falsa $i\",
      \"description\": \"Descrição da fraude $i\"
    }"
done

# Depois verifique o risco
curl -X POST http://localhost:8082/api/queries/check-key \
  -H "Content-Type: application/json" \
  -d '{"pixKey": "altorisco@email.com"}'
```

## 🧪 Testes

### Executar Testes Unitários

```bash
# Report Service
cd report-service
mvn test

# Query Service
cd query-service
mvn test
```

### Cobertura de Testes
- **Report Service**: Testes para `ReportService` com mock do repositório
- **Query Service**: Testes para `QueryService` com mock do WebClient
- **Cenários Cobertos**:
  - Criação de denúncias
  - Cálculo de níveis de risco
  - Tratamento de erros
  - Diferentes tipos de chave PIX

### Executar Testes de Integração

```bash
# Teste end-to-end com Docker Compose
docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
```

## ☁️ Guia de Implantação na Azure

### Arquitetura na Nuvem
```
Internet → Azure Load Balancer → Container Instances → Azure Database for PostgreSQL
```

### Passo 1: Preparação do Ambiente

1. **Criar Resource Group**:
```bash
az group create --name sentinela-pix-rg --location brazilsouth
```

2. **Criar Azure Database for PostgreSQL**:
```bash
az postgres flexible-server create \
  --resource-group sentinela-pix-rg \
  --name sentinela-pix-db \
  --location brazilsouth \
  --admin-user sentinela_admin \
  --admin-password <senha-segura> \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 15
```

### Passo 2: Build e Push das Imagens

1. **Criar Azure Container Registry**:
```bash
az acr create --resource-group sentinela-pix-rg \
  --name sentinelapixacr --sku Basic
```

2. **Build e Push - Report Service**:
```bash
cd report-service
az acr build --registry sentinelapixacr \
  --image sentinela-pix/report-service:latest .
```

3. **Build e Push - Query Service**:
```bash
cd query-service
az acr build --registry sentinelapixacr \
  --image sentinela-pix/query-service:latest .
```

### Passo 3: Deploy com Container Instances

1. **Deploy Report Service**:
```bash
az container create \
  --resource-group sentinela-pix-rg \
  --name report-service \
  --image sentinelapixacr.azurecr.io/sentinela-pix/report-service:latest \
  --cpu 0.5 --memory 1 \
  --ports 8081 \
  --environment-variables \
    SPRING_PROFILES_ACTIVE=azure \
    SPRING_DATASOURCE_URL=jdbc:postgresql://sentinela-pix-db.postgres.database.azure.com:5432/postgres \
    SPRING_DATASOURCE_USERNAME=sentinela_admin \
    SPRING_DATASOURCE_PASSWORD=<senha-segura>
```

2. **Deploy Query Service**:
```bash
az container create \
  --resource-group sentinela-pix-rg \
  --name query-service \
  --image sentinelapixacr.azurecr.io/sentinela-pix/query-service:latest \
  --cpu 0.5 --memory 1 \
  --ports 8082 \
  --environment-variables \
    SPRING_PROFILES_ACTIVE=azure \
    REPORT_SERVICE_URL=http://<report-service-ip>:8081
```

### Passo 4: Configuração de Rede e Segurança

1. **Criar Application Gateway** (para HTTPS e load balancing)
2. **Configurar Network Security Groups**
3. **Implementar Azure Key Vault** para senhas
4. **Configurar Log Analytics** para monitoramento

### Alternativas de Deploy na Azure

#### Opção 1: Azure App Service for Containers
- **Vantagens**: PaaS, auto-scaling, fácil configuração
- **Uso**: Para ambientes de produção com tráfego variável

#### Opção 2: Azure Kubernetes Service (AKS)
- **Vantagens**: Orquestração avançada, alta disponibilidade
- **Uso**: Para ambientes enterprise com múltiplos serviços

#### Opção 3: Azure Container Apps
- **Vantagens**: Serverless, event-driven, Dapr integration
- **Uso**: Para workloads modernas com padrões cloud-native

## 🔧 Considerações de Produção

### Segurança
- **Autenticação**: Implementar JWT ou OAuth 2.0
- **Autorização**: RBAC para diferentes tipos de usuário
- **Rate Limiting**: Prevenir abuso das APIs
- **Validação**: Sanitização rigorosa de inputs
- **HTTPS**: TLS em todas as comunicações

### Performance
- **Cache**: Redis para consultas frequentes
- **Database**: Índices otimizados, connection pooling
- **Async Processing**: Para operações pesadas
- **CDN**: Para assets estáticos

### Monitoramento
- **APM**: Application Performance Monitoring
- **Logs**: Structured logging com ELK Stack
- **Métricas**: Custom metrics com Prometheus
- **Alertas**: PagerDuty ou similar

### Escalabilidade
- **Horizontal Scaling**: Load balancers
- **Database**: Read replicas, sharding
- **Caching**: Multi-layer caching strategy
- **Message Queues**: RabbitMQ ou Apache Kafka

## 📊 Diretrizes para Artigo Científico

### Tópicos Sugeridos

1. **Decisões de Design**
   - Justificativa da arquitetura CQRS
   - Escolha de tecnologias vs alternativas
   - Trade-offs de performance vs consistência

2. **Padrões de Comunicação entre Microsserviços**
   - REST vs GraphQL vs gRPC
   - Comunicação síncrona vs assíncrona
   - Circuit breaker patterns

3. **Benefícios da Containerização com Docker**
   - Portabilidade entre ambientes
   - Isolamento de dependências
   - Facilidade de deployment

4. **Atendimento aos Requisitos do Bradesco**
   - Demonstração de sistemas distribuídos
   - Aplicação de conceitos mobile-first
   - Prova de conceito funcional

5. **Aprendizados e Melhorias Futuras**
   - Machine Learning para detecção de padrões
   - Integração com PIX DICT
   - Analytics em tempo real

### Estrutura Sugerida do Artigo

1. **Introdução**: Contextualização do problema das fraudes PIX
2. **Revisão Bibliográfica**: Estado da arte em prevenção de fraudes
3. **Metodologia**: Arquitetura e tecnologias escolhidas
4. **Desenvolvimento**: Implementação dos microsserviços
5. **Resultados**: Testes e validação da solução
6. **Discussão**: Análise dos resultados e limitações
7. **Conclusão**: Contribuições e trabalhos futuros

## 👥 Contribuição

Para contribuir com o projeto:
1. Fork o repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças com testes
4. Submeta um Pull Request

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais em parceria com o Bradesco.

---

**Desenvolvido com ❤️ para a segurança do PIX brasileiro**