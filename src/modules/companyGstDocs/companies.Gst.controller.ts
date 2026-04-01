import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { CompaniesGstService } from './companies.Gst.service';
import { CompanyDocsDto } from './dto/comanyGst.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesGstService
  ) {}

  @Get(':id')
  async getCompany(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  async updateDocs(
    @Param('id') id: string,
    @Body() dto: CompanyDocsDto,
  ) {
    return this.companiesService.update(id, dto);
  }
}