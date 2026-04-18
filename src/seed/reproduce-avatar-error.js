const { DataSource } = require('typeorm');
require('dotenv').config();

const { User } = require('../../dist/modules/users/user.entity');
const { Company } = require('../../dist/modules/companies/company.entity');
const { Role } = require('../../dist/modules/access-control/role.entity');
const { Permission } = require('../../dist/modules/access-control/permission.entity');
const { Department } = require('../../dist/modules/departments/department.entity');

async function reproduceError() {
    // MATCH APP LOGIC: NODE_ENV determines which URL to use
    const env = process.env.NODE_ENV || 'development';
    let dbUrl;
    if (env === 'production') {
        dbUrl = process.env.DATABASE_URL_PROD || process.env.DATABASE_URL;
    } else {
        dbUrl = process.env.DATABASE_URL_STAGING || process.env.DATABASE_URL;
    }

    console.log(`Environment: ${env}`);
    console.log(`Connecting to: ${dbUrl.replace(/:[^:@]*@/, ':****@')}`);
    
    const AppDataSource = new DataSource({
        type: 'postgres',
        url: dbUrl,
        synchronize: false,
        logging: true,
        ssl: { rejectUnauthorized: false },
        entities: [User, Company, Role, Permission, Department],
    });

    try {
        await AppDataSource.initialize();
        console.log('Connected to DB');

        const userRepo = AppDataSource.getRepository(User);
        
        console.log('Attempting to find one user...');
        const user = await userRepo.findOne({
            where: {},
            relations: ['company', 'roles', 'permissions', 'department'],
        });

        console.log('Success:', user ? user.email : 'No user found');
        await AppDataSource.destroy();
    } catch (error) {
        console.error('REPRODUCED ERROR:', error);
        await AppDataSource.destroy();
    }
}

reproduceError();
