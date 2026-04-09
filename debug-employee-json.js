const { Client } = require('pg');

async function debugData() {
  const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_staging?sslmode=require' });
  await client.connect();
  
  const res = await client.query(`SELECT id, "userId", "companyId" FROM employee`);
  console.log('--- ALL EMPLOYEES ---');
  console.log(JSON.stringify(res.rows, null, 2));
  
  await client.end();
}

debugData().catch(console.error);
