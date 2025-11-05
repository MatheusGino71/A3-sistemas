# Documentação do Projeto ZENIT

## Visão Geral do Projeto
ZENIT é uma plataforma anti-fraude para transações do PIX, desenvolvida para proteger contra vulnerabilidades e fraudes instantâneas.

## Declaração do Problema
As transações instantâneas no sistema PIX apresentam vulnerabilidades, lacunas de comunicação e restrições de tempo que precisam ser abordadas para garantir a segurança e a confiança dos usuários.

## Arquitetura da Solução em Três Pilares
1. **Sistema de Notificação em Tempo Real com WebSocket:** Para alertar os usuários imediatamente sobre atividades suspeitas.
2. **Pontuação de Risco Dinâmica com Múltiplas Variáveis:** Avalia o risco associado a cada transação em tempo real.
3. **Prevenção Proativa com Verificação Pré-transação:** Avalia as transações antes da sua conclusão para prevenir fraudes.

## Lista Abrangente de Funcionalidades
- **Gerenciamento de Usuários:** Implementação com Firebase Auth e JWT.
- **Sistema de Relato de Fraudes:** Permite aos usuários relatar fraudes com facilidade.
- **Algoritmo de Análise de Risco:** Analisa transações para detectar fraudes potenciais.
- **Notificações em Tempo Real via WebSocket:** Notificações instantâneas para os usuários.
- **Push FCM:** Envio de notificações push relevantes para os usuários.
- **Painel Analítico com KPIs:** Monitoramento e análise de desempenho da plataforma.
- **PWA com Service Workers:** Aplicação web progressiva para uma experiência de usuário otimizada.
- **Segurança Avançada com Limitação de Taxa e Validação:** Protege a plataforma contra abusos.
- **Monitoramento com Prometheus e Grafana:** Ferramentas de monitoramento e visualização de dados para garantir a operacionalidade.

## Diagrama de Arquitetura Atual do Node.js
- **Frontend PWA**
- **Express.js API Gateway** com limitador de taxa / validação / autenticação JWT
- **Camada de Serviços** com relatórios de fraude / análise de risco / notificações
- **Camada de Dados SQLite** com usuários / relatórios / chaves PIX / pontuações de risco
- **Camada de Monitoramento** com Prometheus / Grafana / Winston  

## Diagrama da Arquitetura Futura em Java  
- **Frontend PWA**
- **Spring Cloud Gateway** com balanceador de carga
- **Três Serviços Spring Boot** para relato de fraudes / análise de risco / notificações
- **RabbitMQ** como fila de mensagens
- **Banco de Dados PostgreSQL**  

## Tabela de Pilha de Tecnologias
| Tecnologia                        | Node.js Implementação           | Java Objetivo                   |
|-----------------------------------|----------------------------------|----------------------------------|
| Backend                           | Node.js + Express.js            | Java 17 + Spring Boot 3 + Spring Cloud |
| Banco de Dados                    | SQLite + Firebase Firestore      | PostgreSQL + Redis              |
| Comunicação                       | REST + WebSocket                 | REST + RabbitMQ                |
| Autenticação                     | Firebase Auth + JWT             | Spring Security + JWT           |
| Frontend                         | HTML5 + Tailwind CSS + Vanilla JS| HTML5 + Tailwind CSS + Vanilla JS|
| DevOps                           | Docker + Nginx + GitHub Actions | Docker + GitHub Actions + Kubernetes |
| Monitoramento                     | Prometheus + Grafana            | Prometheus + Grafana + ELK Stack |

## Instruções de Execução Local
### Pré-requisitos
- Node.js 18+
- Python 3
- Conta Firebase

### Passos de Configuração
1. **Clonar o repositório:** `git clone <URL do repositório>`.
2. **Configuração do Backend:**
   - Criar um arquivo `.env` com as credenciais necessárias.
   - Executar `npm install` para instalar as dependências.
3. **Configuração do Frontend:**
   - Configurar o arquivo `firebase-config.js`.
   - Obter a chave VAPID e configurá-la.

### Comandos de Execução
- **Linux/macOS:** `sh start-zenit.sh`
- **Windows PowerShell:** `powershell start-zenit.ps1`
- **Manual:** Usar `npm start` para o backend e executar `python -m http.server` no frontend na porta 8080.

### URLs de Acesso
- Frontend: [localhost:8080](http://localhost:8080)
- Backend API: [localhost:3001](http://localhost:3001)
- Documentação da API: [localhost:3001/api/docs](http://localhost:3001/api/docs)

## Execução de Microserviços com Docker
- Executar: `docker-compose up --build`
- Acessar:  
  - Frontend  
  - API do Backend  
  - Monitoramento Prometheus na porta 9090  
  - Grafana na porta 3000 (credenciais: admin/admin)  
  - RabbitMQ Management na porta 15672 (credenciais: guest/guest)  

## Documentação da API
- Especificação OpenAPI 3.0 em `docs/openapi.yaml`
- Guia detalhado em `docs/API-DOCUMENTATION.md`
- Swagger UI em [localhost:3001/api/docs](http://localhost:3001/api/docs)

### Endpoints de Autenticação
- `POST /api/auth/register`: Registro de novo usuário
- `POST /api/auth/login`: Autenticação de usuário
- `GET /api/auth/profile`: Recuperação do perfil do usuário

### Endpoints de Relato de Fraudes
- `GET /api/reports`: Listar todos os relatos
- `POST /api/reports`: Criar um novo relato
- `GET /api/reports/:id`: Detalhes do relato
- `PUT /api/reports/:id`: Atualizar relato
- `DELETE /api/reports/:id`: Deletar relato

### Endpoints de Análise de Risco
- `POST /api/risk/analyze`: Analisar chave PIX
- `GET /api/risk/pix-key/:key`: Obter pontuação da chave
- `GET /api/risk/history`: Histórico de análises

### Autenticação com JWT Bearer Token
- Utilizar o cabeçalho `Authorization` para enviar o token.
- Limitação de Taxa:  
  - Autenticação: 5 solicitações a cada 15 minutos  
  - API Geral: 100 solicitações a cada 15 minutos  
  - Relatos: 10 criações por hora  
  - Análise de Risco: 30 consultas por minuto

## Informações sobre Testes E2E e Unitários
- **Playwright:** para testes E2E  
  - Comandos:  
  - `cd tests`  
  - `npm install`  
  - `npx playwright install`  
  - `npm test`: rodar todos os testes  
  - `npm run test:report`: gerar relatório  
  - `npx playwright test --ui`: modo interativo  
  - `npx playwright test --headed`: visualizar navegador  
- **JUnit para Java:** para testes unitários com Maven
  - `cd microservices/fraud-report-service`  
  - `mvn test`

### Cobertura de Testes
- Autenticação: 95%  
- Relatos: 90%  
- Análise de Risco: 85%  
- Dashboard: 80%  

## Detalhes do Pipeline CI/CD
- Workflow do GitHub Actions em `.github/workflows/ci.yml`
- Linting automático para verificação de código  
- Execução de testes unitários e E2E  
- Análise de segurança com CodeQL e TruffleHog  
- Builds e pushes de imagens Docker  
- Deployment automático em staging

## Configuração de Monitoramento
- Endpoint Prometheus: `/metrics`
- Painéis Grafana em [localhost:3000](http://localhost:3000) (credenciais: admin/admin)
- Métricas disponíveis: taxa de requisições HTTP, latência de requisições p50/p95/p99, taxa de erro por endpoint, conexões WebSocket ativas, consultas ao banco de dados, relatórios criados, análises de risco executadas, uso de CPU e memória.
- Painéis incluídos: Visão Geral do ZENIT, Desempenho da API, Métricas do Sistema, KPIs de Negócio.

## Implementações de Segurança
- Autenticação JWT para sessões seguras  
- Firebase Auth para autenticação de terceiros  
- Limitação de taxa contra ataques de força bruta e DDoS  
- Validação de entradas com sanitização  
- Helmet.js para cabeçalhos de segurança HTTP  
- Bcrypt para hash seguro de senhas  
- HTTPS apenas em produção  
- Configuração CORS restritiva  
- Proteção contra injeção SQL com instruções preparadas e ORM  
- Proteção contra XSS com Política de Segurança de Conteúdo  
- Registro abrangente de auditoria para ações sensíveis.

## Estrutura Completa do Projeto
- **Pasta Backend:** `server.js`, `package.json`, `.env.example`, subpasta middleware com `rateLimiter.js` e `validation.js`, subpasta services com `emailService.js`, subpasta utils com `logger.js` e `metrics.js`
- **Pasta Frontend:** `index.html`, `dashboard.html`, `dashboard.js`, `firebase-config.js`, `service-worker.js`, `manifest.json`
- **Pasta Microserviços:** para arquitetura futura com subpastas `api-gateway`, `fraud-report-service`, `notification-service`, `risk-analysis-service`
- **Pasta Docs:** `openapi.yaml` e `API-DOCUMENTATION.md`
- **Pasta Monitoramento:** `prometheus.yml` e subpasta grafana`
- **Pasta Tests:** subpasta e2e
- `docker-compose.yml` para desenvolvimento, `docker-compose.prod.yml` para produção, `README.md`

## Recursos Detalhados do Dashboard Frontend
- **Painel Principal:** KPIs em tempo real para relatórios / bloqueios / notificações, gráficos interativos para visualização de atividades fraudulentas, feed de alertas recentes, análise da distribuição de riscos.
- **Páginas Funcionais:**  
  - Página de Relatos: listagem completa de relatos de fraudes com filtros por status / prioridade / banco / período, formulário para novos relatos, visualização detalhada do caso.  
  - Página de Análise de Risco: consulta individual da chave PIX, pontuação de risco detalhada, lista de chaves de alto risco, histórico de análises.  
  - Página de Notificações: log de notificações enviadas, status de entrega por banco, métricas de sucesso/falha.  
  - Página de Monitoramento: status de microserviços, métricas de desempenho de CPU/memória, uptime e latência, verificações de saúde automatizadas.  
  - Página de Configurações: configuração da API, webhooks bancários, preferências de notificações, gerenciamento de usuários.
- **Sistema de Design:**  
  - Princípios: clareza para destacar informações críticas, eficiência com fluxos de trabalho otimizados, acessibilidade com suporte para leitores de tela, responsividade para todos os dispositivos;
- **Paleta de Cores:** Azul Primário #1193d4 para ações principais, Verde de Sucesso #16a34a para estados positivos, Laranja de Alerta #f59e0b para alertas importantes, Vermelho de Perigo #dc2626 para estados críticos;
- **Modo Escuro:** otimizado para operação 24/7 com troca automática com base nas preferências do sistema e contraste otimizado para reduzir a fadiga visual;
- **Adaptações para Móvel:** menu de navegação tipo hambúrguer, cartões dispostos verticalmente, tabelas roláveis horizontalmente, botões de ação ampliados.  

## Guia de Implantação no Azure
**Arquitetura:** Internet para Azure Load Balancer para Container Instances para Azure Database for PostgreSQL;
### Passo 1: Preparação do Ambiente
- Criar grupo de recursos: `az group create --name sentinela-pix-rg --location brazilsouth`
- Criar PostgreSQL: `az postgres flexible-server create` especificando o grupo de recursos, nome, localização, usuário administrador e senha segura, SKU e etc.  
### Passo 2: Criar e Enviar Imagens
- Criar Azure Container Registry: `az acr create --resource-group sentinela-pix-rg --name sentinelapixacr --sku Basic`  
- Construir e enviar Report Service: `cd report-service && az acr build --registry sentinelapixacr --image sentinela-pix/report-service:latest .`  
- Construir e enviar o Query Service: `cd query-service && az acr build --registry sentinelapixacr --image sentinela-pix/query-service:latest .`  
### Passo 3: Implantar com Container Instances
- Implantar Report Service: `az container create` especificando o grupo de recursos e outras variáveis como URL, etc.  
### Passo 4: Configuração de Rede e Segurança  
- Criar Application Gateway para HTTPS e balanceamento de carga, configurar Security Groups e implementar Azure Key Vault para senhas, informar Log Analytics para monitoramento.
### Alternativas de Implantação:  
1. Azure App Service for Containers: PaaS, escalabilidade, fácil configuração para produção.  
2. Azure Kubernetes Service AKS: orquestração avançada, alta disponibilidade.  
3. Azure Container Apps: workload nativa em nuvem com integração Dapr.

## Considerações de Produção
**Segurança:** implementar JWT ou OAuth 2.0, RBAC, rigorosa sanitização de entradas, TLS em todas as comunicações;
**Desempenho:** Redis, otimização de caches, processamentos assíncronos;
**Monitoramento:** APM, logs estruturados com ELK, métricas personalizadas;
**Escalabilidade:** balanceadores de carga, replicas de leitura, caches em múltiplas camadas.

## Informações de Licença
Desenvolvido para fins acadêmicos como parte do curso de Sistemas de Informação, Licença MIT.

## Detalhes da Equipe
Projeto Acadêmico ZENIT A3 2024/2025.
Desenvolvedor: Matheus Gino.
Repositório: [github.com/MatheusGino71/A3-sistemas](http://github.com/MatheusGino71/A3-sistemas).
Contato via GitHub: @MatheusGino71 ou GitHub Issues.
Agradecimentos ao Banco Central do Brasil pela infraestrutura do PIX, à comunidade Node.js e JavaScript, à Firebase pela plataforma de hospedagem e a todos os colaboradores e testadores.