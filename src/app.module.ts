import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/companies/company.module';
import { UserModule } from './modules/users/user.module';
import { DepartmentModule } from './modules/departments/department.module';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { EmployeeModule } from './modules/employees/employee.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { Company } from './modules/companies/company.entity';
import { User } from './modules/users/user.entity';
import { Department } from './modules/departments/department.entity';
import { Role } from './modules/access-control/role.entity';
import { Permission } from './modules/access-control/permission.entity';
import { Employee } from './modules/employees/employee.entity';
import { Attendance } from './modules/attendance/attendance.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            entities: [Company, User, Department, Role, Permission, Employee, Attendance],
            synchronize: true, // Note: In production, migrations are preferred over synchronize: true
            ssl: {
              rejectUnauthorized: false,
            },
          };
        }
        return {
          type: 'sqlite',
          database: 'db.sqlite',
          entities: [Company, User, Department, Role, Permission, Employee, Attendance],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    CompanyModule,
    UserModule,
    DepartmentModule,
    AccessControlModule,
    EmployeeModule,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
