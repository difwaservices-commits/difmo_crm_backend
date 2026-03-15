
const { DataSource } = require('typeorm');
const { Employee } = require('./src/modules/employees/employee.entity');
const { Attendance } = require('./src/modules/attendance/attendance.entity');
const { User } = require('./src/modules/users/user.entity');
const { Company } = require('./src/modules/companies/company.entity');

// Database configuration - assuming default local settings or reading from env
const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'difmo',
    password: process.env.DB_PASSWORD || 'difmo',
    database: process.env.DB_NAME || 'difmocrm',
    entities: ['src/**/*.entity.ts'],
    synchronize: false,
});

async function resetData() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();

        // Disable foreign key constraints temporarily to allow deletion
        // await queryRunner.query('SET session_replication_role = "replica";'); // For Postgres specific

        console.log('Deleting Attendance records...');
        await queryRunner.query('DELETE FROM attendance');

        console.log('Deleting Employee records...');
        await queryRunner.query('DELETE FROM employee');

        // Optional: Delete users associated with employees? 
        // The user said "delete all employee", usually implies keeping the admin/company.
        // So we won't delete Users or Companies unless they are employee-users.
        // But identifying them might be tricky without a clear role separation in the User table if not joined.
        // For now, clearing employees and attendance is the main request.

        console.log('Data reset successful');
        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error resetting data:', error);
        process.exit(1);
    }
}

resetData();
