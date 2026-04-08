const { Client } = require('pg');

async function debugData() {
  const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_staging?sslmode=require' });
  await client.connect();
  
  const res = await client.query(`
    SELECT u.id, u.email, u."companyId", r.name as role 
    FROM "user" u 
    LEFT JOIN user_roles_role ur ON ur.userId = u.id 
    LEFT JOIN role r ON r.id = ur.roleId
  `);
  
  console.log('--- ALL USERS AND ROLES ---');
  console.table(res.rows);
  
  await client.end();
}

debugData().catch(console.error);
