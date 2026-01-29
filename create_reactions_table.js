const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('chatapp.db');

const sql = `
CREATE TABLE IF NOT EXISTS reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,
    user_uid TEXT NOT NULL,
    emoji TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_uid) REFERENCES users(uid) ON DELETE CASCADE,
    UNIQUE(message_id, user_uid, emoji)
);
CREATE INDEX IF NOT EXISTS idx_reactions_message_id ON reactions(message_id);
`;

db.exec(sql, (err) => {
    if (err) {
        console.error('❌ Failed to create reactions table:', err.message);
        process.exit(1);
    }
    console.log('✅ Reactions table created successfully');
    db.close();
});
