const { Client } = require('pg');

async function debugPasswords() {
  const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_staging?sslmode=require' });
  await client.connect();
  
  const res = await client.query('SELECT email, password FROM "user"');
  console.log(`Found ${res.rows.length} users.`);
  
  let validHashes = 0;
  let plainTextOrInvalid = 0;
  
  res.rows.forEach(u => {
    if (u.password && (u.password.startsWith('$2a$') || u.password.startsWith('$2b$'))) {
      validHashes++;
    } else {
      console.log(`[INVALID/PLAINTEXT HASH] Email: ${u.email}, Pass: ${u.password}`);
      plainTextOrInvalid++;
    }
  });

  console.log(`Valid hashes: ${validHashes}, Plain/Invalid: ${plainTextOrInvalid}`);
  await client.end();
}

debugPasswords().catch(console.error);
