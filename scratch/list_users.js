
require('dotenv').config();
const { DataSource } = require('typeorm');

const dbUrl = process.env.DATABASE_URL_PROD || process.env.DATABASE_URL;

const AppDataSource = new DataSource({
  type: 'postgres',
  url: dbUrl,
  synchronize: false,
  ssl: {
    rejectUnauthorized: false
  }
});

async function listUsers() {
  try {
    await AppDataSource.initialize();
    const users = await AppDataSource.query('SELECT email FROM "user" LIMIT 10');
    console.table(users);
    await AppDataSource.destroy();
  } catch (err) {
    console.error(err);
  }
}

listUsers();
