import { DataSource } from 'typeorm';
import { User } from '../modules/users/user.entity';
import { Company } from '../modules/companies/company.entity';
import { Role } from '../modules/access-control/role.entity';
import { Permission } from '../modules/access-control/permission.entity';
import { Department } from '../modules/departments/department.entity';
import { Employee } from '../modules/employees/employee.entity';
import { Designation } from '../modules/designations/designation.entity';
import { Attendance } from '../modules/attendance/attendance.entity';

require('dotenv').config();

async function fixDevendra() {
    const dbUrl = process.env.DATABASE_URL;
    const AppDataSource = new DataSource({
        type: 'postgres',
        url: dbUrl,
        entities: [User, Company, Role, Permission, Department, Employee, Attendance, Designation],
        synchronize: false,
        ssl: dbUrl && dbUrl.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
    } as any);

    try {
        await AppDataSource.initialize();
        console.log('✅ Database connected');

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ 
            where: { email: 'devendra@difmo.com' }
        });

        if (user) {
            console.log('Fixing Devendra name...');
            user.firstName = 'Devendra';
            user.lastName = 'Singh';
            await userRepo.save(user);
            console.log('✅ User names fixed.');
        } else {
            console.log('❌ User not found');
        }

        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

fixDevendra();
