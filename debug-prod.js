const { Client } = require('pg');
(async () => {
  const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_prod?sslmode=require' });
  await client.connect();
  
  console.log('--- PRODUCTION DB DIAGNOSTICS ---');

  // 1. Total count of employees regardless of any filters
  const resTotal = await client.query('SELECT count(*) FROM employee');
  console.log('Total Employee Count:', resTotal.rows[0].count);

  // 2. Count by companyId
  const resByCompany = await client.query('SELECT \"companyId\", count(*) FROM employee GROUP BY \"companyId\"');
  console.log('\nEmployee counts per companyId:');
  console.log(JSON.stringify(resByCompany.rows, null, 2));

  // 3. Check for admin user
  const resAdmin = await client.query("SELECT id, email, \"companyId\" FROM \"user\" WHERE email='admin@difmo.com'");
  console.log('\nAdmin User Info:');
  console.log(JSON.stringify(resAdmin.rows[0], null, 2));

  // 4. Look at some company names
  const resCompanies = await client.query('SELECT id, name FROM company');
  console.log('\nCompanies in Producers:');
  console.log(JSON.stringify(resCompanies.rows, null, 2));

  await client.end();
})();
