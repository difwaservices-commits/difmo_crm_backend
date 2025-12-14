require('dotenv').config();
const { Client } = require('pg');

async function fixSchema() {
    console.log('Connecting to database...');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    try {
        await client.connect();
        console.log('Connected.');

        // Add openingTime if missing
        try {
            await client.query('ALTER TABLE "company" ADD COLUMN "openingTime" character varying');
            console.log('Added openingTime column.');
        } catch (e) {
            if (e.code === '42701') { // duplicate_column
                console.log('openingTime column already exists.');
            } else {
                console.error('Error adding openingTime:', e.message);
            }
        }

        // Add closingTime if missing
        try {
            await client.query('ALTER TABLE "company" ADD COLUMN "closingTime" character varying');
            console.log('Added closingTime column.');
        } catch (e) {
            if (e.code === '42701') {
                console.log('closingTime column already exists.');
            } else {
                console.error('Error adding closingTime:', e.message);
            }
        }

        console.log('Schema fix finished.');
    } catch (err) {
        console.error('Database connection error:', err);
    } finally {
        await client.end();
    }
}

fixSchema();
