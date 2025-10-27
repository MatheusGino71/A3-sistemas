# 🧪 Guia de Testes E2E - ZENIT

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configuração](#configuração)
3. [Executando Testes](#executando-testes)
4. [Estrutura dos Testes](#estrutura-dos-testes)
5. [Escrevendo Novos Testes](#escrevendo-novos-testes)
6. [CI/CD Integration](#cicd-integration)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Os testes E2E (End-to-End) do ZENIT utilizam **Playwright** para validar fluxos completos da aplicação, simulando interações reais de usuários.

### Cobertura de Testes

- ✅ **Homepage** - Navegação inicial, responsividade
- ✅ **Autenticação** - Login, cadastro, validações
- ✅ **Dashboard** - Funcionalidades principais, menu, logout
- ✅ **Denúncias** - Criação de novas denúncias
- ✅ **Análise de Risco** - Verificação de chaves PIX
- ✅ **Perfil** - Visualização de dados do usuário

---

## 🔧 Configuração

### 1. Instalar Dependências

```bash
# Na raiz do projeto
npm install

# Instalar navegadores do Playwright
npx playwright install
```

### 2. Verificar Configuração

O arquivo `playwright.config.js` já está configurado com:

- **Base URL**: http://localhost:8080
- **Timeout**: 10 segundos por ação
- **Screenshots**: Apenas em falhas
- **Vídeos**: Apenas em falhas
- **Reports**: HTML + JSON

### 3. Servidores

Os testes iniciam automaticamente:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:8080

---

## 🚀 Executando Testes

### Comandos Básicos

```bash
# Executar todos os testes
npm test

# Executar com interface visual
npm run test:headed

# Executar com UI interativa
npm run test:ui

# Debug mode (passo a passo)
npm run test:debug

# Ver relatório HTML
npm run test:report

# Executar apenas Chromium
npm run test:chromium
```

### Executar Testes Específicos

```bash
# Apenas homepage
npx playwright test homepage

# Apenas autenticação
npx playwright test auth

# Apenas dashboard
npx playwright test dashboard

# Apenas um arquivo
npx playwright test tests/e2e/auth-login.spec.js
```

### Executar com Filtros

```bash
# Apenas testes que contenham "login"
npx playwright test -g "login"

# Ignorar testes que contenham "skip"
npx playwright test --grep-invert "skip"
```

---

## 📂 Estrutura dos Testes

```
tests/
└── e2e/
    ├── homepage.spec.js         # Testes da página inicial
    ├── auth-login.spec.js       # Testes de login
    ├── auth-register.spec.js    # Testes de cadastro
    └── dashboard.spec.js        # Testes do dashboard
```

### Estrutura de um Teste

```javascript
import { test, expect } from '@playwright/test';

test.describe('Grupo de Testes', () => {
  test.beforeEach(async ({ page }) => {
    // Setup antes de cada teste
    await page.goto('/');
  });

  test('deve fazer algo específico', async ({ page }) => {
    // 1. Arrange - Preparar
    const button = page.getByRole('button', { name: /clique/i });
    
    // 2. Act - Agir
    await button.click();
    
    // 3. Assert - Verificar
    await expect(page).toHaveURL(/sucesso/);
  });
});
```

---

## ✍️ Escrevendo Novos Testes

### 1. Criar Novo Arquivo

```bash
# Criar arquivo de teste
touch tests/e2e/meu-teste.spec.js
```

### 2. Template Básico

```javascript
import { test, expect } from '@playwright/test';

test.describe('Minha Feature', () => {
  test('deve funcionar corretamente', async ({ page }) => {
    await page.goto('/minha-pagina');
    
    // Seu teste aqui
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### 3. Locators Recomendados

```javascript
// ✅ BOM - Por role (acessibilidade)
page.getByRole('button', { name: /enviar/i })
page.getByRole('link', { name: /login/i })

// ✅ BOM - Por texto
page.getByText('Bem-vindo')
page.getByLabel('Email')

// ✅ BOM - Por placeholder
page.getByPlaceholder('Digite seu email')

// ⚠️ EVITAR - Por classe ou ID (frágil)
page.locator('.my-class')
page.locator('#my-id')
```

### 4. Assertions Comuns

```javascript
// Visibilidade
await expect(element).toBeVisible()
await expect(element).toBeHidden()

// Texto
await expect(element).toContainText('texto')
await expect(element).toHaveText('texto exato')

// URL
await expect(page).toHaveURL(/dashboard/)
await expect(page).toHaveTitle(/ZENIT/)

// Atributos
await expect(element).toHaveAttribute('required')
await expect(element).toHaveClass(/active/)

// Estado
await expect(checkbox).toBeChecked()
await expect(button).toBeEnabled()
```

---

## 🔄 CI/CD Integration

### GitHub Actions

Os testes são executados automaticamente no CI/CD:

```yaml
# .github/workflows/ci.yml
- name: Test Frontend
  run: |
    npm install
    npx playwright install --with-deps chromium
    npm test
```

### Variáveis de Ambiente

```bash
# CI mode
CI=true npm test

# Custom base URL
BASE_URL=https://staging.zenit.com npm test
```

---

## 🐛 Troubleshooting

### Problema: Testes Falhando Aleatoriamente

**Solução**: Aumentar timeouts

```javascript
test.use({ 
  actionTimeout: 15000,
  navigationTimeout: 30000 
});
```

### Problema: Servidor não inicia

**Solução**: Verificar portas

```bash
# Windows
netstat -ano | findstr :3001
netstat -ano | findstr :8080

# Matar processo
taskkill /PID <pid> /F
```

### Problema: Elemento não encontrado

**Solução**: Esperar pelo elemento

```javascript
// Esperar visibilidade
await page.waitForSelector('.my-element', { state: 'visible' });

// Esperar resposta da API
await page.waitForResponse(response => 
  response.url().includes('/api/v1/')
);
```

### Problema: Screenshot/Vídeo não salvando

**Solução**: Verificar configuração

```javascript
// playwright.config.js
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
}
```

### Debug: Ver o que está acontecendo

```bash
# Modo debug (abre DevTools)
npm run test:debug

# Headed mode (ver browser)
npm run test:headed

# UI mode (interface interativa)
npm run test:ui

# Trace viewer (replay)
npx playwright show-trace trace.zip
```

---

## 📊 Reports

### HTML Report

```bash
# Gerar e abrir relatório
npm run test:report
```

O relatório inclui:
- ✅ Testes passados/falhados
- 📸 Screenshots de falhas
- 🎥 Vídeos de falhas
- 📝 Logs detalhados
- ⏱️ Tempos de execução

### JSON Report

Localizado em: `tests/reports/test-results.json`

Útil para integração com outras ferramentas.

---

## 🎯 Melhores Práticas

### 1. Isolamento de Testes

```javascript
// ✅ Cada teste deve ser independente
test('teste 1', async ({ page }) => {
  // Não depende de outros testes
});

test('teste 2', async ({ page }) => {
  // Não depende de outros testes
});
```

### 2. Evitar Sleeps

```javascript
// ❌ RUIM
await page.waitForTimeout(5000);

// ✅ BOM
await page.waitForSelector('.loaded');
await page.waitForResponse(res => res.url().includes('/api/'));
```

### 3. Usar Page Object Model

```javascript
// pages/LoginPage.js
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.getByRole('button', { name: /login/i });
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// Uso
const loginPage = new LoginPage(page);
await loginPage.login('user@test.com', 'password');
```

### 4. Limpar Dados de Teste

```javascript
test.afterEach(async ({ page }) => {
  // Limpar cookies
  await page.context().clearCookies();
  
  // Limpar localStorage
  await page.evaluate(() => localStorage.clear());
});
```

---

## 📚 Recursos

- **Playwright Docs**: https://playwright.dev/
- **Best Practices**: https://playwright.dev/docs/best-practices
- **API Reference**: https://playwright.dev/docs/api/class-page
- **VS Code Extension**: Playwright Test for VSCode

---

## 🤝 Contribuindo

### Adicionar Novo Teste

1. Criar arquivo em `tests/e2e/`
2. Seguir padrão de nomenclatura: `feature.spec.js`
3. Adicionar descrição clara do que testa
4. Executar localmente antes de commitar
5. Verificar se passa no CI

### Review Checklist

- [ ] Testes são independentes
- [ ] Usa locators acessíveis (role, text, label)
- [ ] Não usa timeouts fixos
- [ ] Tem assertions claras
- [ ] Falhas geram screenshots úteis
- [ ] Documentação atualizada

---

**🌟 ZENIT** - Sistema Anti-Fraude PIX  
*Testes automatizados para qualidade garantida!*
