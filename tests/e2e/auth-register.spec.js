import { test, expect } from '@playwright/test';

/**
 * Testes E2E para Cadastro de Usuário
 */

test.describe('Autenticação - Cadastro', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cadastro.html');
  });

  test('deve exibir formulário de cadastro', async ({ page }) => {
    await expect(page.locator('input[name="name"], input[placeholder*="nome"]')).toBeVisible();
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('input[name="bank"], input[placeholder*="banco"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /cadastr|registr/i })).toBeVisible();
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    await page.getByRole('button', { name: /cadastr|registr/i }).click();
    
    // Verificar atributo required nos campos
    const nameInput = page.locator('input[name="name"], input[placeholder*="nome"]').first();
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    
    await expect(nameInput).toHaveAttribute('required');
    await expect(emailInput).toHaveAttribute('required');
  });

  test('deve validar formato de email', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    
    await emailInput.fill('email-invalido');
    await page.getByRole('button', { name: /cadastr|registr/i }).click();
    
    const validationMessage = await emailInput.evaluate(el => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('deve validar força da senha', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first();
    
    // Senha fraca
    await passwordInput.fill('123');
    await passwordInput.blur();
    
    // Deve mostrar feedback (se implementado)
    // Ajustar conforme implementação real
  });

  test('deve criar novo usuário com sucesso', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `user${timestamp}@test.com`;
    
    // Preencher formulário
    await page.locator('input[name="name"], input[placeholder*="nome"]').first().fill('Usuário Teste');
    await page.locator('input[type="email"], input[name="email"]').fill(testEmail);
    await page.locator('input[type="password"]').first().fill('Senha@123');
    
    // Confirmação de senha se existir
    const confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    if (await confirmPasswordInput.isVisible()) {
      await confirmPasswordInput.fill('Senha@123');
    }
    
    await page.locator('input[name="bank"], input[placeholder*="banco"]').fill('Banco Teste');
    
    // Telefone se existir
    const phoneInput = page.locator('input[name="phone"], input[placeholder*="telefone"]');
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('11999999999');
    }
    
    // Interceptar resposta de sucesso
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/v1/auth/register')
    );
    
    await page.getByRole('button', { name: /cadastr|registr/i }).click();
    
    const response = await responsePromise;
    expect(response.status()).toBe(201);
    
    // Deve redirecionar ou mostrar mensagem de sucesso
    await page.waitForTimeout(1000);
    
    const currentUrl = page.url();
    const isRedirected = currentUrl.includes('login') || currentUrl.includes('dashboard');
    const hasSuccessMessage = await page.locator('.success, .alert-success, [role="alert"]').isVisible();
    
    expect(isRedirected || hasSuccessMessage).toBeTruthy();
  });

  test('deve impedir cadastro com email duplicado', async ({ page }) => {
    const duplicateEmail = 'duplicate@test.com';
    
    // Primeiro cadastro
    await page.request.post('http://localhost:3001/api/v1/auth/register', {
      data: {
        name: 'Primeiro Usuario',
        email: duplicateEmail,
        password: 'Senha@123',
        bank: 'Banco 1',
        phone: '11999999991'
      }
    });
    
    // Tentar cadastrar novamente com mesmo email
    await page.locator('input[name="name"], input[placeholder*="nome"]').first().fill('Segundo Usuario');
    await page.locator('input[type="email"], input[name="email"]').fill(duplicateEmail);
    await page.locator('input[type="password"]').first().fill('Senha@123');
    await page.locator('input[name="bank"], input[placeholder*="banco"]').fill('Banco 2');
    
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/v1/auth/register')
    );
    
    await page.getByRole('button', { name: /cadastr|registr/i }).click();
    
    const response = await responsePromise;
    expect(response.status()).toBe(400);
    
    // Verificar mensagem de erro
    await expect(page.locator('.error, .alert-danger, [role="alert"]')).toBeVisible();
  });

  test('deve ter link para login', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /já tem conta|login|entrar/i });
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await expect(page).toHaveURL(/login/);
  });

  test('deve ser responsivo', async ({ page }) => {
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('button', { name: /cadastr|registr/i })).toBeVisible();
    
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('button', { name: /cadastr|registr/i })).toBeVisible();
  });
});
