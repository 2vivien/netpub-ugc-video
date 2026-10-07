// Enregistrer le Service Worker
if ('serviceWorker' in navigator) {
  // Toujours désactiver le SW en mode développement pour éviter conflits HMR/WebSocket
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '0.0.0.0';
  if (isDev) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
    console.log('Mode dev: Service Worker désactivé');
    return;
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('ServiceWorker enregistré avec succès:', registration.scope);
        })
        .catch((error) => {
          console.log('Échec de l\'enregistrement du ServiceWorker:', error);
        });
    });
  }
}