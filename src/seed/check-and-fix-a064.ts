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
        
        // Checking the specific ID from your latest Flutter logs
        const user = await userRepo.findOne({ 
            where: { id: 'a0647581-6832-4d95-a70f-e380283cda83' }
        });

        if (user) {
            console.log('User found for ID a064...:', JSON.stringify({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }));
            
            if (user.firstName === null || user.lastName === null) {
                console.log('UPDATING NULL NAMES...');
                user.firstName = 'Devendra';
                user.lastName = 'Singh';
                await userRepo.save(user);
                console.log('✅ Updated!');
            }
        } else {
            console.log('❌ User with ID a064... not found');
        }

        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

checkSpecificUser();
