const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    console.log("Checking Latest Attendance Records...");
    db.all("SELECT * FROM attendance ORDER BY createdAt DESC LIMIT 5", (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(JSON.stringify(rows, null, 2));
    });
});

db.close();
