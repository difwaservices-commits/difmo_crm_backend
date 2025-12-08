import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) { }

    @Post()
    async create(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.employeeService.create(createEmployeeDto);
    }

    @Get('stats/count')
    async getCount(@Query('companyId') companyId?: string) {
        const count = await this.employeeService.count(companyId);
        return { count };
    }

    @Get()
    async findAll(@Query() query: any) {
        const employees = await this.employeeService.findAll(query);

        // CRITICAL: Transform to remove circular references (Employee -> User -> Company -> Users -> ...)
        // Without this, JSON serialization fails silently or returns unexpected results
        const transformedEmployees = employees.map(emp => ({
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
            // Include user data without circular references
            user: emp.user ? {
                id: emp.user.id,
                email: emp.user.email,
                firstName: emp.user.firstName,
                lastName: emp.user.lastName,
                phone: emp.user.phone,
                isActive: emp.user.isActive,
                avatar: emp.user['avatar'] // specific field if needed
            } : null,
            // Include company data without circular references
            company: emp.company ? {
                id: emp.company.id,
                name: emp.company.name,
                email: emp.company.email,
            } : null,
            // Include department data without circular references
            department: emp.department ? {
                id: emp.department.id,
                name: emp.department.name,
            } : null,
        }));

        return transformedEmployees;
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.employeeService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
        return this.employeeService.update(id, updateEmployeeDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.employeeService.remove(id);
    }
}
