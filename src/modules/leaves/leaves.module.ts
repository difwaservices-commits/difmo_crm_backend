import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeavesService } from './leaves.service';
import { LeavesController } from './leaves.controller';
import { Leave } from './leave.entity';
import { Employee } from '../employees/employee.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmailService } from './email.service';



@Module({
  imports: [TypeOrmModule.forFeature([Leave, Employee,]), NotificationsModule],
  controllers: [LeavesController],
  providers: [LeavesService, EmailService],
  exports: [LeavesService],
})
export class LeavesModule { }
