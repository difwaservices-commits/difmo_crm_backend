const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/neondb?sslmode=require'
});

async function main() {
  await client.connect();
  console.log('Connected!');
  try {
    await client.query('CREATE DATABASE difmocrm_staging;');
    console.log('Created difmocrm_staging');
  } catch(e) { console.log(e.message); }
  
  try {
    await client.query('CREATE DATABASE difmocrm_prod;');
    console.log('Created difmocrm_prod');
  } catch(e) { console.log(e.message); }
  
  await client.end();
}

main();
