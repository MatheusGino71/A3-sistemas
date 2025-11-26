# Configuração do CI/CD Pipeline - GitHub Actions

## 📋 Visão Geral

O pipeline de CI/CD do ZENIT está configurado para executar automaticamente em:
- **Push** para branches `main` ou `develop`
- **Pull Requests** para branches `main` ou `develop`

## 🔧 Jobs Configurados

### 1. 🔍 Lint e Validação
- Valida código Node.js
- Verifica especificação OpenAPI
- Executa auditoria de vulnerabilidades

### 2. 🧪 Testes Backend
- Executa suite completa de testes Jest
- Gera relatório de cobertura de código
- Upload para Codecov (opcional)

### 3. 🏗️ Build Backend
- Instala dependências de produção
- Cria artefato compactado
- Armazena por 7 dias

### 4. 🎨 Testes Frontend
- Valida HTML5
- Verifica existência de arquivos críticos

### 5. 🔒 Análise de Segurança
- CodeQL para análise estática
- TruffleHog para detectar secrets expostos

### 6. 🐳 Build Docker
- Constrói imagem Docker
- Push para Docker Hub (apenas branch main)
- Cache otimizado com GitHub Actions

### 7. 🚀 Deploy Staging
- Deploy automático para ambiente de staging
- Apenas em push para branch `main`
- Verificação de health check

### 8. 📢 Notificações
- Envia email em caso de sucesso ou falha
- Inclui detalhes do commit e autor

## 🔐 Secrets Necessários

Configure os seguintes secrets no GitHub (Settings → Secrets and variables → Actions):

### Docker Hub (Opcional)
```
DOCKER_USERNAME     # Usuário do Docker Hub
DOCKER_PASSWORD     # Senha ou token do Docker Hub
```

### Deploy Staging (Opcional)
```
STAGING_HOST        # IP ou domínio do servidor de staging
STAGING_USER        # Usuário SSH para deploy
STAGING_SSH_KEY     # Chave privada SSH (formato PEM)
```

### Notificações Email (Opcional)
```
MAIL_USERNAME       # Email SMTP (ex: seu-email@gmail.com)
MAIL_PASSWORD       # Senha de aplicativo do Gmail
NOTIFY_EMAIL        # Email para receber notificações
```

## 📝 Como Configurar Secrets

### 1. Acessar Configurações
1. Vá para seu repositório no GitHub
2. Clique em **Settings**
3. Na sidebar, clique em **Secrets and variables** → **Actions**
4. Clique em **New repository secret**

### 2. Docker Hub
Se quiser fazer push automático de imagens Docker:

1. Crie uma conta em https://hub.docker.com
2. Gere um Access Token em Account Settings → Security
3. Adicione os secrets:
   - `DOCKER_USERNAME`: seu username do Docker Hub
   - `DOCKER_PASSWORD`: o access token gerado

### 3. Deploy Staging (SSH)
Se tiver um servidor para deploy:

1. Gere um par de chaves SSH:
```bash
ssh-keygen -t rsa -b 4096 -C "github-actions@zenit" -f ~/.ssh/zenit_deploy
```

2. Copie a chave pública para o servidor:
```bash
ssh-copy-id -i ~/.ssh/zenit_deploy.pub usuario@seu-servidor.com
```

3. Adicione os secrets:
   - `STAGING_HOST`: IP ou domínio do servidor
   - `STAGING_USER`: usuário SSH
   - `STAGING_SSH_KEY`: conteúdo completo da chave privada (~/.ssh/zenit_deploy)

### 4. Notificações Email (Gmail)
Para receber emails sobre deploys:

1. Ative a verificação em 2 etapas na sua conta Google
2. Gere uma senha de aplicativo:
   - Acesse: https://myaccount.google.com/apppasswords
   - Selecione "Mail" e "Other"
   - Copie a senha gerada

3. Adicione os secrets:
   - `MAIL_USERNAME`: seu-email@gmail.com
   - `MAIL_PASSWORD`: senha de 16 dígitos gerada
   - `NOTIFY_EMAIL`: email para receber notificações

## 🎯 Variáveis de Ambiente para Testes

O pipeline configura automaticamente estas variáveis durante os testes:

```yaml
NODE_ENV: test
JWT_SECRET: test_secret_key_for_ci
DATABASE_PATH: ':memory:'
PORT: 3001
CORS_ORIGINS: http://localhost:8080
SMTP_HOST: smtp.gmail.com
SMTP_PORT: 587
SMTP_USER: test@example.com
SMTP_PASS: testpassword
CACHE_TTL_SECONDS: 30
RATE_LIMIT_WINDOW_MS: 900000
RATE_LIMIT_MAX_REQUESTS: 100
```

## 🚀 Executando Localmente

Para testar o pipeline localmente antes de fazer push:

### 1. Instalar Act (GitHub Actions local)
```bash
# Windows (Chocolatey)
choco install act-cli

# macOS
brew install act

# Linux
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

### 2. Executar Jobs Localmente
```bash
# Executar todos os jobs
act

# Executar apenas testes
act -j test-backend

# Executar com secrets
act -s DOCKER_USERNAME=seu-usuario -s DOCKER_PASSWORD=sua-senha
```

## 📊 Codecov (Opcional)

Para integrar com Codecov e visualizar cobertura de testes:

1. Acesse https://codecov.io e faça login com GitHub
2. Adicione o repositório ZENIT
3. Copie o token gerado
4. Adicione o secret `CODECOV_TOKEN` no GitHub

O upload de cobertura já está configurado no workflow.

## 🔧 Customização

### Alterar Node.js Version
Edite a variável no início do arquivo `.github/workflows/ci.yml`:

```yaml
env:
  NODE_VERSION: '20.x'  # Alterar para a versão desejada
```

### Desabilitar Jobs Opcionais
Para desabilitar jobs que não precisa:

```yaml
# Comentar ou remover o job completo
# docker:
#   name: 🐳 Build Docker
#   ...
```

### Alterar Branches
Para executar em outras branches:

```yaml
on:
  push:
    branches: [ main, develop, feature/* ]  # Adicionar padrões
```

## 📈 Monitoramento

### Ver Status do Pipeline
1. Vá para a aba **Actions** no repositório
2. Clique no workflow "CI/CD Pipeline"
3. Veja histórico de execuções e logs detalhados

### Badges
Adicione badges ao README para mostrar status:

```markdown
![CI/CD](https://github.com/seu-usuario/zenit/actions/workflows/ci.yml/badge.svg)
```

## 🆘 Troubleshooting

### Testes Falhando
```bash
# Executar testes localmente
cd sentinela-pix/backend
npm test
```

### Build Docker Falhando
```bash
# Testar build localmente
cd sentinela-pix
docker build -t zenit:test .
```

### Deploy SSH Falhando
```bash
# Testar conexão SSH
ssh -i ~/.ssh/zenit_deploy usuario@servidor.com "echo 'Conexão OK'"
```

## 📚 Recursos Adicionais

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Codecov Documentation](https://docs.codecov.com/)

## 🎉 Próximos Passos

1. ✅ Configure os secrets necessários
2. ✅ Faça um commit e push para testar o pipeline
3. ✅ Verifique a aba Actions para ver o resultado
4. ✅ Configure notificações para ficar informado
5. ✅ Adicione badge do CI/CD ao README
