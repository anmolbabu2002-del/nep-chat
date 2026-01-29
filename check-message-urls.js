// Check file URLs for specific messages
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'chatapp.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, file_url FROM messages WHERE file_url IS NOT NULL AND id IN (18,19,25,26,27) ORDER BY id", [], (err, rows) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Message file URLs:');
        rows.forEach(row => {
            console.log(`ID ${row.id}: ${row.file_url}`);
        });
    }
    db.close();
});
