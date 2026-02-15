import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmployeeService } from '../employees/employee.service';
import { AttendanceService } from '../attendance/attendance.service';
import { ProjectsService } from '../projects/projects.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly attendanceService: AttendanceService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Get('metrics')
  async getMetrics(@Query('companyId') companyId: string) {
    const employees = await this.employeeService.findAll({ companyId });
    const attendance = await this.attendanceService.findAll({
      companyId,
      date: new Date().toISOString().split('T')[0],
    });
    const tasks = await this.projectsService.findAllTasksByCompany(companyId);

    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const avgProductivity = 87; // Placeholder or calculate from productivity logs

    return {
      totalEmployees: employees.length,
      presentToday: attendance.length,
      tasksCompleted: completedTasks,
      avgProductivity,
    };
  }
}
