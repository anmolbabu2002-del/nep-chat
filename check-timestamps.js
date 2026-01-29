// Check message timestamps
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'chatapp.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, timestamp FROM messages ORDER BY id DESC LIMIT 10", [], (err, rows) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Recent message timestamps:');
        rows.forEach(row => {
            const timestamp = parseInt(row.timestamp);
            const date = new Date(timestamp);
            console.log(`ID ${row.id}: ${date.toISOString()} (${timestamp})`);
        });
    }
    db.close();
});
