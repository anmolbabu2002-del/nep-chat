// Check Database Contents
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

// Check messages table
console.log('\n📋 MESSAGES TABLE:');
db.all("SELECT id, chat_id, sender_uid, text, file_url, file_name, timestamp, status FROM messages ORDER BY timestamp DESC LIMIT 10", [], (err, rows) => {
    if (err) {
        console.error('Error:', err);
    } else {
        if (rows.length === 0) {
            console.log('No messages found');
        } else {
            rows.forEach(row => {
                console.log(`ID: ${row.id}, Chat: ${row.chat_id}, Sender: ${row.sender_uid}`);
                console.log(`Text: ${row.text || '(file message)'}`);
                if (row.file_url) {
                    console.log(`File: ${row.file_name} (${row.file_url})`);
                }
                console.log(`Time: ${row.timestamp}, Status: ${row.status}`);
                console.log('---');
            });
        }
    }

    // Check users table
    console.log('\n👥 USERS TABLE:');
    db.all("SELECT uid, name, username FROM users", [], (err, users) => {
        if (err) {
            console.error('Error:', err);
        } else {
            users.forEach(user => {
                console.log(`UID: ${user.uid}, Name: ${user.name}, Username: ${user.username}`);
            });
        }

        // Check sessions table
        console.log('\n🔑 SESSIONS TABLE:');
        db.all("SELECT session_id, uid FROM sessions", [], (err, sessions) => {
            if (err) {
                console.error('Error:', err);
            } else {
                sessions.forEach(session => {
                    console.log(`Session: ${session.session_id.substring(0, 20)}..., UID: ${session.uid}`);
                });
            }

            db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                } else {
                    console.log('\n✅ Database check complete');
                }
            });
        });
    });
});
