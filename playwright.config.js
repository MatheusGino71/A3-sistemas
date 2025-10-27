import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para testes E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* Execução paralela */
  fullyParallel: true,
  
  /* Falhar o build no CI se deixou test.only */
  forbidOnly: !!process.env.CI,
  
  /* Retry em caso de falha (CI) */
  retries: process.env.CI ? 2 : 0,
  
  /* Workers paralelos */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter */
  reporter: [
    ['html', { outputFolder: 'tests/reports/playwright' }],
    ['json', { outputFile: 'tests/reports/test-results.json' }],
    ['list']
  ],
  
  /* Configuração compartilhada */
  use: {
    /* URL base */
    baseURL: process.env.BASE_URL || 'http://localhost:8080',
    
    /* Screenshot apenas em falhas */
    screenshot: 'only-on-failure',
    
    /* Vídeo apenas em falhas */
    video: 'retain-on-failure',
    
    /* Trace em falhas */
    trace: 'on-first-retry',
    
    /* Timeout para ações */
    actionTimeout: 10000,
  },

  /* Configurar projetos para diferentes navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /* Descomente para testar em outros navegadores
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    */
  ],

  /* Servidor de desenvolvimento local */
  webServer: [
    {
      command: 'cd backend && node server.js',
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: 'cd frontend && python -m http.server 8080',
      url: 'http://localhost:8080',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    }
  ],
});
