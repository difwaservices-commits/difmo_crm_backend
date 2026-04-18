const { DataSource } = require('typeorm');
require('dotenv').config();

async function addImageColumns() {
    // Priority: PROD (most likely your current environment) -> STAGING -> DEFAULT
    const dbUrl = process.env.DATABASE_URL_PROD || process.env.DATABASE_URL_STAGING || process.env.DATABASE_URL;
    
    if (!dbUrl) {
        console.error('ERROR: No DATABASE_URL or DATABASE_URL_STAGING found in .env');
        process.exit(1);
    }

    console.log('Connecting to:', dbUrl.replace(/:[^:@]*@/, ':****@'));

    const AppDataSource = new DataSource({
        type: 'postgres',
        url: dbUrl,
        synchronize: false,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await AppDataSource.initialize();
        console.log('Database connected successfully.');

        // Add avatar to user table
        console.log('Ensuring "avatar" exists in "user" table...');
        await AppDataSource.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "avatar" character varying`);

        // Add columns to employee table
        console.log('Ensuring "avatar" and "profileImage" exist in "employee" table...');
        await AppDataSource.query(`ALTER TABLE "employee" ADD COLUMN IF NOT EXISTS "avatar" character varying`);
        await AppDataSource.query(`ALTER TABLE "employee" ADD COLUMN IF NOT EXISTS "profileImage" character varying`);

        console.log('SUCCESS: All image columns have been added to the database.');
        await AppDataSource.destroy();
    } catch (error) {
        console.error('CRITICAL ERROR during database update:', error);
        process.exit(1);
    }
}

addImageColumns();
