const admin = require('firebase-admin');

// Ensure you have loaded your backend env variables
require('dotenv').config();

admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
});

async function checkFirestore() {
  const db = admin.firestore();
  
  console.log('Fetching latest notifications from Firestore...');
  const snapshot = await db.collection('notifications').orderBy('timestamp', 'desc').limit(5).get();
  
  if (snapshot.empty) {
    console.log('No notifications found.');
    return;
  }
  
  snapshot.forEach(doc => {
    console.log(`Doc ID: ${doc.id}`);
    console.log(JSON.stringify(doc.data(), null, 2));
  });
}

checkFirestore()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
