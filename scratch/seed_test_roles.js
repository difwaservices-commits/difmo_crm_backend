
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

async function seedRoles() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to DB:', dbUrl.replace(/:[^:@]*@/, ':****@'));

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

    console.log('--- Seeding Roles ---');
    for (const roleName of rolesToSeed) {
      const existing = await AppDataSource.query('SELECT * FROM role WHERE name = $1', [roleName]);
      if (existing.length === 0) {
        await AppDataSource.query('INSERT INTO role (id, name, description) VALUES (uuid_generate_v4(), $1, $2)', [roleName, `System ${roleName} role`]);
        console.log(`Created role: ${roleName}`);
      } else {
        console.log(`Role exists: ${roleName}`);
      }
    }

    // Assign all roles to a test user
    const testEmail = 'admin@admin.com'; // Change this to your test user email
    const user = await AppDataSource.query('SELECT id FROM "user" WHERE email = $1', [testEmail]);
    
    if (user.length > 0) {
        const userId = user[0].id;
        console.log(`--- Assigning roles to user ${testEmail} ---`);
        
        // Clear existing role assignments for clean test
        await AppDataSource.query('DELETE FROM user_roles_role WHERE "userId" = $1', [userId]);
        
        const roles = await AppDataSource.query('SELECT id FROM role');
        for (const role of roles) {
            await AppDataSource.query('INSERT INTO user_roles_role ("userId", "roleId") VALUES ($1, $2)', [userId, role.id]);
        }
        console.log(`All roles assigned to ${testEmail}`);
    } else {
        console.log(`User ${testEmail} not found. Please create this user first.`);
    }

    await AppDataSource.destroy();
  } catch (err) {
    console.error('Error:', err);
  }
}

seedRoles();
