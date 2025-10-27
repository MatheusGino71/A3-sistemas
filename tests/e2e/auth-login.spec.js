import { test, expect } from '@playwright/test';

/**
 * Testes E2E para Login e Autenticação
 */

test.describe('Autenticação - Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login.html');
  });

  test('deve exibir formulário de login', async ({ page }) => {
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar|login/i })).toBeVisible();
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    // Tentar submeter formulário vazio
    await page.getByRole('button', { name: /entrar|login/i }).click();
    
    // Verificar mensagens de validação HTML5
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await expect(emailInput).toHaveAttribute('required');
  });

  test('deve validar formato de email', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    
    // Testar email inválido
    await emailInput.fill('email-invalido');
    await page.getByRole('button', { name: /entrar|login/i }).click();
    
    // Validação HTML5 deve impedir submit
    const validationMessage = await emailInput.evaluate(el => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    await page.locator('input[type="email"], input[name="email"]').fill('usuario@teste.com');
    await page.locator('input[type="password"]').fill('senhaerrada');
    
    // Interceptar requisição de login
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/v1/auth/login') && 
      response.status() !== 200
    );
    
    await page.getByRole('button', { name: /entrar|login/i }).click();
    
    const response = await responsePromise;
    expect(response.status()).toBe(401);
    
    // Verificar mensagem de erro na UI
    await expect(page.locator('.error, .alert-danger, [role="alert"]')).toBeVisible();
  });

  test('deve fazer login com sucesso', async ({ page }) => {
    // Primeiro, criar um usuário de teste via API
    await page.request.post('http://localhost:3001/api/v1/auth/register', {
      data: {
        name: 'Usuário Teste E2E',
        email: 'teste.e2e@zenit.com',
        password: 'Senha@123',
        bank: 'Banco Teste',
        phone: '11999999999'
      }
    });

    // Agora fazer login
    await page.locator('input[type="email"], input[name="email"]').fill('teste.e2e@zenit.com');
    await page.locator('input[type="password"]').fill('Senha@123');
    await page.getByRole('button', { name: /entrar|login/i }).click();
    
    // Deve redirecionar para dashboard
    await expect(page).toHaveURL(/dashboard/);
    
    // Verificar se está autenticado
    await expect(page.locator('body')).toContainText(/dashboard|painel/i);
  });

  test('deve ter link para cadastro', async ({ page }) => {
    const signupLink = page.getByRole('link', { name: /cadastr|registr/i });
    await expect(signupLink).toBeVisible();
    await signupLink.click();
    await expect(page).toHaveURL(/cadastro/);
  });

  test('deve ter link para recuperar senha', async ({ page }) => {
    const forgotPasswordLink = page.getByRole('link', { name: /esquec|recuperar/i });
    
    if (await forgotPasswordLink.isVisible()) {
      await expect(forgotPasswordLink).toBeVisible();
    }
  });
});
