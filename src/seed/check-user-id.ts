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

async function checkSpecificUser() {
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
            where: { id: 'efd6254a-abf5-40d9-9105-7f7640952161' }
        });

        if (user) {
            console.log('User data for EFD6...:', JSON.stringify({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }));
        } else {
            console.log('❌ User EFD6... not found');
        }

        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

checkSpecificUser();
