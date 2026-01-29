const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('chatapp.db');
db.all("PRAGMA table_info(users)", (err, rows) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    const hasProfilePic = rows.some(row => row.name === 'profile_pic');
    if (!hasProfilePic) {
        console.log('Migrating: Adding profile_pic column...');
        db.run("ALTER TABLE users ADD COLUMN profile_pic TEXT", (err) => {
            if (err) console.error('Migration failed:', err.message);
            else console.log('Migration successful: profile_pic added.');
            db.close();
        });
    } else {
        console.log('Column profile_pic already exists.');
        db.close();
    }
});
