const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function fixPaswordsAndCheck() {
  const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_staging?sslmode=require' });
  await client.connect();
  
  const res = await client.query('SELECT id, email, password, "companyId", "isActive" FROM "user"');
  console.log(`Checking ${res.rows.length} users for login issues...`);
  
  for (const u of res.rows) {
    let issue = [];
    
    // Check missing properties
    if (!u.companyId) issue.push('NO_COMPANY_ID');
    if (!u.isActive) issue.push('INACTIVE');
    
    // Check roles
    const roleRes = await client.query('SELECT * FROM user_roles_role WHERE "userId" = $1', [u.id]);
    if (roleRes.rows.length === 0) issue.push('NO_ROLE');

    // Fix cleartext passwords
    if (u.password && !(u.password.startsWith('$2a$') || u.password.startsWith('$2b$'))) {
      const hashed = await bcrypt.hash(u.password, 10);
      await client.query('UPDATE "user" SET password = $1 WHERE id = $2', [hashed, u.id]);
      issue.push('PLAINTEXT_PASSWORD_FIXED');
    }
    
    if(issue.length > 0) {
      console.log(`User ${u.email}: ${issue.join(', ')}`);
    } else {
      console.log(`User ${u.email}: OK`);
    }
  }

  await client.end();
}

fixPaswordsAndCheck().catch(console.error);
