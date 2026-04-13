import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllProject } from './project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Employee } from '../employees/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AllProject, Employee])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class AllProjectModule { }
