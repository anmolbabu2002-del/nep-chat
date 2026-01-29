const webpush = require('web-push');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// VAPID keys from server.js
const VAPID_PUBLIC_KEY = 'BLpJu_1zxiQXdxF7ptgZaVWHAwlgHEpRDengmewD_SqM8UGxWFzGzcxDq6neum8D69OoKQfhEIbsMX0GA5L81lA';
const VAPID_PRIVATE_KEY = 'WyaOALDw3nE6S8czulz-vsKLKYspqNVKH-rhEK_AEg4';

webpush.setVapidDetails(
    'mailto:chatapp@example.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

const dbPath = path.join(__dirname, 'chatapp.db');
const db = new sqlite3.Database(dbPath);

console.log('🚀 Starting manual push test...');

db.all("SELECT * FROM push_subscriptions", [], async (err, rows) => {
    if (err) {
        console.error('❌ DB Error:', err);
        process.exit(1);
    }

    if (rows.length === 0) {
        console.log('⚠️ No push subscriptions found in database.');
        process.exit(0);
    }

    console.log(`📊 Found ${rows.length} subscription(s). Sending test push...`);

    const payload = JSON.stringify({
        title: 'Manual Test Push',
        body: 'This is a test notification from the server.',
        icon: '/icon.png',
        badge: '/badge.png',
        data: {
            url: '/'
        }
    });

    for (const row of rows) {
        const subscription = {
            endpoint: row.endpoint,
            keys: {
                p256dh: row.p256dh,
                auth: row.auth
            }
        };

        try {
            console.log(`📡 Sending to user ${row.uid} at ${row.endpoint.substring(0, 40)}...`);
            await webpush.sendNotification(subscription, payload);
            console.log(`✅ Push sent successfully to ${row.uid}`);
        } catch (error) {
            console.error(`❌ Error sending to ${row.uid}:`, error.statusCode, error.body || error.message);
            if (error.statusCode === 410) {
                console.log('🗑️ Subscription expired (410 Gone).');
            }
        }
    }

    db.close();
});
