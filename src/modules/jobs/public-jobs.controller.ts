import { Controller, Get, Post, Patch, Delete, Query, Body, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('public/jobs')
export class PublicJobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async listJobs(@Query() q: any) {
    return this.jobsService.listJobs();
  }

  @Post()
  async createJob(@Body() body: any) {
    return this.jobsService.createJob(body);
  }

  @Get('applications')
  async listApplications(@Query() q: any) {
    return this.jobsService.listApplications(q);
  }

  @Get(':id')
  async getJob(@Param('id') id: string) {
    return this.jobsService.getJob(id);
  }

  @Patch(':id')
  async updateJob(@Param('id') id: string, @Body() body: any) {
    return this.jobsService.updateJob(id, body);
  }

  @Delete(':id')
  async deleteJob(@Param('id') id: string) {
    return this.jobsService.deleteJob(id);
  }

  @Post(':jobId/applications')
  async createApplication(@Param('jobId') jobId: string, @Body() body: any) {
    return this.jobsService.createApplication(jobId, body);
  }
}
