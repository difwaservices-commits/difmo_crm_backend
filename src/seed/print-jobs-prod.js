require('dotenv').config();
const { Client } = require('pg');

(async function(){
  try{
    const dbUrl = process.env.DATABASE_URL_PROD || process.env.DATABASE_URL_STAGING || process.env.DATABASE_URL;
    if(!dbUrl) throw new Error('DATABASE_URL not set in .env');
    const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
    await client.connect();
    const res = await client.query(`SELECT id, title, department, location, type, experience, description, "createdAt" FROM jobs ORDER BY "createdAt" DESC LIMIT 200`);
    console.log(JSON.stringify(res.rows, null, 2));
    await client.end();
  }catch(err){
    console.error('error', err.message || err);
    process.exit(1);
  }
})();
