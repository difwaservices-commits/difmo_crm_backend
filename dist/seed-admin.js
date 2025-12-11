"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("./src/modules/users/user.entity");
const company_entity_1 = require("./src/modules/companies/company.entity");
const role_entity_1 = require("./src/modules/access-control/role.entity");
const permission_entity_1 = require("./src/modules/access-control/permission.entity");
const department_entity_1 = require("./src/modules/departments/department.entity");
const employee_entity_1 = require("./src/modules/employees/employee.entity");
const attendance_entity_1 = require("./src/modules/attendance/attendance.entity");
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL;
const AppDataSource = new typeorm_1.DataSource({
    type: dbUrl ? 'postgres' : 'sqlite',
    database: dbUrl ? undefined : 'db.sqlite',
    url: dbUrl,
    entities: [user_entity_1.User, company_entity_1.Company, role_entity_1.Role, permission_entity_1.Permission, department_entity_1.Department, employee_entity_1.Employee, attendance_entity_1.Attendance],
    synchronize: false,
    ssl: dbUrl ? { rejectUnauthorized: false } : undefined,
});
async function seedAdmin() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');
        const companyRepo = AppDataSource.getRepository(company_entity_1.Company);
        const roleRepo = AppDataSource.getRepository(role_entity_1.Role);
        const userRepo = AppDataSource.getRepository(user_entity_1.User);
        let company = await companyRepo.findOne({ where: { email: 'admin@difmocrm.com' } });
        if (!company) {
            console.log('Creating default company...');
            company = companyRepo.create({
                name: 'Difmo CRM',
                email: 'admin@difmocrm.com',
                website: 'https://difmocrm.com',
                industry: 'Technology',
            });
            await companyRepo.save(company);
        }
        else {
            console.log('Company already exists.');
        }
        let role = await roleRepo.findOne({ where: { name: 'Super Admin' } });
        if (!role) {
            console.log('Creating Super Admin role...');
            role = roleRepo.create({
                name: 'Super Admin',
                description: 'Full access to all resources',
                company: null,
            });
            await roleRepo.save(role);
        }
        else {
            console.log('Super Admin role already exists.');
        }
        const adminEmail = 'admin@difmocrm.com';
        let admin = await userRepo.findOne({ where: { email: adminEmail } });
        if (!admin) {
            console.log('Creating Admin user...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            admin = userRepo.create({
                email: adminEmail,
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                isActive: true,
                company: company,
                roles: [role],
            });
            await userRepo.save(admin);
            console.log('Admin user created successfully.');
            console.log('Email: admin@difmocrm.com');
            console.log('Password: admin123');
        }
        else {
            console.log('Admin user already exists.');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            admin.password = hashedPassword;
            await userRepo.save(admin);
            console.log('Admin password reset to: admin123');
        }
        await AppDataSource.destroy();
    }
    catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}
seedAdmin();
//# sourceMappingURL=seed-admin.js.map