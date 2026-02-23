import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Action } from '../access-control/ability.factory';
import { CheckAbilities } from '../access-control/abilities.decorator';
import { AbilitiesGuard } from '../access-control/abilities.guard';

@Controller('employees')
@UseGuards(JwtAuthGuard, AbilitiesGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: 'employee' })
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Post('fix-roles')
  @CheckAbilities({ action: Action.Update, subject: 'employee' })
  async fixRoles() {
    return this.employeeService.fixEmployeeRoles();
  }

  @Get('stats/count')
  @CheckAbilities({ action: Action.Read, subject: 'employee' })
  async getCount(@Query('companyId') companyId?: string) {
    const count = await this.employeeService.count(companyId);
    return { count };
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: 'employee' })
  async findAll(@Query() query: any) {
    const employees = await this.employeeService.findAll(query);

    // CRITICAL: Transform to remove circular references (Employee -> User -> Company -> Users -> ...)
    const transformedEmployees = employees.map((emp) => ({
      id: emp.id,
      userId: emp.userId,
      companyId: emp.companyId,
      departmentId: emp.departmentId,
      role: emp.role,
      hireDate: emp.hireDate,
      salary: emp.salary,
      manager: emp.manager,
      branch: emp.branch,
      employmentType: emp.employmentType,
      status: emp.status,
      address: emp.address,
      emergencyContact: emp.emergencyContact,
      emergencyPhone: emp.emergencyPhone,
      skills: emp.skills,
      createdAt: emp.createdAt,
      updatedAt: emp.updatedAt,
      user: emp.user
        ? {
            id: emp.user.id,
            email: emp.user.email,
            firstName: emp.user.firstName,
            lastName: emp.user.lastName,
            phone: emp.user.phone,
            isActive: emp.user.isActive,
          }
        : null,
      company: emp.company
        ? {
            id: emp.company.id,
            name: emp.company.name,
            email: emp.company.email,
          }
        : null,
      department: emp.department
        ? {
            id: emp.department.id,
            name: emp.department.name,
          }
        : null,
    }));

    return transformedEmployees;
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: 'employee' })
  async findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Put(':id')
  @CheckAbilities({ action: Action.Update, subject: 'employee' })
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: 'employee' })
  async remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
