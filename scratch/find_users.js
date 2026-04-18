require('dotenv').config();
const { Client } = require('pg');

async function findUsers() {
  const client = new Client({ connectionString: process.env.DATABASE_URL_PROD });
  try {
    await client.connect();
    const res = await client.query(`
      SELECT u.id, u.email, u."firstName", u."lastName", r.name as role 
      FROM "user" u 
      JOIN user_roles_role urr ON u.id = urr."userId" 
      JOIN role r ON urr."roleId" = r.id 
      LIMIT 10
    `);
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

findUsers();
