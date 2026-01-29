// Check for file messages in database
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'chatapp.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to SQLite database');
});

// Check for messages with files
db.all("SELECT id, text, file_url, file_name, file_size, file_type FROM messages WHERE file_url IS NOT NULL AND file_url != ''", [], (err, rows) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log(`\n📁 FILE MESSAGES FOUND: ${rows.length}`);
        if (rows.length === 0) {
            console.log('No file messages found in database');
            console.log('This means no files have been successfully uploaded yet');
        } else {
            rows.forEach(row => {
                console.log(`ID: ${row.id}`);
                console.log(`Text: ${row.text || '(no caption)'}`);
                console.log(`File URL: ${row.file_url}`);
                console.log(`File Name: ${row.file_name}`);
                console.log(`File Size: ${row.file_size} bytes`);
                console.log(`File Type: ${row.file_type}`);
                console.log('---');
            });
        }
    }

    db.close();
});
