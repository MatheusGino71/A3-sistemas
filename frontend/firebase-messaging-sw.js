// Firebase Cloud Messaging Service Worker
// Este arquivo deve estar na raiz do frontend

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Configuração do Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBcReQnKpWAjWpBHbmNYMp8FXJKEwDeaJc",
  authDomain: "a3-quinta-1a763.firebaseapp.com",
  databaseURL: "https://a3-quinta-1a763-default-rtdb.firebaseio.com",
  projectId: "a3-quinta-1a763",
  storageBucket: "a3-quinta-1a763.firebasestorage.app",
  messagingSenderId: "82585857395",
  appId: "1:82585857395:web:a8351096fa4d8106a22906",
  measurementId: "G-2XELCPKECS"
});

const messaging = firebase.messaging();

// Listener para mensagens em segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'Sentinela PIX';
  const notificationOptions = {
    body: payload.notification?.body || 'Nova notificação',
    icon: '/favicon.ico',
    badge: '/badge-icon.png',
    tag: payload.data?.notificationId || 'sentinela-pix-notification',
    data: payload.data,
    requireInteraction: payload.data?.priority === 'high'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Listener para clique na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');
  
  event.notification.close();
  
  // Abrir ou focar na janela do Sentinela PIX
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Se já existe uma janela aberta, focar nela
        for (const client of clientList) {
          if (client.url.includes('dashboard.html') && 'focus' in client) {
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
