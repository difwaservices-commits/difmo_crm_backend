const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const NEW_PASSWORD = 'welcome123';
const DATABASE_URL = 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_prod?sslmode=require';

async function main() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected to DB\n');

  const hash = await bcrypt.hash(NEW_PASSWORD, 10);

  // Get all users with Employee or Interns roles
  const res = await client.query(`
    SELECT DISTINCT u.id, u.email, r.name as role_name
    FROM "user" u
    JOIN "user_roles_role" ur ON ur."userId" = u.id
    JOIN "role" r ON r.id = ur."roleId"
    WHERE r.name IN ('Employee', 'Interns')
    ORDER BY r.name, u.email
  `);

  console.log(`Found ${res.rows.length} users (Employee + Interns role):\n`);

  for (const row of res.rows) {
    await client.query('UPDATE "user" SET "password" = $1 WHERE "id" = $2', [hash, row.id]);
    console.log(`  ✓ [${row.role_name}] ${row.email}`);
  }

  console.log(`\nDone. All ${res.rows.length} users now have password: ${NEW_PASSWORD}`);
  await client.end();
}

main().catch(e => { console.error(e); process.exit(1); });
