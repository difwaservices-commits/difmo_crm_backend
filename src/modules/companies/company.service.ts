import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
    ) { }

    async create(companyData: Partial<Company>): Promise<Company> {
        const company = this.companyRepository.create(companyData);
        return this.companyRepository.save(company);
    }

    async findByEmail(email: string): Promise<Company | null> {
        return this.companyRepository.findOne({ where: { email } });
    }

    async findById(id: string): Promise<Company | null> {
        return this.companyRepository.findOne({ where: { id }, relations: ['users', 'departments'] });
    }

    async update(id: string, updateData: Partial<Company>): Promise<Company> {
        await this.companyRepository.update(id, updateData);
        return this.findById(id) as Promise<Company>;
    }
}
