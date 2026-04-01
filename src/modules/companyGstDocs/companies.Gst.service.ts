import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyGst } from './company.Gst.entity';
import { CompanyDocsDto } from './dto/comanyGst.dto';

@Injectable()
export class CompaniesGstService {
  constructor(
    @InjectRepository(CompanyGst)
    private readonly companyRepository: Repository<CompanyGst>,
  ) {}

  async findOne(id: string): Promise<CompanyGst | null> {
    return await this.companyRepository.findOne({ where: { id } });
  }

  async update(id: string, dto: CompanyDocsDto): Promise<CompanyGst> {
    // 1. Try to find the existing company
    let company = await this.findOne(id);

    if (!company) {
      // 2. CREATE logic: If not found, create a new instance with the provided ID
      company = this.companyRepository.create({ id, ...dto });
    } else {
      // 3. UPDATE logic: Merge new data into existing record
      company = this.companyRepository.merge(company, dto);
    }

    // 4. Save to PostgreSQL (Works for both Insert and Update in TypeORM)
    try {
      return await this.companyRepository.save(company);
    } catch (error) {
      throw new Error('Database operation failed: ' + error.message);
    }
  }
}