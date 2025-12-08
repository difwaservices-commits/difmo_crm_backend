const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Checking employee query with filters...\n');

// Simulate the exact query that TypeORM would generate
const companyId = '21fa442d-021b-434a-99ae-3db5b60dc7f1';

// Test 1: Simple query without joins
console.log('Test 1: Simple employee query');
db.all(`SELECT * FROM employee WHERE companyId = ?`, [companyId], (err, rows) => {
    if (err) {
        console.error('❌ Error:', err.message);
    } else {
        console.log(`✅ Found ${rows.length} employees`);
        console.table(rows);
    }
});

// Test 2: Query with joins (similar to TypeORM)
console.log('\nTest 2: Employee query with joins');
db.all(`
    SELECT 
        e.*,
        u.id as user_id,
        u.email,
        u.firstName,
        u.lastName,
        c.id as company_id,
        c.name as company_name
    FROM employee e
    LEFT JOIN user u ON e.userId = u.id
    LEFT JOIN company c ON e.companyId = c.id
    WHERE e.companyId = ?
`, [companyId], (err, rows) => {
    if (err) {
        console.error('❌ Error:', err.message);
    } else {
        console.log(`✅ Found ${rows.length} employees with joins`);
        console.table(rows);
    }

    // Close database
    setTimeout(() => {
        db.close();
    }, 500);
});
