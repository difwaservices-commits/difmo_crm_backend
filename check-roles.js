const { Client } = require('pg');

async function checkRoles() {
  const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_prod?sslmode=require' });
  await client.connect();
  
  const res = await client.query(`
    SELECT u.email, r.name as role
    FROM "user" u 
    LEFT JOIN user_roles_role ur ON ur."userId" = u.id
    LEFT JOIN role r ON r.id = ur."roleId"
    WHERE u.email LIKE '%ramjee%' OR r.name = 'Admin' OR r.name = 'Super Admin'
  `);
  
  for (const row of res.rows) {
      console.log(`Email: ${row.email} | Role: ${row.role}`);
  }

  await client.end();
}

checkRoles().catch(console.error);
