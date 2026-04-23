import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AccessControlService } from '../src/modules/access-control/access-control.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(AccessControlService);
  
  console.log('Triggering seedDefaultPermissions...');
  const result = await service.seedDefaultPermissions();
  console.log('Result:', result);
  
  await app.close();
}

bootstrap().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
