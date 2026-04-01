import { Controller, Get, Post, Body, Param, BadRequestException, Request, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  getAllClients() {
    return this.clientsService.findAll();
  }

  @Post() // Ye naye client ke liye hai
  createClient(@Body() clientData: any) {
    return this.clientsService.create(clientData);
  }
@UseGuards(JwtAuthGuard)
 @Post(':id/send-invoice')
async sendInvoice(
  @Param('id') id: string,
  @Body() invoiceData: any, 
  @Request() req: any 
) {
  // 1. Extract companyId from the authenticated user
  // (Usually attached by your AuthGuard/JWT Strategy)
  const companyId = req.user?.companyId || req.user?.company?.id;

  if (!companyId) {
    throw new BadRequestException('Company context not found for this user');
  }

  // 2. Pass all THREE arguments to the service
  return this.clientsService.sendInvoice(id, invoiceData, companyId);
}
}