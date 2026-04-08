const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function uniformPasswords() {
  const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_staging?sslmode=require' });
  await client.connect();
  
  const defaultPassword = 'password123';
  const hashed = await bcrypt.hash(defaultPassword, 10);
  
  // 1. Update all users to have 'password123'
  await client.query('UPDATE "user" SET password = $1', [hashed]);
  console.log(`✅ All passwords have been reset to: '${defaultPassword}'`);
  
  // 2. Assign dummy company to users without company
  const compRes = await client.query('SELECT id FROM company LIMIT 1');
  if (compRes.rows.length > 0) {
    const compId = compRes.rows[0].id;
    await client.query('UPDATE "user" SET "companyId" = $1 WHERE "companyId" IS NULL', [compId]);
    console.log(`✅ All orphaned users assigned to company: ${compId}`);
  }

  // 3. Make all users active
  await client.query('UPDATE "user" SET "isActive" = true WHERE "isActive" IS FALSE OR "isActive" IS NULL');
  console.log(`✅ All users set to active`);

  await client.end();
}

uniformPasswords().catch(console.error);
