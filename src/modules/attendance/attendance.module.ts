import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';

import { LeavesModule } from '../leaves/leaves.module';

import { EmployeeModule } from '../employees/employee.module';

@Module({
    imports: [TypeOrmModule.forFeature([Attendance]), LeavesModule, EmployeeModule],
    controllers: [AttendanceController],
    providers: [AttendanceService],
    exports: [AttendanceService],
})
export class AttendanceModule { }
