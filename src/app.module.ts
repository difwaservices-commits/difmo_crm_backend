import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/companies/company.module';
import { UserModule } from './modules/users/user.module';
import { DepartmentModule } from './modules/departments/department.module';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { Company } from './modules/companies/company.entity';
import { User } from './modules/users/user.entity';
import { Department } from './modules/departments/department.entity';
import { Role } from './modules/access-control/role.entity';
import { Permission } from './modules/access-control/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Company, User, Department, Role, Permission],
      synchronize: true, // Auto-create tables (dev only)
    }),
    AuthModule,
    CompanyModule,
    UserModule,
    DepartmentModule,
    AccessControlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
