import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CompanyService } from '../modules/companies/company.service';
import { UserService } from '../modules/users/user.service';
import { EmployeeService } from '../modules/employees/employee.service';
import { DepartmentService } from '../modules/departments/department.service';
import { AccessControlService } from '../modules/access-control/access-control.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const companyService = app.get(CompanyService);
  const userService = app.get(UserService);
  const employeeService = app.get(EmployeeService);
  const departmentService = app.get(DepartmentService);
  const accessControlService = app.get(AccessControlService);

  const configService = app.get(ConfigService);
  const env = configService.get('NODE_ENV') || 'development';
  const dbUrl = configService.get(env === 'production' ? 'DATABASE_URL_PROD' : 'DATABASE_URL') || configService.get('DATABASE_URL');

  console.log('--- Starting Difmo CRM Native Seeding ---');
  console.log(`Target Environment: ${env}`);
  console.log(`Target Database: ${dbUrl ? dbUrl.split('@')[1] : 'Local/Unknown'}`);

  // Check if data already exists
  const allCompanies = await companyService.findAll();
  const existingSeedUser = await userService.findByEmail('admin@difmo.com');
  const existingSeedCompany = await companyService.findByEmail('hello@difmo.com');

  if (allCompanies.length === 0) {
    console.log('✨ Fresh start: Database is empty. Starting initial seed...');
  } else if (existingSeedUser && existingSeedCompany) {
    console.log('ℹ️ Database already contains seed data (Admin and Company found).');
    console.log('--- Idempotent mode: Checking for missing records ---');
  } else {
    console.log(`ℹ️ Database has ${allCompanies.length} existing companies but is missing core seed data.`);
    console.log('--- Merging seed data with existing records ---');
  }

  // 1. Create Company
  let company = await companyService.findByEmail('hello@difmo.com');
  if (!company) {
    company = await companyService.create({
      name: 'Difmo',
      email: 'hello@difmo.com',
      website: 'www.difmo.com',
      phone: '+1 800 123 4567',
      address: 'Difmo Tower',
      city: 'TechCity',
      country: 'USA',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHoursStart: '09:00',
      workingHoursEnd: '18:00',
    } as any);
    console.log('✅ Created Company: Difmo');
  } else {
    console.log('ℹ️ Company Difmo already exists');
  }

  // 2. Create Departments
  const deptNames = ['Engineering', 'Human Resources', 'Sales', 'Marketing'];
  const departments: any[] = [];
  for (const name of deptNames) {
    let dept = (await departmentService.findAll()).find(d => d.name === name && d.company?.id === company!.id);
    if (!dept) {
      dept = await departmentService.create({ name, description: `${name} Department`, companyId: company!.id } as any);
      console.log(`✅ Created Department: ${name}`);
    } else {
      console.log(`ℹ️ Department ${name} already exists`);
    }
    departments.push(dept);
  }

  // 3. Create Roles
  const roleNames = ['Admin', 'Manager', 'Employee', 'HR'];
  const roles: any[] = [];
  const existingRoles = await accessControlService.findAllRoles();
  for (const name of roleNames) {
    let role = existingRoles.find(r => r.name === name);
    if (!role) {
      role = await accessControlService.createRole({ name, description: `${name} Role` } as any);
      console.log(`✅ Created Role: ${name}`);
    } else {
      console.log(`ℹ️ Role ${name} already exists`);
    }
    roles.push(role);
  }

  const adminRole = roles.find(r => r.name === 'Admin');
  const empRole = roles.find(r => r.name === 'Employee');

  // 4. Create Employees
  const employeesData = [
    {
      email: 'admin@difmo.com',
      firstName: 'Admin',
      lastName: 'User',
      password: 'password123',
      department: departments.find(d => d.name === 'Engineering'),
      role: adminRole,
    },
    {
      email: 'john.doe@difmo.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
      department: departments.find(d => d.name === 'Sales'),
      role: empRole,
    },
    {
      email: 'jane.smith@difmo.com',
      firstName: 'Jane',
      lastName: 'Smith',
      password: 'password123',
      department: departments.find(d => d.name === 'Human Resources'),
      role: empRole,
    }
  ];

  for (const empData of employeesData) {
    let user = await userService.findByEmail(empData.email);
    if (!user) {
      user = await userService.create({
        email: empData.email,
        firstName: empData.firstName,
        lastName: empData.lastName,
        password: empData.password,
        companyId: company!.id,
      } as any);

      // Assign Role
      if (empData.role) {
        await userService.assignRole(user.id, empData.role.name);
      }

      // Assign Department
      if (empData.department) {
        await userService.update(user.id, { department: empData.department });
      }

      // Create Employee Record
      await employeeService.create({
        userId: user.id,
        user: user,
        companyId: company!.id,
        company: company,
        department: empData.department,
        departmentId: empData.department?.id,
        employmentType: 'full-time',
        status: 'active',
        hireDate: new Date().toISOString(),
        role: empData.role?.name,
      } as any);

      console.log(`✅ Created User/Employee: ${empData.email}`);
    } else {
      console.log(`ℹ️ User ${empData.email} already exists`);
    }
  }

  console.log('--- Seeding Completed Successfully ---');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
