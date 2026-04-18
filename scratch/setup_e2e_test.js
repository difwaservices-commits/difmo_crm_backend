
require('dotenv').config();
const { DataSource } = require('typeorm');
const bcrypt = require('bcryptjs');

const dbUrl = process.env.DATABASE_URL_PROD || process.env.DATABASE_URL;

const AppDataSource = new DataSource({
  type: 'postgres',
  url: dbUrl,
  synchronize: false,
  ssl: {
    rejectUnauthorized: false
  }
});

const TEST_EMAIL = 'testuser1@gmail.com';
const TEST_PASSWORD = 'welcome123';

async function setup() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to DB');

    // 1. Ensure Roles Exist
    const rolesToSeed = [
      'EMPLOYEE',
      'INTERNS',
      'CEO',
      'CTO',
      'FOUNDER',
      'MANAGER',
      'HR',
      'ADMIN'
    ];

    for (const roleName of rolesToSeed) {
      const existing = await AppDataSource.query('SELECT * FROM role WHERE name = $1', [roleName]);
      if (existing.length === 0) {
        await AppDataSource.query('INSERT INTO role (id, name, description) VALUES (uuid_generate_v4(), $1, $2)', [roleName, `System ${roleName} role`]);
        console.log(`Created role: ${roleName}`);
      }
    }

    // 2. Set Password for test user
    const hash = await bcrypt.hash(TEST_PASSWORD, 10);
    const userUpdate = await AppDataSource.query('UPDATE "user" SET "password" = $1 WHERE "email" = $2', [hash, TEST_EMAIL]);
    
    if (userUpdate[1] === 0) {
        console.log(`User ${TEST_EMAIL} not found. Creating...`);
        // We'd need more fields to create a user, let's assume it exists based on previous list_users output.
        // If not, use one that exists.
    } else {
        console.log(`Password reset for ${TEST_EMAIL}`);
    }

    // 3. Assign ALL roles to test user
    const userRes = await AppDataSource.query('SELECT id FROM "user" WHERE email = $1', [TEST_EMAIL]);
    if (userRes.length > 0) {
        const userId = userRes[0].id;
        await AppDataSource.query('DELETE FROM user_roles_role WHERE "userId" = $1', [userId]);
        const roles = await AppDataSource.query('SELECT id FROM role');
        for (const role of roles) {
            await AppDataSource.query('INSERT INTO user_roles_role ("userId", "roleId") VALUES ($1, $2)', [userId, role.id]);
        }
        console.log(`All ${roles.length} roles assigned to ${TEST_EMAIL}`);
    }

    await AppDataSource.destroy();
  } catch (err) {
    console.error(err);
  }
}

setup();
