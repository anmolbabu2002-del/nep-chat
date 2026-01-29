const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('chatapp.db');

console.log('--- Checking Messages in chatapp.db ---');
db.all("SELECT * FROM messages ORDER BY id DESC LIMIT 10", (err, rows) => {
    if (err) {
        console.error('Error fetching messages:', err);
    } else {
        console.log('Recent Messages:');
        rows.forEach(r => {
            console.log(`[${r.id}] ${r.sender_uid}: ${r.text.substring(0, 30)} (Type: ${r.type})`);
        });
    }
    db.close();
});
