import { test, expect } from '@playwright/test';

/**
 * Testes E2E para Homepage
 */

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve carregar a página inicial', async ({ page }) => {
    await expect(page).toHaveTitle(/ZENIT/i);
    await expect(page.locator('h1')).toContainText('ZENIT');
  });

  test('deve exibir a estrela do logo', async ({ page }) => {
    const logo = page.locator('img[alt*="estrela"], img[alt*="ZENIT"]');
    await expect(logo).toBeVisible();
  });

  test('deve ter botões de Login e Cadastro', async ({ page }) => {
    const loginButton = page.getByRole('link', { name: /login|entrar/i });
    const signupButton = page.getByRole('link', { name: /cadastr|registr/i });
    
    await expect(loginButton).toBeVisible();
    await expect(signupButton).toBeVisible();
  });

  test('deve navegar para página de login', async ({ page }) => {
    await page.getByRole('link', { name: /login|entrar/i }).click();
    await expect(page).toHaveURL(/login/);
  });

  test('deve navegar para página de cadastro', async ({ page }) => {
    await page.getByRole('link', { name: /cadastr|registr/i }).click();
    await expect(page).toHaveURL(/cadastro/);
  });

  test('deve ser responsivo', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });
});
