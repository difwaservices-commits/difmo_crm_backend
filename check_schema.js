require('dotenv').config();
const { Client } = require('pg');

async function checkSchema() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        console.log('Connected to DB.');

        const res = await client.query(`
      SELECT table_schema, table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'company' OR table_name = 'Company';
    `);

        console.log('Columns in company/Company table:');
        res.rows.forEach(row => {
            console.log(`${row.table_schema}.${row.table_name}.${row.column_name} (${row.data_type})`);
        });

        console.log('Testing SELECT "openingTime"...');
        try {
            const sel = await client.query('SELECT "openingTime" FROM "company" LIMIT 1');
            console.log('SELECT successful. Row:', sel.rows[0]);
        } catch (e) {
            console.error('SELECT failed:', e.message);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkSchema();
