const { Client } = require('pg');

const DATABASE_URL = 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_prod?sslmode=require';

async function main() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  // Check all roles
  console.log('\n=== ALL ROLES ===');
  const roles = await client.query('SELECT id, name FROM "role"');
  roles.rows.forEach(r => console.log(`  id: ${r.id}, name: "${r.name}"`));

  // Check these specific users and their roles
  const emails = ['palrahul95987@gmail.com', 'sonivermasoni55@gmail.com', 'khushimy2006@gmail.com'];
  console.log('\n=== USER ROLES ===');
  for (const email of emails) {
    const res = await client.query(`
      SELECT u.email, r.name as role_name
      FROM "user" u
      LEFT JOIN "user_roles_role" ur ON ur."userId" = u.id
      LEFT JOIN "role" r ON r.id = ur."roleId"
      WHERE u.email = $1
    `, [email]);
    if (res.rows.length === 0) {
      console.log(`  ${email} -> NOT FOUND`);
    } else {
      res.rows.forEach(row => console.log(`  ${row.email} -> role: "${row.role_name}"`));
    }
  }

  await client.end();
}

main().catch(e => { console.error(e); process.exit(1); });
