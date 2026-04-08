const { Client } = require('pg');
(async () => {
  const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_staging?sslmode=require' });
  await client.connect();
  
  // 1. Get Admin's companyId
  const resUser = await client.query("SELECT id, email, \"companyId\" FROM \"user\" WHERE email='admin@difmo.com'");
  const admin = resUser.rows[0];
  console.log('--- ADMIN INFO ---');
  console.log(JSON.stringify(admin, null, 2));

  if (admin && admin.companyId) {
    // 2. Count employees for this companyId
    const resCount = await client.query("SELECT count(*) FROM employee WHERE \"companyId\" = $1", [admin.companyId]);
    console.log('\n--- EMPLOYEE COUNT FOR ADMIN COMPANY ---');
    console.log('Count:', resCount.rows[0].count);

    // 3. Count employees with isDeleted=false for this companyId
    const resCountActive = await client.query("SELECT count(*) FROM employee WHERE \"companyId\" = $1 AND (\"isDeleted\" IS FALSE OR \"isDeleted\" IS NULL)", [admin.companyId]);
    console.log('\n--- ACTIVE EMPLOYEE COUNT (isDeleted is FALSE/NULL) ---');
    console.log('Count:', resCountActive.rows[0].count);
    
    // 4. Sample employee to see actual column values
    const resSample = await client.query("SELECT id, \"companyId\", \"isDeleted\" FROM employee WHERE \"companyId\" = $1 LIMIT 1", [admin.companyId]);
    console.log('\n--- SAMPLE EMPLOYEE RECORD ---');
    console.log(JSON.stringify(resSample.rows[0], null, 2));
  } else {
    console.log('\n❌ Admin has no companyId assigned!');
  }

  await client.end();
})();
