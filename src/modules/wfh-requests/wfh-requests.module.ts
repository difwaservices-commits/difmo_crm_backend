import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WFHRequest } from './wfh-request.entity';
import { WFHRequestsService } from './wfh-requests.service';
import { WFHRequestsController } from './wfh-requests.controller';
import { Employee } from '../employees/employee.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WFHRequest, Employee]),
    NotificationsModule,
  ],
  controllers: [WFHRequestsController],
  providers: [WFHRequestsService],
  exports: [WFHRequestsService],
})
export class WFHRequestsModule {}
