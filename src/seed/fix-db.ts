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

async function fixDatabase() {
    const dbUrl = process.env.DATABASE_URL;
    const AppDataSource = new DataSource({
        type: dbUrl && dbUrl.startsWith('postgres') ? 'postgres' : 'sqlite',
        database: dbUrl && dbUrl.startsWith('postgres') ? undefined : 'db.sqlite',
        url: dbUrl,
        entities: [User, Company, Role, Permission, Department, Employee, Attendance, Designation],
        synchronize: false,
        ssl: dbUrl && dbUrl.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
    } as any);

    try {
        await AppDataSource.initialize();
        console.log('Database connected');

        const roleRepo = AppDataSource.getRepository(Role);
        const permRepo = AppDataSource.getRepository(Permission);
        const userRepo = AppDataSource.getRepository(User);

        // 1. Ensure 'read' attendance permission exists
        let readAttendance = await permRepo.findOne({ where: { action: 'read', resource: 'attendance' } });
        if (!readAttendance) {
            console.log("Creating 'read' attendance permission...");
            readAttendance = permRepo.create({
                action: 'read',
                resource: 'attendance',
                description: 'Can read attendance'
            });
            await permRepo.save(readAttendance);
        }

        // 2. Ensure Employee role has 'read' attendance permission
        let employeeRole = await roleRepo.findOne({
            where: { name: 'Employee' },
            relations: ['permissions']
        });

        if (employeeRole) {
            const hasRead = employeeRole.permissions.some(p => p.action === 'read' && p.resource === 'attendance');
            if (!hasRead) {
                console.log("Adding 'read' attendance permission to 'Employee' role...");
                employeeRole.permissions.push(readAttendance);
                await roleRepo.save(employeeRole);
            } else {
                console.log("'Employee' role already has 'read' attendance permission.");
            }
        } else {
            console.log("'Employee' role not found. Please run seed-employee-roles.ts first.");
        }

        // 3. Fix names for ALL users if they are null or 'null'
        const users = await userRepo.find();
        let fixedUsersCount = 0;
        for (const user of users) {
            if (!user.firstName || !user.lastName || user.firstName === 'null' || user.lastName === 'null') {
                console.log(`Fixing names for user: ${user.email}`);
                user.firstName = user.firstName && user.firstName !== 'null' ? user.firstName : (user.email.split('@')[0]);
                user.lastName = user.lastName && user.lastName !== 'null' ? user.lastName : 'User';
                await userRepo.save(user);
                fixedUsersCount++;
            }
        }
        console.log(`Fixed names for ${fixedUsersCount} users.`);


        await AppDataSource.destroy();
        console.log('Database fix completed.');
    } catch (error) {
        console.error('Error during database fix:', error);
    }
}

fixDatabase();
