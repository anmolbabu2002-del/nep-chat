
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'chatapp.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Checking push subscriptions...');

db.all("SELECT * FROM push_subscriptions", [], (err, rows) => {
    if (err) {
        console.error('❌ Error checking database:', err);
        process.exit(1);
    }

    console.log(`📊 Found ${rows.length} push subscriptions.`);
    if (rows.length > 0) {
        rows.forEach(row => {
            console.log(`- User: ${row.uid}, Endpoint: ${row.endpoint.substring(0, 50)}...`);
        });
    } else {
        console.log('⚠️ No subscriptions found. Ensure you have logged in and accepted notification permissions.');
    }
    db.close();
});
