import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyGst } from './company.Gst.entity';
import { CompaniesController } from './companies.Gst.controller';
import { CompaniesGstService } from './companies.Gst.service';


@Module({
  imports: [
    // This makes the Repository available for injection in the service
    TypeOrmModule.forFeature([CompanyGst])
  ],
  controllers: [CompaniesController],
  providers: [CompaniesGstService],
  exports: [CompaniesGstService] // Export if other modules need this logic
  
})
export class CompaniesModule {}