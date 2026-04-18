import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { ApplicationsController } from './applications.controller';
import { PublicJobsController } from './public-jobs.controller';
import { Job } from './entities/job.entity';
import { Application } from './entities/application.entity';
import { JobMessage } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Application, JobMessage])],
  providers: [JobsService],
  controllers: [JobsController, ApplicationsController, PublicJobsController],
  exports: [JobsService],
})
export class JobsModule {}
