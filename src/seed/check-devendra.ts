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

async function checkDevendra() {
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

        if (!user) {
            console.log('❌ User devendra@difmo.com NOT FOUND in database.');
        } else {
            console.log('✅ User devendra@difmo.com FOUND.');
            console.log(`Password Hash: ${user.password}`);
            // We can't easily check the raw password without bcrypt, but we can verify it exists
        }

        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

checkDevendra();
