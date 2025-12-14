import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    create(createCompanyDto: CreateCompanyDto): Promise<import("./company.entity").Company>;
    findById(id: string): Promise<import("./company.entity").Company | null>;
    findOne(email: string): Promise<import("./company.entity").Company | null>;
    update(id: string, updateData: any): Promise<import("./company.entity").Company>;
}
