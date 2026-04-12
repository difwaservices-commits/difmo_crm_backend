import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../modules/users/user.entity';
import { Employee } from '../modules/employees/employee.entity';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const userRepo = app.get(getRepositoryToken(User));
    const empRepo = app.get(getRepositoryToken(Employee));
    
    const user = await userRepo.findOne({ where: { email: 'admin@company.com' } });
    if (user) {
      const emp = await empRepo.findOne({ 
        where: { userId: user.id }
      });
      console.log('USER_INFO:', JSON.stringify({
        email: user.email,
        companyId: emp?.companyId,
      }, null, 2));
    } else {
      console.log('USER NOT FOUND');
    }
  } catch (err) {
    console.error('Error querying user info:', err.message);
  } finally {
    await app.close();
    process.exit(0);
  }
}
run();
