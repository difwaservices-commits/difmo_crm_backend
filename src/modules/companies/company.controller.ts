import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @Post()
    create(@Body() createCompanyDto: CreateCompanyDto) {
        return this.companyService.create(createCompanyDto);
    }

    @Get('id/:id')
    findById(@Param('id') id: string) {
        console.log('Fetching company by ID:', id);
        return this.companyService.findById(id);
    }

    @Get(':email')
    findOne(@Param('email') email: string) {
        return this.companyService.findByEmail(email);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateData: any) {
        return this.companyService.update(id, updateData);
    }
}
