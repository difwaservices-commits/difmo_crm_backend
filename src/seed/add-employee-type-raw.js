require('dotenv').config();
const dbUrl = process.env.DATABASE_URL || '';
const isPostgres = dbUrl.startsWith('postgres');

async function run() {
  if (isPostgres) {
    const { Client } = require('pg');
    const client = new Client({ connectionString: dbUrl, ssl: dbUrl.includes('neon.tech') ? { rejectUnauthorized: false } : undefined });
    try {
      await client.connect();
      console.log('Connected to Postgres');

      await client.query(`DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'employee_type') THEN
          CREATE TYPE employee_type AS ENUM ('office','remote','hybrid');
        END IF;
      END$$;`);

      const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name='employee' AND column_name='employeeType'`);
      if (res.rows.length === 0) {
        console.log('Adding employeeType column');
        await client.query(`ALTER TABLE "employee" ADD COLUMN "employeeType" employee_type DEFAULT 'office';`);
      } else {
        console.log('employeeType already exists');
      }

      const res2 = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name='employee' AND column_name='workFromHome'`);
      if (res2.rows.length === 0) {
        console.log('Adding workFromHome column');
        await client.query(`ALTER TABLE "employee" ADD COLUMN "workFromHome" boolean DEFAULT false;`);
      } else {
        console.log('workFromHome already exists');
      }

      console.log('Done');
      await client.end();
    } catch (err) {
      console.error('Postgres error:', err);
      process.exit(1);
    }
  } else {
    const sqlite3 = require('sqlite3').verbose();
    const dbFile = 'db.sqlite';
    const db = new sqlite3.Database(dbFile, (err) => {
      if (err) {
        console.error('Could not open sqlite file', err);
        process.exit(1);
      }
    });

    db.serialize(() => {
      db.all("PRAGMA table_info('employee')", (err, rows) => {
        if (err) {
          console.error('SQLite error reading schema:', err);
          process.exit(1);
        }
        const hasEmployeeType = rows.some(r => r.name === 'employeeType');
        const hasWfh = rows.some(r => r.name === 'workFromHome');

        if (!hasEmployeeType) {
          console.log('Adding employeeType column to sqlite');
          db.run(`ALTER TABLE employee ADD COLUMN employeeType TEXT DEFAULT 'office';`, (e) => { if (e) console.error(e); });
        } else {
          console.log('employeeType exists in sqlite');
        }

        if (!hasWfh) {
          console.log('Adding workFromHome column to sqlite');
          db.run(`ALTER TABLE employee ADD COLUMN workFromHome BOOLEAN DEFAULT 0;`, (e) => { if (e) console.error(e); });
        } else {
          console.log('workFromHome exists in sqlite');
        }

        console.log('Done sqlite');
        db.close();
      });
    });
  }
}

run();
