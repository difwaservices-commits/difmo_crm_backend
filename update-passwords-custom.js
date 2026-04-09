const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const TARGETS = [
  { name: 'Staging', connectionString: 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_staging?sslmode=require' },
  { name: 'Production', connectionString: 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_prod?sslmode=require' }
];

async function updatePasswords() {
  const adminEmail = 'admin@difmo.com';
  const adminPassword = 'password123';
  const employeePassword = 'welcome123';

  console.log(`Hashing passwords...`);
  const hashedAdmin = await bcrypt.hash(adminPassword, 10);
  const hashedEmployee = await bcrypt.hash(employeePassword, 10);

  for (const target of TARGETS) {
    console.log(`\n--- Processing ${target.name} ---`);
    const client = new Client({ connectionString: target.connectionString });
    
    try {
      await client.connect();
      console.log(`Connected to ${target.name}`);

      // 1. Update Admin
      const adminRes = await client.query(
        'UPDATE "user" SET password = $1 WHERE email = $2 RETURNING id',
        [hashedAdmin, adminEmail]
      );
      if (adminRes.rowCount > 0) {
        console.log(`✅ Updated Admin (${adminEmail})`);
      } else {
        console.log(`⚠️ Admin (${adminEmail}) not found!`);
      }

      // 2. Update Employees
      // We update all users who are in the 'employee' table, excluding the admin
      const empRes = await client.query(
        `UPDATE "user" 
         SET password = $1 
         WHERE email != $2 
         AND id IN (SELECT "userId" FROM employee)
         RETURNING id`,
        [hashedEmployee, adminEmail]
      );
      console.log(`✅ Updated ${empRes.rowCount} employees to '${employeePassword}'`);

      // 3. Optional: Make sure they are active
      await client.query('UPDATE "user" SET "isActive" = true WHERE "isActive" IS FALSE OR "isActive" IS NULL');
      console.log(`✅ All users set to active`);

    } catch (err) {
      console.error(`❌ Error updating ${target.name}:`, err.message);
    } finally {
      await client.end();
    }
  }
}

updatePasswords().catch(console.error);
