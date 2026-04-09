require('dotenv').config();
const express = require('express');
const { Client } = require('pg');

const app = express();
const port = process.env.PUBLIC_JOBS_PORT || 4001;

async function getJobs() {
  const dbUrl = process.env.DATABASE_URL_PROD || process.env.DATABASE_URL_STAGING || process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('DATABASE_URL not set');
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  const res = await client.query(`SELECT id, title, department, location, type, experience, description, "createdAt" FROM jobs ORDER BY "createdAt" DESC LIMIT 100`);
  await client.end();
  return res.rows;
}

app.get('/public/jobs', async (req, res) => {
  try {
    const rows = await getJobs();
    res.json(rows);
  } catch (err) {
    console.error('public-jobs error', err.message || err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

app.listen(port, () => console.log(`Public jobs server listening on http://localhost:${port}/public/jobs`));
