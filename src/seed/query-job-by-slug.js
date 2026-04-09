require('dotenv').config();
const { Client } = require('pg');
(async ()=>{
  try{
    const dbUrl = process.env.DATABASE_URL_PROD || process.env.DATABASE_URL_STAGING || process.env.DATABASE_URL;
    if(!dbUrl) throw new Error('DATABASE_URL not set');
    const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
    await client.connect();
    const res = await client.query(`SELECT id, title, slug, department, location, type, experience, description, responsibilities, requirements, "applicationStartDate", "applicationEndDate", "isActive", "createdAt", "updatedAt" FROM jobs WHERE slug = $1 LIMIT 1`, ['mern-developer']);
    console.log(JSON.stringify(res.rows, null, 2));
    await client.end();
  }catch(err){
    console.error('err', err.message || err);
    process.exit(1);
  }
})();
