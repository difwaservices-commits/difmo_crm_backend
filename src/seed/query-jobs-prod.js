require('dotenv').config();
const { Client } = require('pg');

async function run() {
  const dbUrl = process.env.DATABASE_URL_PROD || process.env.DATABASE_URL_STAGING || process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('No DATABASE_URL found in env (DATABASE_URL_PROD / DATABASE_URL_STAGING / DATABASE_URL)');
    process.exit(2);
  }

  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log('Connected to Postgres. Querying jobs...');
    const res = await client.query(`SELECT id, title, department, location, type, experience, description, "createdAt" FROM jobs ORDER BY "createdAt" DESC LIMIT 50`);
    if (!res || !res.rows) {
      console.log('No rows returned');
    } else {
      console.log(`Found ${res.rows.length} job(s):`);
      console.log(JSON.stringify(res.rows, null, 2));
    }
  } catch (err) {
    console.error('Error querying jobs:', err.message || err);
    process.exitCode = 1;
  } finally {
    try { await client.end(); } catch (e) {}
  }
}

run();
