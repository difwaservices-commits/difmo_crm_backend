import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../modules/users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));

  console.log('\n======== CURRENT DATABASE STATE ========\n');

  const users = await userRepo.find();
  console.log(`Total users in database: ${users.length}\n`);

  if (users.length === 0) {
    console.log('❌ No users found in database!');
    await app.close();
    return;
  }

  for (const user of users) {
    console.log(`Email: ${user.email}`);
    console.log(`  Active: ${user.isActive}`);
    console.log(`  Password Hash: ${user.password}\n`);
  }

  // Test passwords
  console.log('======== TESTING PASSWORDS ========\n');
  
  for (const user of users) {
    console.log(`Testing: ${user.email}`);
    
    const testAdmin = await bcrypt.compare('password123', user.password);
    const testEmployee = await bcrypt.compare('welcome123', user.password);
    
    if (testAdmin) {
      console.log(`  ✅ Matches: password123\n`);
    } else if (testEmployee) {
      console.log(`  ✅ Matches: welcome123\n`);
    } else {
      console.log(`  ❌ NO MATCH with either password!\n`);
    }
  }

  await app.close();
}

main().catch(console.error);
