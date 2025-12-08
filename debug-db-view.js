const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Connected to the SQLite database.');
});

const runQuery = (query, label) => {
    return new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(`\n=== ${label} ===`);
            if (rows.length === 0) {
                console.log('No records found.');
            } else {
                console.table(rows);
            }
            resolve();
        });
    });
};

const viewData = async () => {
    try {
        await runQuery('SELECT * FROM user', 'USERS');
        await runQuery('SELECT id, userId, employeeCode, departmentId FROM employee', 'EMPLOYEES');
        await runQuery('SELECT id, employeeId, date, checkInTime, checkOutTime, status, workHours, overtime FROM attendance ORDER BY date DESC LIMIT 10', 'RECENT ATTENDANCE (Last 10)');
    } catch (err) {
        console.error('Error querying database:', err);
    } finally {
        db.close();
    }
};

viewData();
