require('dotenv').config();
const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'difmo_crm',
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
});

async function checkManagers() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to DB');

    const employees = await AppDataSource.query(`
      SELECT e.id, e.role as employee_role, u.id as user_id, u."firstName", u."lastName", u.email
      FROM employee e
      JOIN "user" u ON e."userId" = u.id
      JOIN user_roles_role urr ON u.id = urr."userId"
      JOIN role r ON urr."roleId" = r.id
      WHERE r.name = 'Manager' AND e."isDeleted" = false
    `);

    console.log('--- Current Managers in DB ---');
    console.table(employees);
    
    await AppDataSource.destroy();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkManagers();
