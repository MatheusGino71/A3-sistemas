/**
 * Registro do Service Worker e inicialização PWA
 * ZENIT - Sistema Anti-Fraude PIX
 */

// ==========================================
// Verificar suporte a Service Workers
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    registerServiceWorker();
    checkForUpdates();
  });
}

// ==========================================
// Registrar Service Worker
// ==========================================
async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    });

    console.log('[PWA] Service Worker registrado com sucesso:', registration.scope);

    // Atualizar quando houver nova versão
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Nova versão disponível
          showUpdateNotification();
        }
      });
    });

    return registration;
  } catch (error) {
    console.error('[PWA] Erro ao registrar Service Worker:', error);
  }
}

// ==========================================
// Verificar atualizações
// ==========================================
async function checkForUpdates() {
  if (!navigator.serviceWorker) return;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      registration.update();
      console.log('[PWA] Verificando atualizações...');
    }
  } catch (error) {
    console.error('[PWA] Erro ao verificar atualizações:', error);
  }
}

// ==========================================
// Mostrar notificação de atualização
// ==========================================
function showUpdateNotification() {
  console.log('[PWA] Nova versão disponível');

  const notification = document.createElement('div');
  notification.id = 'pwa-update-notification';
  notification.innerHTML = `
    <div class="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <div class="flex-1">
          <p class="font-semibold">Nova versão disponível!</p>
          <p class="text-sm opacity-90">Atualize para a versão mais recente</p>
        </div>
      </div>
      <div class="mt-3 flex gap-2">
        <button onclick="reloadApp()" 
                class="flex-1 bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition">
          Atualizar Agora
        </button>
        <button onclick="dismissUpdateNotification()" 
                class="px-4 py-2 rounded font-medium hover:bg-blue-700 transition">
          Depois
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(notification);
}

function dismissUpdateNotification() {
  const notification = document.getElementById('pwa-update-notification');
  if (notification) {
    notification.remove();
  }
}

function reloadApp() {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
  }
  window.location.reload();
}

// ==========================================
// Detectar se está instalado como PWA
// ==========================================
function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

// ==========================================
// Prompt de instalação PWA
// ==========================================
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevenir prompt automático
  e.preventDefault();
  deferredPrompt = e;
  
  console.log('[PWA] App pode ser instalado');
  
  // Mostrar botão de instalação customizado
  showInstallPrompt();
});

function showInstallPrompt() {
  // Verificar se já está instalado
  if (isPWA()) {
    console.log('[PWA] App já está instalado');
    return;
  }

  const installBanner = document.createElement('div');
  installBanner.id = 'pwa-install-banner';
  installBanner.innerHTML = `
    <div class="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-lg shadow-2xl z-50">
      <div class="flex items-start gap-3">
        <img src="/assets/estrela.png" alt="ZENIT" class="w-12 h-12">
        <div class="flex-1">
          <p class="font-bold text-lg">Instalar ZENIT</p>
          <p class="text-sm opacity-90 mt-1">
            Adicione o ZENIT à sua tela inicial para acesso rápido e offline
          </p>
        </div>
        <button onclick="dismissInstallPrompt()" class="text-white hover:text-gray-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="mt-3 flex gap-2">
        <button onclick="installPWA()" 
                class="flex-1 bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
          Instalar
        </button>
        <button onclick="dismissInstallPrompt()" 
                class="px-4 py-2 rounded-lg font-medium hover:bg-red-800 transition">
          Agora não
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(installBanner);

  // Auto-remover após 30 segundos
  setTimeout(() => {
    dismissInstallPrompt();
  }, 30000);
}

function dismissInstallPrompt() {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) {
    banner.remove();
  }
}

async function installPWA() {
  if (!deferredPrompt) {
    console.log('[PWA] Prompt de instalação não disponível');
    return;
  }

  // Mostrar prompt nativo
  deferredPrompt.prompt();

  // Aguardar escolha do usuário
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log('[PWA] Resultado da instalação:', outcome);

  if (outcome === 'accepted') {
    console.log('[PWA] App instalado com sucesso');
  } else {
    console.log('[PWA] Instalação cancelada pelo usuário');
  }

  // Limpar prompt
  deferredPrompt = null;
  dismissInstallPrompt();
}

// ==========================================
// Detectar quando o app é instalado
// ==========================================
window.addEventListener('appinstalled', () => {
  console.log('[PWA] App foi instalado');
  deferredPrompt = null;
  
  // Mostrar mensagem de sucesso
  if (typeof showNotification === 'function') {
    showNotification('success', 'ZENIT instalado com sucesso!', 'Agora você pode acessar offline');
  }
});

// ==========================================
// Sincronização em Background
// ==========================================
async function registerBackgroundSync(tag) {
  if (!('serviceWorker' in navigator) || !('sync' in ServiceWorkerRegistration.prototype)) {
    console.log('[PWA] Background Sync não suportado');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(tag);
    console.log('[PWA] Background sync registrado:', tag);
    return true;
  } catch (error) {
    console.error('[PWA] Erro ao registrar background sync:', error);
    return false;
  }
}

// ==========================================
// Verificar conectividade
// ==========================================
function updateOnlineStatus() {
  const isOnline = navigator.onLine;
  console.log('[PWA] Status de conexão:', isOnline ? 'Online' : 'Offline');

  // Atualizar UI
  const statusIndicator = document.getElementById('online-status');
  if (statusIndicator) {
    statusIndicator.textContent = isOnline ? '🟢 Online' : '🔴 Offline';
    statusIndicator.className = isOnline 
      ? 'text-green-600 font-medium' 
      : 'text-red-600 font-medium';
  }

  // Tentar sincronizar quando voltar online
  if (isOnline && 'serviceWorker' in navigator) {
    registerBackgroundSync('sync-reports');
  }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// ==========================================
// Exportar funções globais
// ==========================================
window.reloadApp = reloadApp;
window.dismissUpdateNotification = dismissUpdateNotification;
window.dismissInstallPrompt = dismissInstallPrompt;
window.installPWA = installPWA;
window.registerBackgroundSync = registerBackgroundSync;
window.isPWA = isPWA;

console.log('[PWA] PWA Manager inicializado');
