
import { DataSource } from 'typeorm';
import { Employee } from './src/modules/employees/employee.entity';
import { Attendance } from './src/modules/attendance/attendance.entity';
import { User } from './src/modules/users/user.entity';

// Database configuration
const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [Employee, Attendance, User], // Explicitly list entities
    synchronize: false,
});

async function resetData() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();

        console.log('Deleting Attendance records...');
        await queryRunner.query('DELETE FROM attendance');

        console.log('Deleting Employee records...');
        await queryRunner.query('DELETE FROM employee');

        console.log('Data reset successful');
        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error resetting data:', error);
        process.exit(1);
    }
}

resetData();
