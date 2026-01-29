// Fix incorrect timestamps in database
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'chatapp.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Fixing incorrect timestamps...');

// Update messages with wrong timestamp format (those with value "2026")
db.run(`
  UPDATE messages
  SET timestamp = datetime('now')
  WHERE CAST(timestamp AS INTEGER) < 1000000000000
    AND CAST(timestamp AS INTEGER) > 0
`, function(err) {
  if (err) {
    console.error('Error fixing timestamps:', err);
  } else {
    console.log(`✅ Fixed ${this.changes} messages with incorrect timestamps`);
  }

  // Verify the fix
  db.all("SELECT id, timestamp FROM messages ORDER BY id DESC LIMIT 10", [], (err, rows) => {
    if (err) {
      console.error('Error checking timestamps:', err);
    } else {
      console.log('\n📋 Updated timestamps:');
      rows.forEach(row => {
        console.log(`ID ${row.id}: ${row.timestamp}`);
      });
    }
    db.close();
  });
});
