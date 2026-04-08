import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../modules/users/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  const configService = app.get(ConfigService);

  const env = configService.get('NODE_ENV') || 'development';

  console.log('--- Verifying Current Passwords in Database ---');
  console.log(`Environment: ${env}\n`);

  const users = await userRepo.find();
  console.log(`Total users in database: ${users.length}\n`);

  for (const user of users) {
    console.log(`Email: ${user.email}`);
    console.log(`  Password Hash: ${user.password.substring(0, 20)}...`);
    console.log(`  IsActive: ${user.isActive}`);
    console.log('');
  }

  console.log('--- Verification complete ---');
  await app.close();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
