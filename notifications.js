/**
 * Centralized Notification and Push Subscription Logic
 */

const VAPID_PUBLIC_KEY = 'BLpJu_1zxiQXdxF7ptgZaVWHAwlgHEpRDengmewD_SqM8UGxWFzGzcxDq6neum8D69OoKQfhEIbsMX0GA5L81lA';

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * Updates the UI based on notification status
 */
function updateNotificationUI(status) {
    const btn = document.getElementById('notificationBtn');
    if (!btn) return;

    console.log(`[Notification UI] Updating for status: ${status}`);

    if (status === 'granted') {
        btn.classList.add('hidden');
        return;
    }

    if (status === 'denied') {
        btn.classList.remove('hidden');
        btn.innerHTML = '<i class="fas fa-bell-slash"></i> Notifications Blocked';
        btn.style.background = '#ff4b2b';
        btn.title = 'Notifications are blocked in your browser settings. Please enable them to receive alerts.';
        return;
    }

    // Default or prompt
    btn.classList.remove('hidden');
    btn.innerHTML = '<i class="fas fa-bell"></i> Enable Notifications';
    btn.style.background = ''; // Use CSS default
    btn.title = 'Enable push notifications for calls and messages';
}

/**
 * Request permission and re-initialize
 */
async function requestNotificationPermission() {
    console.log('📢 Requesting notification permission via user click...');
    try {
        const permission = await Notification.requestPermission();
        console.log('📢 Permission result:', permission);

        updateNotificationUI(permission);

        if (permission === 'granted') {
            initNotifications();
        }
    } catch (error) {
        console.error('❌ Error requesting permission:', error);
    }
}

/**
 * Initializes Service Worker and handles Push Subscription
 */
async function initNotifications() {
    console.log('🔔 Initializing notifications...');

    // Check for Secure Context
    if (!window.isSecureContext) {
        console.warn('❌ NOT in a secure context - Service Workers and Push API will NOT work');
        return;
    }

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('❌ Push messaging not supported');
        return;
    }

    // Attach click listener to button
    const btn = document.getElementById('notificationBtn');
    if (btn) {
        btn.onclick = (e) => {
            e.preventDefault();
            requestNotificationPermission();
        };
    }

    // Show/Hide based on current state
    updateNotificationUI(Notification.permission);

    if (Notification.permission !== 'granted') {
        return;
    }

    try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');

        // Check for active session
        const sessionId = localStorage.getItem('user_sessionId');
        const uid = localStorage.getItem('user_uid');
        if (!sessionId || !uid) return;

        // Subscribe if granted
        await subscribeUserToPush(registration, sessionId);
    } catch (error) {
        console.error('❌ Notification initialization failed:', error);
    }
}

/**
 * Subscribes user to push and sends to backend
 */
async function subscribeUserToPush(registration, sessionId) {
    try {
        console.log('📱 Checking existing push subscription...');
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            console.log('📱 Creating new push subscription...');
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });
        }

        console.log('📱 Push subscription active');

        const response = await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            body: JSON.stringify({ subscription })
        });

        if (response.ok) {
            console.log('✅ Push subscription synced with server');
            updateNotificationUI('granted');
        }
    } catch (error) {
        console.error('❌ Push subscription error:', error);
    }
}

// Global exposure
window.initNotifications = initNotifications;
window.requestNotificationPermission = requestNotificationPermission;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotifications);
} else {
    initNotifications();
}
