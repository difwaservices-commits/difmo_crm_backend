import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { Employee } from '../employees/employee.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

import { AccessControlModule } from '../access-control/access-control.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MailService } from '../mail/mail.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Project, Task, Employee]),
    AccessControlModule,
    NotificationsModule,
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule { }

