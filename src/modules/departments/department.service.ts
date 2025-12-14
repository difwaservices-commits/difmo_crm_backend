import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
    constructor(
        @InjectRepository(Department)
        private departmentRepository: Repository<Department>,
    ) { }

    async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
        const department = this.departmentRepository.create(createDepartmentDto);
        return this.departmentRepository.save(department);
    }

    async findAll(companyId?: string): Promise<Department[]> {
        const query = this.departmentRepository.createQueryBuilder('department')
            .leftJoinAndSelect('department.company', 'company')
            .leftJoinAndSelect('department.manager', 'manager');

        if (companyId) {
            query.where('department.companyId = :companyId', { companyId });
        }

        return query.getMany();
    }

    async findOne(id: string): Promise<Department> {
        const department = await this.departmentRepository.findOne({
            where: { id },
            relations: ['company', 'manager'],
        });

        if (!department) {
            throw new NotFoundException(`Department with ID ${id} not found`);
        }

        return department;
    }

    async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
        const department = await this.findOne(id);
        Object.assign(department, updateDepartmentDto);
        return this.departmentRepository.save(department);
    }

    async remove(id: string): Promise<void> {
        const result = await this.departmentRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Department with ID ${id} not found`);
        }
    }
}
