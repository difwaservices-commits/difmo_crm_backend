import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../modules/users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  const configService = app.get(ConfigService);

  const env = configService.get('NODE_ENV') || 'development';

  console.log('--- Database Password Debug ---');
  console.log(`Environment: ${env}\n`);

  const users = await userRepo.find();
  console.log(`Total users: ${users.length}\n`);

  // Test passwords
  const adminTestPassword = 'password123';
  const employeeTestPassword = 'welcome123';

  for (const user of users) {
    console.log(`\nUser Email: ${user.email}`);
    console.log(`  IsActive: ${user.isActive}`);
    console.log(`  Password Hash: ${user.password}`);
    
    // Test password comparisons
    const adminMatch = await bcrypt.compare(adminTestPassword, user.password);
    const employeeMatch = await bcrypt.compare(employeeTestPassword, user.password);
    
    console.log(`  Matches "password123": ${adminMatch}`);
    console.log(`  Matches "welcome123": ${employeeMatch}`);

    if (adminMatch) {
      console.log(`  ✅ This user can login with: password123`);
    } else if (employeeMatch) {
      console.log(`  ✅ This user can login with: welcome123`);
    } else {
      console.log(`  ❌ Neither password matches!`);
    }
  }

  await app.close();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
