import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Permission } from '../src/modules/access-control/permission.entity';
import { DataSource } from 'typeorm';

async function cleanup() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const permissionRepository = dataSource.getRepository(Permission);
  
  const resourcesToDelete = ['department', 'company', 'dashboard', 'access-control'];
  
  console.log(`Cleaning up resources: ${resourcesToDelete.join(', ')}...`);
  
  for (const resource of resourcesToDelete) {
    const result = await permissionRepository.delete({ resource });
    console.log(`Deleted ${result.affected} records for resource: ${resource}`);
  }
  
  await app.close();
}

cleanup().catch(err => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
