// Notificación push simple en frontend (ejemplo Next.js)
export async function showNotification(title, options) {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(title, options);
      }
    }
  }
}

// Uso:
// showNotification('¡Nuevo evento cerca!', { body: 'No te pierdas la final en KOP Stadium.' });
