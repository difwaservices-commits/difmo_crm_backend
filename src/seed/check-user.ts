import { DataSource } from 'typeorm';
import { User } from '../modules/users/user.entity';
import { Company } from '../modules/companies/company.entity';
import { Role } from '../modules/access-control/role.entity';
import { Permission } from '../modules/access-control/permission.entity';
import { Department } from '../modules/departments/department.entity';
import { Employee } from '../modules/employees/employee.entity';
import { Attendance } from '../modules/attendance/attendance.entity';

require('dotenv').config();

async function checkUserNames() {
    const dbUrl = process.env.DATABASE_URL;
    const AppDataSource = new DataSource({
        type: dbUrl && dbUrl.startsWith('postgres') ? 'postgres' : 'sqlite',
        database: dbUrl && dbUrl.startsWith('postgres') ? undefined : 'db.sqlite',
        url: dbUrl,
        entities: [User, Company, Role, Permission, Department, Employee, Attendance],
        synchronize: false,
        ssl: dbUrl && dbUrl.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
    } as any);

    try {
        await AppDataSource.initialize();
        console.log('Database connected');

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { email: 'pritamcodeservir@gmail.com' } });

        if (user) {
            console.log('User found:', JSON.stringify({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }));
        } else {
            console.log('User not found');
        }

        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkUserNames();
