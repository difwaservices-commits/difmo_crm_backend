const admin = require('firebase-admin');
const { Client } = require('pg');

async function debugNotifications() {
  // 1. Initialize Firebase
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: 'difmo-crm-5f963', // Guessed from context or I should check .env
    });
  }
  const db = admin.firestore();

  console.log('--- LATEST 5 FIRESTORE NOTIFICATIONS ---');
  const snapshot = await db.collection('notifications').orderBy('timestamp', 'desc').limit(5).get();
  
  if (snapshot.empty) {
    console.log('No notifications found in Firestore.');
  } else {
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', JSON.stringify(doc.data(), null, 2));
    });
  }

  // 2. Check Roles and Users in PG
  const pgClient = new Client({ connectionString: 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_staging?sslmode=require' });
  await pgClient.connect();
  
  const res = await pgClient.query(`
    SELECT u.id, u.email, u."companyId", r.name as role 
    FROM "user" u 
    LEFT JOIN user_roles_role ur ON ur.userId = u.id 
    LEFT JOIN role r ON r.id = ur.roleId
    WHERE r.name = 'Admin' OR r.name = 'Employee'
  `);
  
  console.log('\n--- USERS BY ROLE ---');
  console.log(JSON.stringify(res.rows, null, 2));
  
  await pgClient.end();
}

debugNotifications().catch(console.error);
