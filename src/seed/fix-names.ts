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

async function fixUserNames() {
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
            console.log('Current user data:', JSON.stringify({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }));

            if (!user.firstName || user.firstName === 'null' || !user.lastName || user.lastName === 'null') {
                console.log('Fixing names for devendra@difmo.com...');
                user.firstName = 'Devendra';
                user.lastName = 'Singh'; // Defaulting to Singh, or you can adjust
                await userRepo.save(user);
                console.log('✅ Names updated successfully!');
            } else {
                console.log('Names already exist.');
            }
        } else {
            console.log('❌ User not found');
        }

        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

fixUserNames();
