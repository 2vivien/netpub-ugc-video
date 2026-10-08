// Enregistrer le Service Worker (uniquement en production)
(function () {
  if (!('serviceWorker' in navigator)) return;

  var isDev =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0';

  if (isDev) {
    // Désactive le SW en développement pour éviter les conflits HMR/WebSocket
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      registrations.forEach(function (registration) {
        registration.unregister();
      });
    });
    return;
  }

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function () {
      // Enregistrement échoué — on continue sans SW
    });
  });
})();