# Sentinela PIX - Interface Web

Uma interface web moderna e responsiva para o sistema Sentinela PIX de prevenção à fraude.

## 🚀 Características

### Interface Completa
- **Dashboard**: Visão geral do sistema com estatísticas em tempo real
- **Consulta de Risco**: Verificação do nível de risco de chaves PIX
- **Relatório de Fraude**: Formulário para reportar tentativas de golpe
- **Histórico**: Visualização de todos os relatórios com filtros
- **Sobre**: Informações técnicas e documentação da API

### Design Moderno
- Interface responsiva com design gradient
- Animações suaves e transições
- Ícones Font Awesome
- Tipografia Inter
- Tema escuro no cabeçalho
- Cards com sombras e bordas arredondadas

### Funcionalidades
- Integração completa com os microsserviços
- Consultas em tempo real
- Validação de formulários
- Modais para detalhes
- Notificações de erro e sucesso
- Filtros avançados
- Loading states
- Sistema de uptime

## 🛠️ Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna com gradients e animações
- **JavaScript ES6+**: Lógica da aplicação
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia Inter

## 📁 Estrutura de Arquivos

```
web-interface/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript da aplicação
└── README.md           # Este arquivo
```

## 🔧 Como Usar

### Pré-requisitos
1. Report Service rodando na porta 8081
2. Query Service rodando na porta 8082
3. Navegador web moderno

### Executando
1. Abra o arquivo `index.html` em um navegador web
2. Ou sirva os arquivos através de um servidor web local:

```bash
# Usando Python (se disponível)
python -m http.server 8080

# Ou usando Node.js live-server
npx live-server

# Ou usando PHP
php -S localhost:8080
```

3. Acesse `http://localhost:8080` no navegador

## 📱 Seções da Interface

### 1. Dashboard
- Estatísticas em tempo real
- Status do sistema
- Tempo online (uptime)
- Atividade recente
- Gráficos (placeholder para futuras implementações)

### 2. Consultar Chave PIX
- Campo para inserir chave PIX
- Validação automática
- Exibição do nível de risco
- Lista de relatórios associados
- Score de risco detalhado

### 3. Reportar Fraude
- Formulário completo de reporte
- Campos obrigatórios validados
- Categorias de golpe predefinidas
- Confirmação de envio
- Reset automático do formulário

### 4. Histórico
- Tabela com todos os relatórios
- Filtros por categoria e tipo de chave
- Paginação automática
- Modal com detalhes completos
- Ordenação por data

### 5. Sobre
- Informações do projeto
- Detalhes técnicos
- Documentação da API
- Endpoints disponíveis

## 🎨 Paleta de Cores

- **Primária**: Gradiente azul-púrpura (#667eea → #764ba2)
- **Secundária**: Verde-azulado (#4fd1c7 → #81e6d9)
- **Sucesso**: Verde (#38a169)
- **Perigo**: Vermelho (#e53e3e)
- **Aviso**: Laranja (#dd6b20)
- **Info**: Azul (#3182ce)
- **Neutro**: Cinzas (#1a202c → #f7fafc)

## 🔌 Integração com APIs

### Report Service (8081)
- `POST /api/reports` - Criar relatório
- `GET /api/reports` - Listar relatórios
- `GET /api/reports/{id}` - Buscar por ID
- `GET /actuator/health` - Health check

### Query Service (8082)
- `GET /api/query/pix-key/{key}/risk` - Consultar risco
- `GET /api/query/pix-key/{key}/reports` - Relatórios da chave
- `GET /actuator/health` - Health check

## 📊 Funcionalidades Avançadas

### Sistema de Notificações
- Notificações de erro com auto-dismiss
- Feedback visual para todas as ações
- Estados de carregamento

### Validações
- Validação de campos obrigatórios
- Formatação automática de dados
- Sanitização de entrada

### Responsividade
- Design adaptativo para mobile
- Menu colapsável
- Tabelas scrolláveis
- Cards empilháveis

### Performance
- Lazy loading de dados
- Cache de consultas
- Otimização de DOM
- Debounce em filtros

## 🛡️ Segurança

- Sanitização de dados de entrada
- Validação no frontend e backend
- Headers de segurança
- Escape de HTML dinâmico

## 🎯 Próximas Melhorias

- [ ] Gráficos interativos com Chart.js
- [ ] Sistema de autenticação
- [ ] Export de relatórios (PDF/Excel)
- [ ] Notificações push
- [ ] Theme switcher (claro/escuro)
- [ ] PWA capabilities
- [ ] Filtros avançados com data range
- [ ] Busca por texto livre
- [ ] Dashboard personalizado

## 🐛 Tratamento de Erros

- Fallbacks para APIs indisponíveis
- Mensagens amigáveis ao usuário
- Logs detalhados no console
- Retry automático para falhas de rede

## 📈 Métricas

A interface monitora:
- Número de consultas realizadas
- Total de relatórios
- Tempo de uptime do sistema
- Status dos microsserviços
- Atividade recente

## 🎭 Estados da Interface

- **Loading**: Spinners e skeletons
- **Empty**: Mensagens quando não há dados
- **Error**: Notificações de erro
- **Success**: Confirmações de ação
- **Interactive**: Hover e focus states

---

**Desenvolvido para o Bradesco - Sentinela PIX 2025**