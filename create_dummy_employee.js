require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function createDummy() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();

        // 1. Get Company
        const companyRes = await client.query('SELECT id FROM "company" LIMIT 1');
        if (companyRes.rows.length === 0) {
            console.log('No company found. Cannot create employee.');
            return;
        }
        const companyId = companyRes.rows[0].id;

        const email = 'dummy@difmocrm.com';
        const password = 'Password123!';
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Create User
        // Check if exists
        const userCheck = await client.query('SELECT id FROM "user" WHERE email = $1', [email]);
        let userId;

        if (userCheck.rows.length > 0) {
            console.log(`User ${email} already exists. Updating password...`);
            userId = userCheck.rows[0].id;
            await client.query('UPDATE "user" SET password = $1 WHERE id = $2', [hashedPassword, userId]);
        } else {
            const userRes = await client.query(`
            INSERT INTO "user" (email, password, "firstName", "lastName", "isActive", "companyId", "createdAt", "updatedAt")
            VALUES ($1, $2, 'Dummy', 'Employee', true, $3, NOW(), NOW())
            RETURNING id
        `, [email, hashedPassword, companyId]);
            userId = userRes.rows[0].id;
        }

        // 3. Create Employee
        // Check if exists
        const empCheck = await client.query('SELECT id FROM "employee" WHERE "userId" = $1', [userId]);
        if (empCheck.rows.length === 0) {
            const empCode = 'DUMMY001';
            await client.query(`
            INSERT INTO "employee" ("userId", "companyId", "employeeCode", "status", "employmentType", "role", "hireDate", "createdAt", "updatedAt")
            VALUES ($1, $2, $3, 'active', 'full-time', 'Software Engineer', NOW(), NOW(), NOW())
        `, [userId, companyId, empCode]);
        }

        console.log('Dummy Employee Ready:');
        console.log('Email:', email);
        console.log('Password:', password);

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

createDummy();
