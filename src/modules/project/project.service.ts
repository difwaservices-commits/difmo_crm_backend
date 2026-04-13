import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllProject } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Employee } from '../employees/employee.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(AllProject)
    private repo: Repository<AllProject>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) { }

  async create(dto: CreateProjectDto) {
    const project = this.repo.create(dto);

    // If assignedEmployeeIds are provided, load the employee records
    if (dto.assignedEmployeeIds && Array.isArray(dto.assignedEmployeeIds)) {
      const employees = await this.employeeRepository.findByIds(dto.assignedEmployeeIds);
      project.assignedEmployees = employees;
    }

    return this.repo.save(project);
  }

  findAll() {
    return this.repo.find({
      relations: ['assignedEmployees', 'assignedEmployees.user']
    });
  }

  async findOne(id: number) {
    const project = await this.repo.findOne({
      where: { id },
      relations: ['assignedEmployees', 'assignedEmployees.user']
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: number, dto: UpdateProjectDto) {
    const project = await this.findOne(id);

    // Handle assignedEmployeeIds
    if (dto.assignedEmployeeIds && Array.isArray(dto.assignedEmployeeIds)) {
      const employees = await this.employeeRepository.findByIds(dto.assignedEmployeeIds);
      project.assignedEmployees = employees;
    }

    // Update other fields
    Object.assign(project, dto);
    return this.repo.save(project);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
