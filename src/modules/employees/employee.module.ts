import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { Company } from '../companies/company.entity';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

import { UserModule } from '../users/user.module';
import { AccessControlModule } from '../access-control/access-control.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Company]),
    UserModule,
    AccessControlModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
