import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

async function check() {
  const connection = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL_STAGING,
    ssl: { rejectUnauthorized: false },
    entities: [__dirname + '/../modules/**/*.entity.ts'],
  });

  const empId = '8db069ef-93fc-4c9d-a21c-7cf24bbd8a6b';
  const today = new Date().toISOString().split('T')[0];

  const attendance = await connection.query(
    `SELECT * FROM attendance WHERE "employeeId" = $1 OR "employeeId" IN (SELECT id FROM employee WHERE "userId" = $1)`,
    [empId]
  );

  console.log('Attendance records for current user:', JSON.stringify(attendance, null, 2));
  await connection.close();
}

check().catch(console.error);
