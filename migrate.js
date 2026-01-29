const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'chatapp.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    console.log('Starting migration...');

    // 1. Create conversations table
    db.run(`CREATE TABLE IF NOT EXISTS conversations (
        chat_id TEXT PRIMARY KEY,
        theme TEXT DEFAULT 'default',
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error('Error creating conversations table:', err.message);
        else console.log('✅ Conversations table verified');
    });

    // 2. Add type column to messages (only if it doesn't exist)
    db.all("PRAGMA table_info(messages)", (err, columns) => {
        if (err) return console.error(err.message);

        const hasType = columns.some(c => c.name === 'type');
        if (!hasType) {
            db.run("ALTER TABLE messages ADD COLUMN type TEXT DEFAULT 'text'", (err) => {
                if (err) console.error('Error adding type column:', err.message);
                else console.log('✅ Added type column to messages');
            });
        } else {
            console.log('✅ Messages table already has type column');
        }
    });

    // 3. Update existing system-like messages if any (optional)
});

db.close(() => {
    console.log('Migration complete.');
});
