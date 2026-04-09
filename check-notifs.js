const { Client } = require('pg');

async function checkNotifications() {
  const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_prod?sslmode=require' });
  await client.connect();
  
  const res = await client.query('SELECT title, "recipientFilter", "recipientIds", "recipientEmails" FROM "notification" ORDER BY "createdAt" DESC LIMIT 5');
  console.log(`Checking last 5 notifications in PROD...`);
  
  for (const row of res.rows) {
      console.log(`Title: ${row.title} | Filter: ${row.recipientFilter} | RecipientIds: ${row.recipientIds} | Emails: ${row.recipientEmails}`);
  }

  await client.end();
}

checkNotifications().catch(console.error);
