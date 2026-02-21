import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntry } from './time-entry.entity';
import { TimeTrackingService } from './time-tracking.service';
import { TimeTrackingController } from './time-tracking.controller';

import { AccessControlModule } from '../access-control/access-control.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeEntry]),
    AccessControlModule
  ],
  providers: [TimeTrackingService],
  controllers: [TimeTrackingController],
  exports: [TimeTrackingService],
})
export class TimeTrackingModule { }
