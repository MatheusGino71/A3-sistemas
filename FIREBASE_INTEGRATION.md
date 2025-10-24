# Integração Firebase - Sentinela PIX

## 🔥 O que foi implementado

A autenticação do sistema Sentinela PIX foi migrada para o **Firebase Authentication** e **Firestore**, substituindo o sistema anterior baseado em SQLite + JWT.

## 📋 Arquivos modificados

### 1. `frontend/firebase-config.js` (NOVO)
- Arquivo de configuração centralizado do Firebase
- Inicializa os serviços: Authentication, Firestore, Storage e Analytics
- Exporta instâncias para uso em todo o projeto

### 2. `frontend/cadastro.html`
**Mudanças:**
- Substituído `fetch()` para backend por `createUserWithEmailAndPassword()` do Firebase Auth
- Dados adicionais (nome, sobrenome, CPF, telefone, banco) são salvos no Firestore
- Mensagens de erro específicas do Firebase (email duplicado, senha fraca, etc.)
- Usa `type="module"` para importar o Firebase

**Fluxo de cadastro:**
```
1. Usuário preenche formulário
2. Firebase Auth cria usuário com email/senha
3. Firestore salva dados adicionais em /users/{uid}
4. localStorage atualizado com uid, nome, email
5. Redirecionamento para dashboard.html
```

### 3. `frontend/login.html`
**Mudanças:**
- Substituído `fetch()` para backend por `signInWithEmailAndPassword()` do Firebase Auth
- Busca dados adicionais do Firestore após login
- Tratamento de erros específicos do Firebase
- Usa `type="module"` para importar o Firebase

**Fluxo de login:**
```
1. Usuário digita email/senha
2. Firebase Auth autentica credenciais
3. Busca dados do usuário no Firestore /users/{uid}
4. localStorage atualizado com todos os dados
5. Redirecionamento para dashboard.html
```

### 4. `frontend/dashboard.html`
**Mudanças:**
- Adicionado `onAuthStateChanged()` para verificar autenticação
- Redireciona para login.html se não autenticado
- Busca dados atualizados do Firestore ao carregar
- Função global `handleLogout()` para desconectar

**Proteção de rota:**
```javascript
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
    }
});
```

## 🔐 Estrutura de dados no Firestore

### Coleção: `users`
Documento ID: `{uid}` (gerado pelo Firebase Auth)

```json
{
  "nome": "João",
  "sobrenome": "Silva",
  "email": "joao@example.com",
  "cpf": "12345678900",
  "telefone": "11999999999",
  "banco": "Bradesco",
  "createdAt": "2025-01-23T12:00:00.000Z",
  "updatedAt": "2025-01-23T12:00:00.000Z"
}
```

## 🎯 Vantagens da integração Firebase

### 1. **Segurança**
- Autenticação gerenciada pelo Google
- Tokens JWT automáticos e seguros
- Proteção contra ataques de força bruta
- Criptografia de senhas em nível empresarial

### 2. **Escalabilidade**
- Banco de dados NoSQL escalável (Firestore)
- Sem necessidade de gerenciar servidores
- Alta disponibilidade global

### 3. **Recursos adicionais prontos**
- Login social (Google, Facebook, GitHub, etc.) - fácil de adicionar
- Redefinição de senha automática por email
- Verificação de email
- Autenticação multifator (MFA)

### 4. **Analytics integrado**
- Rastreamento automático de eventos
- Métricas de usuários ativos
- Funil de conversão

## 📦 Dependências

**Firebase SDK via CDN:**
- firebase-app: 10.7.1
- firebase-auth: 10.7.1
- firebase-firestore: 10.7.1
- firebase-storage: 10.7.1
- firebase-analytics: 10.7.1

## 🚀 Como usar

### Cadastro de novo usuário:
1. Acesse `http://localhost:8080/cadastro.html`
2. Preencha todos os campos
3. Clique em "Criar Conta"
4. Verifique no Firebase Console se o usuário foi criado

### Login:
1. Acesse `http://localhost:8080/login.html`
2. Digite email e senha
3. Clique em "Entrar"
4. Você será redirecionado para o dashboard

### Logout:
- Basta chamar `handleLogout()` de qualquer lugar do dashboard
- O usuário será desconectado e redirecionado para login

## 🔍 Verificação no Firebase Console

1. Acesse: https://console.firebase.google.com
2. Selecione o projeto: **a3-quinta-1a763**
3. Navegue até:
   - **Authentication > Users**: Ver usuários cadastrados
   - **Firestore Database > users**: Ver dados adicionais
   - **Analytics**: Ver métricas de uso

## ⚠️ Observações importantes

### Backend atual (backend/server.js)
- As rotas `/api/v1/users/register` e `/api/v1/users/login` **não são mais usadas**
- Podem ser removidas ou mantidas como fallback
- Os relatórios de fraude ainda usam o backend Node.js + SQLite

### Próximos passos sugeridos:
1. **Migrar relatórios de fraude para Firestore** (opcional)
   - Criar coleções: `fraudReports`, `riskAnalysis`, `notifications`
   - Usar regras de segurança do Firestore para controle de acesso

2. **Adicionar login social** (fácil com Firebase)
   ```javascript
   import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
   const provider = new GoogleAuthProvider();
   await signInWithPopup(auth, provider);
   ```

3. **Implementar recuperação de senha**
   ```javascript
   import { sendPasswordResetEmail } from 'firebase/auth';
   await sendPasswordResetEmail(auth, email);
   ```

4. **Adicionar verificação de email**
   ```javascript
   import { sendEmailVerification } from 'firebase/auth';
   await sendEmailVerification(user);
   ```

## 🐛 Troubleshooting

### Erro: "Failed to load firebase-config.js"
- Certifique-se de que o servidor está rodando na porta 8080
- Verifique se o arquivo `firebase-config.js` está na pasta `frontend/`

### Erro: "auth/network-request-failed"
- Verifique sua conexão com a internet
- Confirme se as chaves do Firebase estão corretas

### Erro: "Firestore: Missing or insufficient permissions"
- Acesse Firebase Console > Firestore > Rules
- Configure as regras de segurança adequadas

## 📝 Regras de segurança recomendadas (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita apenas do próprio usuário
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Relatórios de fraude (exemplo)
    match /fraudReports/{reportId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## ✅ Checklist de migração

- [x] Firebase configurado e inicializado
- [x] Cadastro usando Firebase Auth
- [x] Login usando Firebase Auth
- [x] Dados adicionais salvos no Firestore
- [x] Proteção de rota no dashboard
- [x] Função de logout implementada
- [ ] Migração de dados existentes do SQLite (se necessário)
- [ ] Testes completos de fluxo de autenticação
- [ ] Configurar regras de segurança no Firestore
- [ ] Adicionar recuperação de senha
- [ ] Adicionar verificação de email

## 📚 Documentação oficial

- Firebase Auth: https://firebase.google.com/docs/auth
- Firestore: https://firebase.google.com/docs/firestore
- Firebase Web SDK: https://firebase.google.com/docs/web/setup
