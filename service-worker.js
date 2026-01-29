// Service Worker for Push Notifications
const CACHE_NAME = 'chat-app-v1';

// Install event
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        clients.claim()
    );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push received');

    let data = {};
    try {
        if (event.data) {
            data = event.data.json();
            console.log('[Service Worker] Push data parsed:', data);
        }
    } catch (e) {
        console.error('[Service Worker] Error parsing push data:', e);
        // If it's not JSON, try to get it as text
        try {
            const textData = event.data.text();
            data = { title: 'New Notification', body: textData };
        } catch (e2) {
            data = { title: 'New Call', body: 'You have an incoming call' };
        }
    }

    const title = data.title || 'Notification';
    const tag = data.data?.type === 'CALL' ? 'call-notification' : 'message-notification';

    const options = {
        body: data.body || 'You have a new update',
        icon: data.icon || '/icon.png',
        badge: '/badge.png',
        vibrate: [200, 100, 200],
        tag: tag,
        renotify: true,
        requireInteraction: data.data?.type === 'CALL',
        actions: data.data?.type === 'CALL' ? [
            {
                action: 'accept',
                title: 'Accept',
                icon: '/icon.png'
            },
            {
                action: 'reject',
                title: 'Reject',
                icon: '/icon.png'
            }
        ] : [],
        data: data.data || data
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
            .catch(err => console.error('[Service Worker] showNotification error:', err))
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification clicked:', event);
    event.notification.close();

    const action = event.action;
    const data = event.notification.data;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                const baseUrl = self.location.origin;
                let targetUrl = data.url ? (data.url.startsWith('http') ? data.url : baseUrl + data.url) : baseUrl;

                // Handle call actions
                if (data.type === 'CALL') {
                    if (action === 'accept') {
                        targetUrl = `${baseUrl}/chat.html?uid=${data.from}&action=accept&channel=${data.channelName}&name=${encodeURIComponent(data.name || '')}`;
                    } else if (action === 'reject') {
                        // Just stop here or notify app
                        return;
                    }
                } else if (data.type === 'MESSAGE') {
                    targetUrl = `${baseUrl}/chat.html?uid=${data.from}`;
                }

                // If app is already open, try to focus and navigate
                if (clientList.length > 0) {
                    const client = clientList[0];
                    client.focus();

                    if (data.type === 'CALL_ACTION') {
                        client.postMessage({
                            type: 'CALL_ACTION',
                            action: action,
                            callData: data
                        });
                    }

                    return client.navigate(targetUrl);
                }

                // Open new window
                return clients.openWindow(targetUrl);
            })
    );
});

// Message event - for communication with the app
self.addEventListener('message', (event) => {
    console.log('[Service Worker] Message received:', event.data);

    if (event.data.type === 'SHOW_NOTIFICATION') {
        self.registration.showNotification(event.data.title, event.data.options);
    }
});
