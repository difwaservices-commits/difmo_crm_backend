import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../modules/users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));

  const users = await userRepo.find();
  console.log(`Found ${users.length} users`);

  for (const user of users) {
    // If password does not start with $2b$ it's not hashed
    if (!user.password.startsWith('$2b$')) {
      console.log(`Fixing password for: ${user.email} (was plain text: ${user.password.substring(0, 10)}...)`);
      const hashed = await bcrypt.hash('Password123!', 10);
      await userRepo.update(user.id, { password: hashed });
      console.log(`  ✅ Fixed: ${user.email}`);
    } else {
      console.log(`  ✔ OK: ${user.email} (already hashed)`);
    }
  }

  console.log('--- All passwords fixed ---');
  await app.close();
}

main();
