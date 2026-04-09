import { DataSource } from 'typeorm';
import { Employee } from '../modules/employees/employee.entity';
import { User } from '../modules/users/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

async function addEmployeeTypeColumn() {
  const dbUrl = process.env.DATABASE_URL;
  const isPostgres = dbUrl && dbUrl.startsWith('postgres');

  const AppDataSource = new DataSource({
    type: isPostgres ? 'postgres' : 'sqlite',
    url: dbUrl,
    database: isPostgres ? undefined : 'db.sqlite',
    entities: [Employee, User],
    synchronize: false,
    ssl: dbUrl && dbUrl.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
  } as any);

  try {
    await AppDataSource.initialize();
    console.log('Connected to DB');

    if (isPostgres) {
      // Create enum type if not exists and add column with default
      await AppDataSource.query(`DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'employee_type') THEN
          CREATE TYPE employee_type AS ENUM ('office','remote','hybrid');
        END IF;
      END$$;`);

      const col = await AppDataSource.query(`SELECT column_name FROM information_schema.columns WHERE table_name='employee' AND column_name='"employeeType"'`);
      // Some schemas may use "employeeType" or employeeType; attempt simple check
      const exists = await AppDataSource.query(`SELECT column_name FROM information_schema.columns WHERE table_name='employee' AND column_name='employeeType'`);
      if ((exists && exists.length === 0) || !exists) {
        console.log('Adding employeeType column to employee table');
        await AppDataSource.query(`ALTER TABLE "employee" ADD COLUMN "employeeType" employee_type DEFAULT 'office';`);
      } else {
        console.log('employeeType column already exists, skipping');
      }
    } else {
      // SQLite: add column if not exists
      const pragma = await AppDataSource.query(`PRAGMA table_info('employee');`);
      const found = pragma.find((r: any) => r.name === 'employeeType');
      if (!found) {
        console.log('Adding employeeType column to employee (sqlite)');
        await AppDataSource.query(`ALTER TABLE employee ADD COLUMN employeeType TEXT DEFAULT 'office';`);
      } else {
        console.log('employeeType column already exists (sqlite)');
      }

      const wfhFound = pragma.find((r: any) => r.name === 'workFromHome');
      if (!wfhFound) {
        console.log('Adding workFromHome column to employee (sqlite)');
        await AppDataSource.query(`ALTER TABLE employee ADD COLUMN workFromHome BOOLEAN DEFAULT 0;`);
      } else {
        console.log('workFromHome column already exists (sqlite)');
      }
    }

    console.log('Migration completed');
    await AppDataSource.destroy();
  } catch (err) {
    console.error('Migration failed:', err);
    try { await AppDataSource.destroy(); } catch (e) {}
    process.exit(1);
  }
}

addEmployeeTypeColumn();
