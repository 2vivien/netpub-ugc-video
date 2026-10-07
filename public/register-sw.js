// Enregistrer le Service Worker
if ('serviceWorker' in navigator) {
  // Ne pas enregistrer le service worker en mode dev
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isDev) {
    console.log('Mode dev: Service Worker non enregistré');
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