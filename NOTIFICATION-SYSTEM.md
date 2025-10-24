# 🔔 Sistema de Notificações - Sentinela PIX

## Visão Geral

O Sistema de Notificações do Sentinela PIX oferece uma experiência completa de gerenciamento de notificações em tempo real, integrado com Firebase e backend Node.js.

## 📋 Funcionalidades

### 1. **Dropdown de Notificações**
- Badge dinâmico com contador de notificações não lidas
- Lista de notificações com scroll personalizado
- Notificações categorizadas por tipo (alerta, sucesso, informação)
- Timestamps relativos ("5min atrás", "2h atrás", etc.)
- Marcação visual de notificações não lidas
- Botão "Marcar todas como lidas"

### 2. **Menu de Usuário**
- Avatar com iniciais geradas automaticamente
- Nome e email do usuário (carregados do Firebase/localStorage)
- Opções de menu:
  - 👤 Meu Perfil
  - ⚙️ Configurações
  - 🔔 Preferências de Notificações
  - 🚪 Sair

### 3. **Sistema Automático**
- Verificação de novas notificações a cada 30 segundos
- Toast de notificação quando novas mensagens chegam
- Cache local para performance (localStorage)
- Sincronização com backend quando disponível

## 🎨 Design

### Cores por Tipo de Notificação
- **Vermelho** (`red`): Alertas e fraudes detectadas
- **Verde** (`green`): Confirmações e sucessos
- **Azul** (`blue`): Informações gerais
- **Amarelo** (`yellow`): Avisos

### Ícones Material Symbols
- `warning` - Alertas
- `check_circle` - Sucessos
- `info` - Informações
- `error` - Erros

## 🔧 Arquitetura

### Frontend (`user-system.js`)

```javascript
// Classes principais
NotificationSystem      // Gerencia notificações
UserProfileSystem       // Gerencia perfil do usuário

// Métodos principais
loadNotifications()     // Carrega notificações do backend
renderNotifications()   // Renderiza lista de notificações
markAsRead(id)          // Marca notificação como lida
markAllAsRead()         // Marca todas como lidas
checkNewNotifications() // Verifica novas notificações (polling)
```

### Backend (`server.js`)

```javascript
// Endpoints
GET  /api/v1/notifications?userId={uid}       // Buscar notificações
PUT  /api/v1/notifications/:id/read           // Marcar como lida
PUT  /api/v1/notifications/read-all           // Marcar todas como lidas
GET  /api/v1/notifications/check?userId={uid} // Verificar novas
```

### Banco de Dados (SQLite)

```sql
CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    fraud_report_id TEXT,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    icon TEXT DEFAULT 'info',
    color TEXT DEFAULT 'blue',
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 📦 Instalação

### 1. Backend já está configurado
As alterações no `server.js` já incluem:
- ✅ Tabela de notificações criada automaticamente
- ✅ Endpoints de API prontos
- ✅ Migrações de colunas

### 2. Frontend já está configurado
Os arquivos foram criados/atualizados:
- ✅ `user-system.js` - Sistema completo
- ✅ `dashboard.html` - Dropdowns integrados
- ✅ Estilos e animações adicionados

## 🚀 Como Usar

### Para Usuários

1. **Ver Notificações**
   - Clique no ícone de sino 🔔 no header
   - Badge vermelho mostra número de não lidas

2. **Ler Notificação**
   - Clique em qualquer notificação
   - Será marcada automaticamente como lida

3. **Marcar Todas como Lidas**
   - Clique em "Marcar todas como lidas" no topo do dropdown

4. **Menu de Usuário**
   - Clique no avatar no canto superior direito
   - Acesse perfil, configurações ou saia do sistema

### Para Desenvolvedores

#### Adicionar Nova Notificação (Backend)

```javascript
// Inserir notificação no banco
db.run(`INSERT INTO notifications (id, user_id, type, title, message, icon, color) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
       [uuid(), userId, 'alert', 'Fraude Detectada', 'Nova tentativa...', 'warning', 'red']);
```

#### Adicionar Notificação (Frontend - Para testes)

```javascript
// No console do navegador
notificationSystem.addNotification({
    type: 'success',
    title: 'Teste de Notificação',
    message: 'Esta é uma notificação de teste',
    icon: 'check_circle',
    color: 'green'
});
```

## 🔄 Fluxo de Dados

```
1. Backend detecta evento (fraude, relatório, etc.)
   ↓
2. Backend insere notificação no banco de dados
   ↓
3. Frontend faz polling a cada 30s (checkNewNotifications)
   ↓
4. Se houver novas, chama loadNotifications()
   ↓
5. renderNotifications() atualiza UI
   ↓
6. Badge é atualizado com contador
   ↓
7. Toast aparece avisando o usuário
```

## 🎯 Próximas Funcionalidades

### Em Desenvolvimento
- ⏳ Página de perfil do usuário completa
- ⏳ Página de configurações
- ⏳ Preferências de notificações (email, push, etc.)

### Planejadas
- 🔮 WebSocket para notificações em tempo real (substituir polling)
- 🔮 Firebase Cloud Messaging (notificações push)
- 🔮 Filtros de notificações por tipo
- 🔮 Histórico completo de notificações
- 🔮 Notificações por email
- 🔮 Sons personalizáveis para notificações

## 🐛 Troubleshooting

### Notificações não aparecem

**Problema**: Dropdown vazio mesmo após login

**Solução**:
1. Verifique se há `user.uid` no localStorage
2. Abra o console: `localStorage.getItem('user')`
3. Verifique se backend está rodando: `http://localhost:3001/health`
4. Teste o endpoint: `http://localhost:3001/api/v1/notifications?userId=SEU_UID`

### Badge não atualiza

**Problema**: Contador de notificações não lidas não muda

**Solução**:
1. Limpe o cache: `localStorage.removeItem('notifications')`
2. Recarregue a página
3. Verifique no console se há erros de JavaScript

### Toast não aparece

**Problema**: Notificação nova mas sem toast visual

**Solução**:
1. Verifique se a animação CSS está carregada
2. Procure por `@keyframes slide-in` no `<style>`
3. Teste manualmente: `notificationSystem.showNewNotificationToast()`

## 📝 Exemplos de Uso

### Criar Notificação de Fraude Detectada

```javascript
// Backend - Após detectar fraude
const notificationId = require('crypto').randomUUID();
db.run(`INSERT INTO notifications 
        (id, user_id, fraud_report_id, type, title, message, icon, color) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
       [notificationId, userId, reportId, 'alert', 
        'Nova tentativa de fraude detectada',
        `Chave PIX ${pixKey} foi bloqueada automaticamente`,
        'warning', 'red']);
```

### Criar Notificação de Relatório Processado

```javascript
// Backend - Após processar relatório
db.run(`INSERT INTO notifications 
        (id, user_id, fraud_report_id, type, title, message, icon, color) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
       [notificationId, userId, reportId, 'success',
        'Relatório processado com sucesso',
        `Seu relatório #${reportId.slice(0, 8)} foi analisado`,
        'check_circle', 'green']);
```

## 🔐 Segurança

- ✅ Notificações são isoladas por `user_id`
- ✅ Backend valida `userId` em todos os endpoints
- ✅ Firestore rules limitam acesso a notificações próprias
- ✅ Token JWT valida autenticação em rotas protegidas

## 📊 Performance

- **Cache local**: Notificações são salvas no localStorage
- **Polling inteligente**: Verifica apenas se há novas (não recarrega todas)
- **Lazy rendering**: Renderiza apenas notificações visíveis
- **Debounce**: Evita múltiplas chamadas simultâneas

## 🎨 Customização

### Alterar intervalo de verificação

```javascript
// Em user-system.js, linha 17
setInterval(() => this.checkNewNotifications(), 30000); // 30 segundos

// Alterar para 60 segundos:
setInterval(() => this.checkNewNotifications(), 60000);
```

### Adicionar novo tipo de notificação

```javascript
// 1. Adicionar cor no createNotificationHTML()
const colorClasses = {
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' // NOVO
};

// 2. Usar no addNotification()
notificationSystem.addNotification({
    type: 'custom',
    title: 'Notificação Especial',
    message: 'Mensagem personalizada',
    icon: 'star',
    color: 'purple'
});
```

## 📚 Referências

- [Tailwind CSS](https://tailwindcss.com/docs)
- [Material Symbols](https://fonts.google.com/icons)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)

## 🤝 Contribuindo

Para adicionar novas funcionalidades ao sistema de notificações:

1. Atualize a tabela no `server.js` se necessário
2. Crie o endpoint no backend
3. Adicione o método no `NotificationSystem` class
4. Teste com notificações de exemplo
5. Documente as mudanças neste README

---

**Versão**: 1.0.0  
**Última Atualização**: Outubro 2025  
**Autor**: Sentinela PIX Team
