import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../modules/users/user.service';
import { EmployeeService } from '../modules/employees/employee.service';
import { Employee } from '../modules/employees/employee.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const employeeRepo = app.get<Repository<Employee>>(getRepositoryToken(Employee));
  const userService = app.get(UserService);

  const targetId = '0696e219-4564-45cb-9f2a-54ff9520fec1';

  console.log('--- Checking ID:', targetId, '---');

  const user = await userService.findById(targetId);
  if (user) {
    console.log('Found as USER:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    const employee = await employeeRepo.findOne({ where: { userId: user.id } });
    if (employee) {
      console.log('Linked EMPLOYEE ID:', employee.id);
    } else {
      console.log('No Linked EMPLOYEE found for this user.');
    }
  } else {
    console.log('Not found in USER table.');
  }

  const employeeDirect = await employeeRepo.findOne({ where: { id: targetId } });
  if (employeeDirect) {
    console.log('Found as EMPLOYEE record!');
  } else {
    console.log('Not found in EMPLOYEE table.');
  }

  await app.close();
}

bootstrap();
