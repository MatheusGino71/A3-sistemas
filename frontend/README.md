# 🌐 Sentinela PIX - Frontend Dashboard

## 📋 Visão Geral

Dashboard web moderno e responsivo para o **Sentinela PIX**, construído com tecnologias web padrão e design system consistente. Interface intuitiva para monitoramento em tempo real de fraudes PIX e gerenciamento do sistema anti-fraude.

## ✨ Funcionalidades

### 🏠 **Dashboard Principal**
- **KPIs em Tempo Real**: Métricas de denúncias, bloqueios e notificações
- **Gráficos Interativos**: Visualização de atividade fraudulenta por período
- **Alertas Recentes**: Feed em tempo real de eventos do sistema
- **Distribuição de Risco**: Análise visual dos níveis de risco por chave PIX

### 📊 **Páginas Funcionais**

#### 1️⃣ **Denúncias** (`/reports`)
- Listagem completa de denúncias de fraude
- Filtros por status, prioridade, banco e período
- Formulário para nova denúncia
- Detalhamento de cada caso

#### 2️⃣ **Análise de Risco** (`/risk-analysis`)
- Consulta individual de chaves PIX
- Score de risco detalhado
- Lista de chaves de alto risco
- Histórico de análises

#### 3️⃣ **Notificações** (`/notifications`)
- Log de notificações enviadas
- Status de entrega por banco
- Métricas de sucesso/falha
- Retry de notificações falhadas

#### 4️⃣ **Monitoramento** (`/monitoring`)
- Status dos microsserviços
- Métricas de performance (CPU, memória)
- Uptime e latência
- Health checks automatizados

#### 5️⃣ **Configurações** (`/settings`)
- Configuração de APIs
- Webhooks dos bancos
- Preferências de notificação
- Gestão de usuários

## 🎨 Design System

### 🎯 **Princípios de Design**
- **Clareza**: Informações críticas destacadas
- **Eficiência**: Workflows otimizados para operadores
- **Acessibilidade**: Suporte completo a screen readers
- **Responsividade**: Interface adaptável a todos os dispositivos

### 🎨 **Paleta de Cores**
```css
Primary Blue:   #1193d4  /* Ações principais */
Success Green:  #16a34a  /* Estados positivos */
Warning Orange: #f59e0b  /* Alertas importantes */
Danger Red:     #dc2626  /* Estados críticos */
```

### 🌙 **Dark Mode**
- Tema escuro otimizado para operação 24/7
- Alternância automática baseada nas preferências do sistema
- Contraste otimizado para reduzir fadiga visual

## 🛠️ Stack Tecnológica

### **Frontend**
- **HTML5 Semântico**: Estrutura acessível e SEO-friendly
- **CSS3 + Tailwind**: Styling utilitário com componentes customizados
- **JavaScript Vanilla**: Lógica de aplicação sem dependências externas
- **Web APIs**: Fetch, LocalStorage, Notifications

### **Recursos Avançados**
- **Service Worker**: Cache inteligente e funcionamento offline
- **Web Sockets**: Atualizações em tempo real (futuro)
- **PWA Support**: Instalação como aplicativo nativo
- **Responsive Design**: Mobile-first approach

## 🚀 Instalação e Execução

### **Método 1: Servidor Python (Recomendado)**
```powershell
# Navegue até a pasta frontend
cd sentinela-pix/frontend

# Inicie o servidor local
python -m http.server 8080

# Acesse no navegador
# http://localhost:8080
```

### **Método 2: Servidor Node.js**
```powershell
# Instale o servidor estático global
npm install -g http-server

# Execute na pasta frontend
cd sentinela-pix/frontend
http-server -p 8080

# Acesse no navegador
# http://localhost:8080
```

### **Método 3: Live Server (VS Code)**
1. Instale a extensão "Live Server"
2. Clique direito no arquivo `index.html`
3. Selecione "Open with Live Server"

## 📁 Estrutura de Arquivos

```
frontend/
├── 📄 index.html          # Página principal com todas as views
├── 📄 dashboard.js        # Lógica de navegação e API calls
├── 📄 styles.css          # Estilos customizados e animations
├── 📄 README.md           # Esta documentação
└── 📂 assets/             # Recursos estáticos (futuro)
    ├── 🖼️ images/
    ├── 🎵 sounds/
    └── 📊 data/
```

## 🔧 Configuração e Personalização

### **API Configuration**
```javascript
// Altere a URL base da API no dashboard.js
const apiUrl = 'http://localhost:8080/api/v1';

// Para ambiente de produção
const apiUrl = 'https://api.sentinelapix.com.br/v1';
```

### **Customização de Tema**
```javascript
// Configuração do Tailwind no index.html
tailwind.config = {
    theme: {
        extend: {
            colors: {
                "primary": "#1193d4",      // Cor principal
                "secondary": "#16a34a",     // Cor secundária
                "danger": "#dc2626",        // Cor de perigo
                "warning": "#f59e0b",       // Cor de aviso
            }
        }
    }
}
```

## 📡 Integração com Backend

### **Endpoints Utilizados**
```javascript
// Denúncias
GET  /api/v1/fraud-reports
POST /api/v1/fraud-reports

// Análise de Risco
GET  /api/v1/risk-analysis/{pixKey}
POST /api/v1/risk-analysis/analyze

// Notificações
GET  /api/v1/notifications
POST /api/v1/notifications/send

// Monitoramento
GET  /api/v1/health
GET  /api/v1/metrics
```

### **Formato de Dados**
```javascript
// Exemplo de denúncia
{
    "id": 123,
    "pixKey": "fraudulento@gmail.com",
    "fraudType": "UNAUTHORIZED_TRANSACTION",
    "amount": 1500.00,
    "reporterBank": "001",
    "status": "CONFIRMED",
    "createdAt": "2024-10-17T14:30:00Z"
}

// Exemplo de análise de risco
{
    "pixKey": "usuario@banco.com",
    "riskLevel": "HIGH_RISK",
    "currentScore": 75,
    "totalReports": 4,
    "reports24h": 3,
    "recommendation": "Bloqueio recomendado"
}
```

## 🔄 Funcionalidades em Tempo Real

### **Auto-refresh**
- Atualização automática a cada 30 segundos
- Notificações push para eventos críticos
- Indicadores visuais de conectividade

### **Mock Data**
Para desenvolvimento e demonstração, o dashboard usa dados simulados:
```javascript
// Denúncias de exemplo
const mockReports = [
    {
        pixKey: "fraudulento@gmail.com",
        type: "UNAUTHORIZED_TRANSACTION",
        amount: 1500.00,
        status: "CONFIRMED"
    }
];
```

## 📱 Responsividade

### **Breakpoints**
- **Mobile**: < 768px (design otimizado para touch)
- **Tablet**: 768px - 1024px (layout híbrido)
- **Desktop**: > 1024px (layout completo)

### **Adaptações Mobile**
- Navegação em hambúrguer menu
- Cards empilhados verticalmente  
- Tabelas com scroll horizontal
- Botões de ação ampliados

## 🔒 Segurança Frontend

### **Práticas Implementadas**
- **Content Security Policy**: Prevenção de XSS
- **HTTPS Only**: Comunicação segura (produção)
- **Token Validation**: Verificação de autenticação
- **Input Sanitization**: Limpeza de dados de entrada

## 📊 Analytics e Monitoramento

### **Métricas Coletadas**
- Tempo de carregamento das páginas
- Interações do usuário
- Erros JavaScript
- Performance de API calls

### **Ferramentas Sugeridas**
- **Google Analytics**: Comportamento do usuário
- **Sentry**: Monitoramento de erros
- **New Relic**: Performance monitoring

## 🚀 Próximas Funcionalidades

### **Versão 2.0**
- [ ] **PWA Completo**: Instalação offline
- [ ] **Web Push**: Notificações nativas
- [ ] **WebRTC**: Chat em tempo real
- [ ] **GraphQL**: Queries otimizadas

### **Versão 3.0**
- [ ] **React Migration**: Framework moderno
- [ ] **TypeScript**: Tipagem estática
- [ ] **Micro-frontends**: Arquitetura escalável
- [ ] **AI Integration**: Análises preditivas

## 🧪 Testes

### **Testes Manuais**
```powershell
# Checklist de funcionalidades
1. ✅ Navegação entre páginas
2. ✅ Alternância de tema dark/light
3. ✅ Responsividade mobile
4. ✅ Carregamento de dados mock
5. ✅ Análise de risco PIX
6. ✅ Filtros e buscas
```

### **Testes Automatizados** (Futuro)
- Unit tests com Jest
- E2E tests com Cypress
- Visual regression com Percy
- Performance tests com Lighthouse

## 📞 Suporte e Contribuição

### **Como Contribuir**
1. Fork do repositório
2. Crie branch para feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit das alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abra Pull Request

### **Reportar Issues**
- Use template de bug report
- Inclua screenshots e logs
- Especifique browser e versão
- Descreva passos para reproduzir

---

**Dashboard Sentinela PIX** - Interface moderna para combater fraudes PIX no Brasil 🇧🇷🛡️

*Desenvolvido com foco na experiência do usuário e eficiência operacional.*