// Écoute la réception d'une notification push
self.addEventListener('push', (event) => {
  let data = { title: 'Nouvelle notification', body: 'Vous avez reçu un message !' };

  // Récupère les données envoyées par Node.js (si présentes)
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/logo.png', // Optionnel : icône affichée dans la notification
    badge: '/logo.png',  // Optionnel : petite icône de statut (Android)
    data: {
      url: data.url || '/' // Optionnel : URL à ouvrir au clic
    }
  };

  // Affiche la notification
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Écoute le clic de l'utilisateur sur la notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Ferme la notification

  // Ouvre ou met au premier plan l'onglet avec l'URL spécifiée
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});