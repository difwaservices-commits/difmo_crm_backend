const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('📂 Database path:', dbPath);
console.log('\n');

// Check total employees
db.get('SELECT COUNT(*) as count FROM employee', (err, row) => {
    if (err) {
        console.error('❌ Error counting employees:', err.message);
        return;
    }
    console.log('📊 Total employees in database:', row.count);
});

// Check employees with details
db.all(`
    SELECT 
        e.id,
        e.userId,
        e.companyId,
        e.role,
        e.status,
        u.email,
        u.firstName,
        u.lastName,
        c.name as company_name
    FROM employee e
    LEFT JOIN user u ON e.userId = u.id
    LEFT JOIN company c ON e.companyId = c.id
    LIMIT 10
`, (err, rows) => {
    if (err) {
        console.error('❌ Error fetching employees:', err.message);
        return;
    }
    console.log('\n👥 Employee details:');
    console.table(rows);
});

// Check for the specific company
const companyId = '21fa442d-021b-434a-99ae-3db5b60dc7f1';
db.get(
    'SELECT COUNT(*) as count FROM employee WHERE companyId = ?',
    [companyId],
    (err, row) => {
        if (err) {
            console.error('❌ Error:', err.message);
            return;
        }
        console.log(`\n🏢 Employees for company ${companyId}:`, row.count);
    }
);

// Check all companies
db.all('SELECT id, name FROM company', (err, rows) => {
    if (err) {
        console.error('❌ Error fetching companies:', err.message);
        return;
    }
    console.log('\n🏢 All companies:');
    console.table(rows);

    // Close database after all queries
    setTimeout(() => {
        db.close();
    }, 1000);
});
