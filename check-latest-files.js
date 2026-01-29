// Check latest file messages in database
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'chatapp.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, text, file_url, file_name FROM messages WHERE file_url IS NOT NULL ORDER BY id DESC LIMIT 5", [], (err, rows) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('📁 LATEST FILE MESSAGES:');
        rows.forEach(row => {
            console.log(`ID ${row.id}: ${row.file_url} - ${row.file_name}`);
        });
    }
    db.close();
});
