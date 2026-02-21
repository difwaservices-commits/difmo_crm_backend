import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllProject } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(AllProject)
    private repo: Repository<AllProject>,
  ) {}

  create(dto: CreateProjectDto) {
    const project = this.repo.create(dto);
    return this.repo.save(project);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const project = await this.repo.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }


  update(id: number, dto: UpdateProjectDto) {
    return this.repo.update(id, dto);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
