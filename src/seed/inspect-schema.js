const { DataSource } = require('typeorm');
require('dotenv').config();

async function inspectSchema() {
    const dbUrl = process.env.DATABASE_URL_PROD || process.env.DATABASE_URL_STAGING || process.env.DATABASE_URL;
    
    if (!dbUrl) {
        console.error('No DATABASE_URL found');
        return;
    }

    const AppDataSource = new DataSource({
        type: 'postgres',
        url: dbUrl,
        synchronize: false,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await AppDataSource.initialize();
        console.log('Connected to:', dbUrl.replace(/:[^:@]*@/, ':****@'));

        console.log('\n--- User Table Info ---');
        const userCols = await AppDataSource.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'user'
        `);
        console.log('Columns in "user":', userCols);

        console.log('\n--- Employee Table Info ---');
        const empCols = await AppDataSource.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'employee'
        `);
        console.log('Columns in "employee":', empCols);

        // Check for case variations
        const tables = await AppDataSource.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('\n--- Public Tables ---');
        console.log(tables.map(t => t.table_name));

        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error:', error);
    }
}

inspectSchema();
