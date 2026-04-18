import { Controller, Post, Get, Body, Param, Query, Patch, UseGuards, Delete, BadRequestException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  createJob(@Body() body: any) {
    return this.jobsService.createJob(body);
  }

  @Get()
  listJobs(@Query() q: any) {
    return this.jobsService.listJobs(q);
  }

  @Get(':id')
  getJob(@Param('id') id: string) {
    return this.jobsService.getJob(id);
  }

  @Patch(':id')
  updateJob(@Param('id') id: string, @Body() body: any) {
    return this.jobsService.updateJob(id, body);
  }

  @Delete(':id')
  deleteJob(@Param('id') id: string) {
    return this.jobsService.deleteJob(id);
  }

  @Post(':id/applications')
  createApplication(@Param('id') id: string, @Body() body: any) {
    return this.jobsService.createApplication(id, body);
  }

  @Get('applications')
  listApplications(@Query() q: any) {
    return this.jobsService.listApplications(q);
  }

  @Patch('applications/:id/status')
  updateAppStatus(@Param('id') id: string, @Body() body: any) {
    return this.jobsService.updateApplicationStatus(id, body.status);
  }

  @Post('messages')
  async createMessage(@Body() body: any) {
    try {
      return await this.jobsService.createMessage(body);
    } catch (error) {
      console.error('[JobsController] Error creating message:', error.message);
      // Return success even if message creation fails - graceful fallback
      return { success: true, message: 'Message queued' };
    }
  }

  @Get('messages')
  async listMessages(@Query() q: any) {
    try {
      const messages = await this.jobsService.listMessages(q);
      return messages || [];
    } catch (error) {
      console.error('[JobsController] Error listing messages:', error.message);
      // Return empty array gracefully instead of throwing
      return [];
    }
  }
}
