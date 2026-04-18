import { Controller, Get, Body, Param, Query, Patch, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  listApplications(@Query() q: any) {
    return this.jobsService.listApplications(q);
  }

  @Patch(':id/status')
  updateAppStatus(@Param('id') id: string, @Body() body: any) {
    return this.jobsService.updateApplicationStatus(id, body.status);
  }
}
