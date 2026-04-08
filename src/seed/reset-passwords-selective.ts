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
  const dbUrl = configService.get(env === 'production' ? 'DATABASE_URL_PROD' : 'DATABASE_URL') || configService.get('DATABASE_URL');

  console.log('--- Starting Selective Password Reset Script ---');
  console.log(`Target Environment: ${env}`);
  console.log(`Target Database: ${dbUrl ? dbUrl.split('@')[1] : 'Local/Unknown'}`);

  const users = await userRepo.find();
  console.log(`Found ${users.length} total users to update.\n`);

  const adminPassword = 'password123';
  const employeePassword = 'welcome123';

  let adminUpdated = 0;
  let employeesUpdated = 0;

  // Pre-hash both passwords for consistency
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const employeeHash = await bcrypt.hash(employeePassword, 10);

  console.log(`\nHashed Passwords:`);
  console.log(`  Admin (${adminPassword}): ${adminHash.substring(0, 20)}...`);
  console.log(`  Employee (${employeePassword}): ${employeeHash.substring(0, 20)}...\n`);

  for (const user of users) {
    if (user.email === 'admin@difmo.com') {
      await userRepo.update(user.id, { password: adminHash });
      console.log(`✅ ADMIN: ${user.email} → password123`);
      adminUpdated++;
    } else {
      await userRepo.update(user.id, { password: employeeHash });
      console.log(`✅ EMPLOYEE: ${user.email} → welcome123`);
      employeesUpdated++;
    }
  }

  console.log('\n--- Password Reset Summary ---');
  console.log(`✅ Admin users updated: ${adminUpdated}`);
  console.log(`✅ Employee users updated: ${employeesUpdated}`);
  console.log(`✅ Total updated: ${adminUpdated + employeesUpdated}`);
  console.log('--- Password reset process completed ---');
  
  await app.close();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
