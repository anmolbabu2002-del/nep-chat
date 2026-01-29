const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('chatapp.db');

console.log('--- Checking Database Tables in chatapp.db ---');
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
        console.error('Error fetching tables:', err);
        return;
    }
    console.log('Tables:', tables.map(t => t.name).join(', '));

    // Check Messages Schema
    db.all("PRAGMA table_info(messages)", (err, rows) => {
        if (err) {
            console.error('Error in messages info:', err);
        } else {
            console.log('\n--- Messages Columns ---');
            rows.forEach(r => console.log(`- ${r.name}`));
        }

        // Count Subscriptions
        db.get("SELECT COUNT(*) as count FROM push_subscriptions", (err, row) => {
            if (err) {
                console.error('Error counting subscriptions:', err.message);
            } else {
                console.log(`\nPush Subscriptions Count: ${row.count}`);
            }
            db.close();
        });
    });
});
