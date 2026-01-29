const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('chatapp.db');
db.all("SELECT * FROM reactions", (err, rows) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(JSON.stringify(rows));
    db.close();
});
