import { Repository } from 'typeorm';
import { Company } from './company.entity';
export declare class CompanyService {
    private companyRepository;
    constructor(companyRepository: Repository<Company>);
    create(companyData: Partial<Company>): Promise<Company>;
    findByEmail(email: string): Promise<Company | null>;
    findById(id: string): Promise<Company | null>;
}
