import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function createDatabases() {
  const defaultUrl = process.env.DATABASE_URL;
  if (!defaultUrl) {
    console.error('DATABASE_URL is not set');
    return;
  }

  const client = new Client({
    connectionString: defaultUrl,
  });

  try {
    await client.connect();
    console.log('Connected to default database');

    try {
      await client.query('CREATE DATABASE difmocrm_staging');
      console.log('Created database: difmocrm_staging');
    } catch (e: any) {
      if (e.code === '42P04') {
        console.log('Database difmocrm_staging already exists');
      } else {
        console.error('Error creating difmocrm_staging:', e.message);
      }
    }

    try {
      await client.query('CREATE DATABASE difmocrm_prod');
      console.log('Created database: difmocrm_prod');
    } catch (e: any) {
      if (e.code === '42P04') {
        console.log('Database difmocrm_prod already exists');
      } else {
        console.error('Error creating difmocrm_prod:', e.message);
      }
    }

  } catch (error) {
    console.error('Failed to connect or create databases:', error);
  } finally {
    await client.end();
  }
}

createDatabases();
