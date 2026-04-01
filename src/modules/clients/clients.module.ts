import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from '../invoices/invoice.entity';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client } from './client.entity';
import { CompaniesModule } from '../companyGstDocs/copmanies.Gst.modules';
 // 1. Import the Invoice entity

@Module({
  imports: [
    // 2. Add Invoice to this array so NestJS creates the "InvoiceRepository"
    TypeOrmModule.forFeature([Client, Invoice]) ,
    CompaniesModule
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}