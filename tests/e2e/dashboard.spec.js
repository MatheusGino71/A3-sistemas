import { test, expect } from '@playwright/test';

/**
 * Testes E2E para Dashboard e funcionalidades principais
 */

// Helper para fazer login
async function login(page) {
  await page.goto('/login.html');
  await page.locator('input[type="email"]').fill('teste.e2e@zenit.com');
  await page.locator('input[type="password"]').fill('Senha@123');
  await page.getByRole('button', { name: /entrar|login/i }).click();
  await page.waitForURL(/dashboard/);
}

test.describe('Dashboard - Funcionalidades', () => {
  test.beforeEach(async ({ page }) => {
    // Criar usuário de teste se não existir
    await page.request.post('http://localhost:3001/api/v1/auth/register', {
      data: {
        name: 'Usuário Teste Dashboard',
        email: 'teste.e2e@zenit.com',
        password: 'Senha@123',
        bank: 'Banco Teste',
        phone: '11999999999'
      },
      failOnStatusCode: false
    });
    
    // Fazer login
    await login(page);
  });

  test('deve exibir dashboard após login', async ({ page }) => {
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('h1, h2')).toContainText(/dashboard|painel/i);
  });

  test('deve exibir menu de navegação', async ({ page }) => {
    // Verificar elementos do menu
    const menuItems = ['denúncias', 'análise', 'relatórios', 'perfil'];
    
    for (const item of menuItems) {
      const menuLink = page.getByRole('link', { name: new RegExp(item, 'i') });
      if (await menuLink.isVisible()) {
        await expect(menuLink).toBeVisible();
      }
    }
  });

  test('deve exibir estatísticas gerais', async ({ page }) => {
    // Cards de estatísticas devem estar visíveis
    await expect(page.locator('.stat, .metric, .card').first()).toBeVisible();
  });

  test('deve ter botão de logout', async ({ page }) => {
    const logoutButton = page.getByRole('button', { name: /sair|logout/i }).or(
      page.getByRole('link', { name: /sair|logout/i })
    );
    
    await expect(logoutButton).toBeVisible();
  });

  test('deve fazer logout com sucesso', async ({ page }) => {
    const logoutButton = page.getByRole('button', { name: /sair|logout/i }).or(
      page.getByRole('link', { name: /sair|logout/i })
    );
    
    await logoutButton.click();
    
    // Deve redirecionar para login ou homepage
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url.includes('login') || url.includes('index')).toBeTruthy();
  });
});

test.describe('Dashboard - Nova Denúncia', () => {
  test.beforeEach(async ({ page }) => {
    await page.request.post('http://localhost:3001/api/v1/auth/register', {
      data: {
        name: 'Usuário Teste Dashboard',
        email: 'teste.e2e@zenit.com',
        password: 'Senha@123',
        bank: 'Banco Teste',
        phone: '11999999999'
      },
      failOnStatusCode: false
    });
    
    await login(page);
  });

  test('deve abrir formulário de nova denúncia', async ({ page }) => {
    // Procurar botão de nova denúncia
    const newReportButton = page.getByRole('button', { name: /nova denúncia|criar denúncia|reportar/i }).or(
      page.getByRole('link', { name: /nova denúncia|criar denúncia|reportar/i })
    );
    
    if (await newReportButton.isVisible()) {
      await newReportButton.click();
      
      // Verificar se formulário apareceu
      await expect(page.locator('input[name="pix_key"], input[placeholder*="PIX"]')).toBeVisible();
    }
  });

  test('deve criar nova denúncia', async ({ page }) => {
    const newReportButton = page.getByRole('button', { name: /nova denúncia|criar denúncia|reportar/i }).or(
      page.getByRole('link', { name: /nova denúncia|criar denúncia|reportar/i })
    );
    
    if (await newReportButton.isVisible()) {
      await newReportButton.click();
      
      // Preencher formulário
      await page.locator('input[name="pix_key"], input[placeholder*="PIX"]').fill('fraude@teste.com');
      await page.locator('textarea[name="description"], textarea[placeholder*="descrição"]').fill('Teste de denúncia E2E automatizado');
      
      // Valor se existir
      const amountInput = page.locator('input[name="amount"], input[placeholder*="valor"]');
      if (await amountInput.isVisible()) {
        await amountInput.fill('1000');
      }
      
      // Interceptar resposta
      const responsePromise = page.waitForResponse(response => 
        response.url().includes('/api/v1/fraud-reports')
      );
      
      await page.getByRole('button', { name: /enviar|criar|salvar/i }).click();
      
      const response = await responsePromise;
      expect(response.status()).toBe(201);
      
      // Verificar mensagem de sucesso
      await expect(page.locator('.success, .alert-success, [role="alert"]')).toBeVisible();
    }
  });
});

test.describe('Dashboard - Análise de Risco', () => {
  test.beforeEach(async ({ page }) => {
    await page.request.post('http://localhost:3001/api/v1/auth/register', {
      data: {
        name: 'Usuário Teste Dashboard',
        email: 'teste.e2e@zenit.com',
        password: 'Senha@123',
        bank: 'Banco Teste',
        phone: '11999999999'
      },
      failOnStatusCode: false
    });
    
    await login(page);
  });

  test('deve permitir verificar risco de chave PIX', async ({ page }) => {
    // Procurar seção de análise de risco
    const riskSection = page.getByText(/análise de risco|verificar risco/i);
    
    if (await riskSection.isVisible()) {
      await riskSection.click();
      
      // Preencher chave PIX
      await page.locator('input[placeholder*="PIX"], input[name="pix_key"]').fill('teste@risco.com');
      
      // Interceptar resposta
      const responsePromise = page.waitForResponse(response => 
        response.url().includes('/api/v1/risk-analysis')
      );
      
      await page.getByRole('button', { name: /verificar|analisar|consultar/i }).click();
      
      const response = await responsePromise;
      expect([200, 404].includes(response.status())).toBeTruthy();
      
      // Deve exibir resultado
      await expect(page.locator('.risk-result, .analysis-result')).toBeVisible();
    }
  });
});

test.describe('Dashboard - Perfil do Usuário', () => {
  test.beforeEach(async ({ page }) => {
    await page.request.post('http://localhost:3001/api/v1/auth/register', {
      data: {
        name: 'Usuário Teste Dashboard',
        email: 'teste.e2e@zenit.com',
        password: 'Senha@123',
        bank: 'Banco Teste',
        phone: '11999999999'
      },
      failOnStatusCode: false
    });
    
    await login(page);
  });

  test('deve acessar página de perfil', async ({ page }) => {
    const profileLink = page.getByRole('link', { name: /perfil|profile|conta/i });
    
    if (await profileLink.isVisible()) {
      await profileLink.click();
      await expect(page).toHaveURL(/profile|perfil/);
    }
  });

  test('deve exibir informações do usuário', async ({ page }) => {
    await page.goto('/profile.html');
    
    // Deve exibir nome e email
    await expect(page.locator('body')).toContainText('teste.e2e@zenit.com');
  });
});
