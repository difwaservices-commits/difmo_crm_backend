import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllProject } from './project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([AllProject])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class AllProjectModule {}
