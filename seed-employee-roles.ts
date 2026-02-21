// @ts-nocheck

import { DataSource } from 'typeorm';
import { User } from './src/modules/users/user.entity';
import { Company } from './src/modules/companies/company.entity';
import { Role } from './src/modules/access-control/role.entity';
import { Permission } from './src/modules/access-control/permission.entity';
import { Department } from './src/modules/departments/department.entity';
import { Employee } from './src/modules/employees/employee.entity';
import { Attendance } from './src/modules/attendance/attendance.entity';

require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

console.log('Connecting to database...');

const AppDataSource = new DataSource({
    type: dbUrl && dbUrl.startsWith('postgres') ? 'postgres' : 'sqlite',
    database: dbUrl && dbUrl.startsWith('postgres') ? undefined : 'db.sqlite',
    url: dbUrl,
    entities: [User, Company, Role, Permission, Department, Employee, Attendance],
    synchronize: false,
    ssl: dbUrl && dbUrl.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
});

async function seedEmployeeRoles() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');

        const roleRepo = AppDataSource.getRepository(Role);
        const userRepo = AppDataSource.getRepository(User);
        const employeeRepo = AppDataSource.getRepository(Employee);

        // 1. Find or Create Employee Role
        let employeeRole = await roleRepo.findOne({ where: { name: 'Employee' } });
        if (!employeeRole) {
            console.log("Role 'Employee' not found. Creating...");
            employeeRole = roleRepo.create({
                name: 'Employee',
                description: 'Standard employee access',
                company: null, // Global role
            });
            await roleRepo.save(employeeRole);
            console.log("Created 'Employee' role.");
        } else {
            console.log("Role 'Employee' found.");
        }

        // 2. Find all employees
        const employees = await employeeRepo.find({ relations: ['user'] });
        console.log(`Found ${employees.length} employee records.`);

        let updatedCount = 0;

        for (const emp of employees) {
            if (!emp.user) {
                console.log(`Employee ${emp.id} (Code: ${emp.employeeCode}) has no linked user. Skipping.`);
                continue;
            }

            const user = await userRepo.findOne({
                where: { id: emp.user.id },
                relations: ['roles']
            });

            if (!user) {
                console.log(`User ID ${emp.userId} not found in user repo (data consistency issue). Skipping.`);
                continue;
            }

            // Check if user has role
            const hasRole = user.roles.some(r => r.name === 'Employee');

            if (!hasRole) {
                console.log(`Assigning 'Employee' role to user: ${user.email} (${user.firstName} ${user.lastName})`);
                if (!user.roles) user.roles = [];
                user.roles.push(employeeRole);
                await userRepo.save(user);
                updatedCount++;
            }
        }

        console.log(`Updated roles for ${updatedCount} users.`);

        await AppDataSource.destroy();
        console.log('Done.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding employee roles:', error);
        process.exit(1);
    }
}

seedEmployeeRoles();
