// Debug Push Notification Setup
// Run this in the browser console after logging in

console.log('=== PUSH NOTIFICATION DEBUG ===\n');

// 1. Check Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
        console.log('1. Service Worker:', reg ? '✅ Registered' : '❌ Not registered');
        if (reg) {
            console.log('   Scope:', reg.scope);
            console.log('   Active:', reg.active ? 'Yes' : 'No');
        }
    });
} else {
    console.log('1. Service Worker: ❌ Not supported');
}

// 2. Check Notification Permission
console.log('2. Notification Permission:', Notification.permission);

// 3. Check Push Subscription
if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
            console.log('3. Push Subscription:', subscription ? '✅ Active' : '❌ Not subscribed');
            if (subscription) {
                console.log('   Endpoint:', subscription.endpoint.substring(0, 50) + '...');
            }
        });
    });
} else {
    console.log('3. Push Subscription: ❌ Not supported');
}

// 4. Test notification
console.log('\n4. Testing browser notification...');
if (Notification.permission === 'granted') {
    new Notification('Test Notification', {
        body: 'If you see this, browser notifications work!',
        icon: '/icon.png'
    });
    console.log('   ✅ Test notification sent');
} else {
    console.log('   ❌ Notifications not permitted');
}

console.log('\n=== END DEBUG ===');
