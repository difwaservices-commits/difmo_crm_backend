import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @Post()
    create(@Body() createCompanyDto: CreateCompanyDto) {
        return this.companyService.create(createCompanyDto);
    }

    @Get(':email')
    findOne(@Param('email') email: string) {
        return this.companyService.findByEmail(email);
    }
}
