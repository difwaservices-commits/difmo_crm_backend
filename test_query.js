require('dotenv').config();
const { Client } = require('pg');

async function testQuery() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        console.log('Connected.');

        const query = `
      SELECT "User__User_company"."openingTime"
      FROM "user" "User"
      LEFT JOIN "company" "User__User_company" ON "User__User_company"."id"="User"."companyId"
      WHERE "User"."email" = 'admin@difmocrm.com'
      LIMIT 1
    `;

        console.log('Running query...');
        const res = await client.query(query);
        console.log('Query success:', res.rows);

    } catch (err) {
        console.error('Query failed:', err.message);
    } finally {
        await client.end();
    }
}

testQuery();
