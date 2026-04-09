import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { EmployeeModule } from '../employees/employee.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { ProjectsModule } from '../projects/projects.module';
import { LeavesModule } from '../leaves/leaves.module';
import { AuditLogModule } from '../audit-logs/audit-log.module';
import { FinanceModule } from '../finance/finance.module';

@Module({
  imports: [
    EmployeeModule,
    AttendanceModule,
    ProjectsModule,
    LeavesModule,
    AuditLogModule,
    FinanceModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
