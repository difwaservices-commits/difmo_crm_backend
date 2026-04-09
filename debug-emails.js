const { Client } = require('pg');

async function debugUsers() {
  const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_prod?sslmode=require' });
  await client.connect();
  
  const res = await client.query('SELECT u.id as "userId", e.id as "empId", u.email as "userEmail" FROM "user" u LEFT JOIN employee e ON e."userId" = u.id');
  console.log(`Checking ${res.rows.length} users in PROD...`);
  
  for (const row of res.rows) {
      console.log(`User ID: ${row.userId} | Emp ID: ${row.empId} | Email: ${row.userEmail}`);
  }

  await client.end();
}

debugUsers().catch(console.error);
