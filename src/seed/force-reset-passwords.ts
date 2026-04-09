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

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   RESET ALL EMPLOYEE PASSWORDS TO welcome123              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log(`Environment: ${env}`);
  console.log(`Database: ${dbUrl ? dbUrl.split('@')[1] : 'Unknown'}\n`);

  const users = await userRepo.find();
  console.log(`Found ${users.length} total users\n`);

  const adminPassword = 'password123';
  const employeePassword = 'welcome123';

  // Hash passwords with same salt rounds
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const employeeHash = await bcrypt.hash(employeePassword, 10);

  console.log('Hashing passwords:');
  console.log(`  Admin (password123): ${adminHash.substring(0, 20)}...`);
  console.log(`  Employee (welcome123): ${employeeHash.substring(0, 20)}...\n`);

  let adminCount = 0;
  let employeeCount = 0;

  console.log('Updating users:\n');

  for (const user of users) {
    const isAdmin = user.email === 'admin@difmo.com';
    
    if (isAdmin) {
      // Keep admin with password123
      await userRepo.update(user.id, { 
        password: adminHash,
        isActive: true 
      });
      console.log(`✅ ADMIN: ${user.email} → password123 (isActive=true)`);
      adminCount++;
    } else {
      // All other users get welcome123
      await userRepo.update(user.id, { 
        password: employeeHash,
        isActive: true 
      });
      console.log(`✅ EMPLOYEE: ${user.email} → welcome123 (isActive=true)`);
      employeeCount++;
    }
  }

  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║                   PASSWORD RESET SUMMARY                    ║`);
  console.log(`╠════════════════════════════════════════════════════════════╣`);
  console.log(`║ Admin Users Updated:      ${adminCount}`);
  console.log(`║ Employee Users Updated:   ${employeeCount}`);
  console.log(`║ Total Updated:            ${adminCount + employeeCount}`);
  console.log(`╚════════════════════════════════════════════════════════════╝`);

  console.log('\n✅ All passwords have been reset successfully!');
  console.log('\nLogin credentials:');
  console.log(`  Admin (admin@difmo.com): password123`);
  console.log(`  Employees: welcome123\n`);

  await app.close();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
