const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const DATABASE_URL = 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_prod?sslmode=require';

async function main() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const adminHash = await bcrypt.hash('password123', 10);
  const r = await client.query('UPDATE "user" SET "password" = $1 WHERE "email" = $2', [adminHash, 'admin@difmo.com']);
  console.log(`admin@difmo.com -> ${r.rowCount > 0 ? 'UPDATED to password123 ✓' : 'NOT FOUND'}`);

  await client.end();
  console.log('Done.');
}

main().catch(e => { console.error(e); process.exit(1); });
