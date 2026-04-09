import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  async getMetrics(@Query('companyId') companyId: string, @Query('userId') userId?: string) {
    return this.dashboardService.getMetrics(companyId, userId);
  }

  @Get('charts')
  async getCharts(@Query('companyId') companyId: string) {
    return this.dashboardService.getChartData(companyId);
  }

  @Get('feed')
  async getFeed(@Query('companyId') companyId: string, @Query('userId') userId?: string) {
    return this.dashboardService.getFeedData(companyId, userId);
  }

  @Get('financials')
  async getFinancials(@Query('companyId') companyId: string) {
    return this.dashboardService.getFinancials(companyId);
  }
}
