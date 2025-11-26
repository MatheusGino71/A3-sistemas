// Service Worker para ZENIT - Progressive Web App
const CACHE_NAME = 'zenit-v1.0.0';
const CACHE_VERSION = '1.0.0';

// Arquivos para cache offline
const STATIC_CACHE = [
  '/',
  '/index.html',
  '/login.html',
  '/cadastro.html',
  '/dashboard.html',
  '/profile.html',
  '/settings.html',
  '/styles.css',
  '/dashboard.js',
  '/user-system.js',
  '/firebase-config.js',
  '/backend-config.js',
  '/assets/estrela.png',
  'https://cdn.tailwindcss.com'
];

// URLs de API que devem usar estratégia Network First
const API_URLS = [
  '/api/v1/'
];

// ==========================================
// Instalação do Service Worker
// ==========================================
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker versão', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache criado, adicionando arquivos estáticos');
        return cache.addAll(STATIC_CACHE.map(url => new Request(url, { cache: 'reload' })));
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error('[SW] Erro ao criar cache:', error);
      })
  );
});

// ==========================================
// Ativação do Service Worker
// ==========================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando Service Worker versão', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // Remover caches antigos
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Removendo cache antigo:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// ==========================================
// Interceptação de Requisições
// ==========================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições não-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }

  // Ignorar requisições de métricas e WebSocket
  if (url.pathname === '/metrics' || url.pathname === '/ws') {
    return;
  }

  // Estratégia para requisições de API: Network First
  if (isApiRequest(request.url)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Estratégia para arquivos estáticos: Cache First
  event.respondWith(cacheFirst(request));
});

// ==========================================
// Estratégias de Cache
// ==========================================

/**
 * Cache First: Tenta buscar do cache, se não encontrar busca da rede
 * Ideal para: CSS, JS, imagens, fontes
 */
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[SW] Cache hit:', request.url);
      return cachedResponse;
    }

    console.log('[SW] Cache miss, buscando da rede:', request.url);
    const networkResponse = await fetch(request);

    // Cache apenas se for sucesso
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Erro em cacheFirst:', error);
    
    // Tentar retornar página offline
    if (request.destination === 'document') {
      return caches.match('/index.html');
    }
    
    throw error;
  }
}

/**
 * Network First: Tenta buscar da rede, se falhar busca do cache
 * Ideal para: Requisições de API, dados dinâmicos
 */
async function networkFirst(request) {
  try {
    console.log('[SW] Network first para:', request.url);
    const networkResponse = await fetch(request);

    // Cache apenas se for sucesso
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Rede falhou, tentando cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    // Retornar resposta de erro
    return new Response(JSON.stringify({
      success: false,
      message: 'Sem conexão com a internet',
      offline: true
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Verifica se a requisição é para a API
 */
function isApiRequest(url) {
  return API_URLS.some(apiUrl => url.includes(apiUrl));
}

// ==========================================
// Sincronização em Background
// ==========================================
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-reports') {
    event.waitUntil(syncReports());
  }
});

async function syncReports() {
  console.log('[SW] Sincronizando denúncias pendentes...');
  
  try {
    // Aqui você pode implementar lógica para enviar denúncias armazenadas offline
    const cache = await caches.open(CACHE_NAME);
    // Implementar lógica de sincronização
  } catch (error) {
    console.error('[SW] Erro ao sincronizar:', error);
  }
}

// ==========================================
// Push Notifications
// ==========================================
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification recebida');

  let notificationData = {
    title: 'ZENIT',
    body: 'Nova notificação',
    icon: '/assets/estrela.png',
    badge: '/assets/estrela.png',
    tag: 'zenit-notification',
    requireInteraction: false
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.message || data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        tag: data.tag || notificationData.tag,
        data: data
      };
    } catch (error) {
      console.error('[SW] Erro ao parsear notificação:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// ==========================================
// Click em Notificação
// ==========================================
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notificação clicada:', event.notification.tag);
  
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Se já existe uma janela aberta, focar nela
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Caso contrário, abrir nova janela
        if (clients.openWindow) {
          return clients.openWindow('/dashboard.html');
        }
      })
  );
});

// ==========================================
// Mensagens do Cliente
// ==========================================
self.addEventListener('message', (event) => {
  console.log('[SW] Mensagem recebida:', event.data);

  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }

  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      })
    );
  }
});

console.log('[SW] Service Worker carregado - ZENIT v' + CACHE_VERSION);
