// Service Worker pour Portfolio Cyberpunk
// Version 1.0.0

const CACHE_NAME = 'cyberpunk-portfolio-v1.0.0';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/cyberpunk-theme.css',
  '/css/cyberpunk-components.css',
  '/css/cyberpunk-animations.css',
  '/css/cyberpunk-backgrounds.css',
  '/js/performance-optimization.js',
  '/docs/cv.pdf',
  '/favicon.ico',
  '/apple-touch-icon.png',
  // Fonts importantes
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap',
  // Icônes
  'https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Installation...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Mise en cache des assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation terminée');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Service Worker: Erreur installation:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('⚡ Service Worker: Activation...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Service Worker: Suppression ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activation terminée');
        return self.clients.claim();
      })
  );
});

// Stratégie de cache pour les requêtes
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Stratégie pour les assets statiques
  if (ASSETS_TO_CACHE.includes(url.pathname) || 
      request.destination === 'style' || 
      request.destination === 'script' ||
      request.destination === 'font') {
    
    event.respondWith(
      cacheFirstStrategy(request)
    );
    return;
  }

  // Stratégie pour les images
  if (request.destination === 'image') {
    event.respondWith(
      cacheFirstWithUpdate(request)
    );
    return;
  }

  // Stratégie pour les documents HTML
  if (request.destination === 'document') {
    event.respondWith(
      networkFirstStrategy(request)
    );
    return;
  }

  // Pour tout le reste, laisser passer
  event.respondWith(fetch(request));
});

// Stratégies de cache

// Cache First: Priorité au cache, fallback réseau
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    // Mise en cache de la nouvelle réponse
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Erreur cache-first:', error);
    return new Response('Contenu non disponible hors ligne', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Cache First avec mise à jour en arrière-plan
async function cacheFirstWithUpdate(request) {
  const cachedResponse = await caches.match(request);
  
  // Retourner immédiatement la version en cache si disponible
  if (cachedResponse) {
    // Mise à jour en arrière-plan
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  // Si pas en cache, récupérer du réseau
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Image non disponible hors ligne', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network First: Priorité réseau, fallback cache
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Mise en cache si succès
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback sur le cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si rien en cache, retourner une page d'erreur
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hors ligne - Yohann Yendi Portfolio</title>
          <style>
            body {
              font-family: 'JetBrains Mono', monospace;
              background: linear-gradient(135deg, #0A0A0A 0%, #1a0d2e 50%, #0A0A0A 100%);
              color: #00F5FF;
              text-align: center;
              padding: 50px;
            }
            .cyber-message {
              border: 1px solid #9D4EDD;
              padding: 20px;
              border-radius: 8px;
              background: rgba(21, 21, 21, 0.9);
            }
          </style>
        </head>
        <body>
          <div class="cyber-message">
            <h1>[CONNEXION_PERDUE]</h1>
            <p>Le réseau neural est temporairement indisponible.</p>
            <p>Vérifiez votre connexion et réessayez.</p>
          </div>
        </body>
      </html>
    `, {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'text/html'
      }
    });
  }
}

// Mise à jour en arrière-plan
async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse);
    }
  } catch (error) {
    console.log('Mise à jour en arrière-plan échouée:', error);
  }
}

// Nettoyage périodique du cache
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    cleanOldCacheEntries();
  }
});

async function cleanOldCacheEntries() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  
  // Supprimer les entrées de plus de 30 jours
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  for (const request of requests) {
    const response = await cache.match(request);
    const cacheDate = new Date(response.headers.get('date')).getTime();
    
    if (cacheDate < thirtyDaysAgo) {
      await cache.delete(request);
      console.log('🗑️ Entrée cache supprimée:', request.url);
    }
  }
}

// Notifications pour les mises à jour
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Analytics hors ligne (optionnel)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(sendOfflineAnalytics());
  }
});

async function sendOfflineAnalytics() {
  // Logique pour envoyer les analytics collectées hors ligne
  console.log('📊 Envoi des analytics hors ligne...');
}
