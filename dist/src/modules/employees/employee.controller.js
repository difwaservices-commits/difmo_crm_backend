"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const common_1 = require("@nestjs/common");
const employee_service_1 = require("./employee.service");
const employee_dto_1 = require("./dto/employee.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let EmployeeController = class EmployeeController {
    employeeService;
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    async create(createEmployeeDto) {
        return this.employeeService.create(createEmployeeDto);
    }
    async fixRoles() {
        return this.employeeService.fixEmployeeRoles();
    }
    async getCount(companyId) {
        const count = await this.employeeService.count(companyId);
        return { count };
    }
    async findAll(query) {
        const employees = await this.employeeService.findAll(query);
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
            user: emp.user ? {
                id: emp.user.id,
                email: emp.user.email,
                firstName: emp.user.firstName,
                lastName: emp.user.lastName,
                phone: emp.user.phone,
                isActive: emp.user.isActive,
                avatar: emp.user['avatar']
            } : null,
            company: emp.company ? {
                id: emp.company.id,
                name: emp.company.name,
                email: emp.company.email,
            } : null,
            department: emp.department ? {
                id: emp.department.id,
                name: emp.department.name,
            } : null,
        }));
        return transformedEmployees;
    }
    async findOne(id) {
        return this.employeeService.findOne(id);
    }
    async update(id, updateEmployeeDto) {
        return this.employeeService.update(id, updateEmployeeDto);
    }
    async remove(id) {
        return this.employeeService.remove(id);
    }
};
exports.EmployeeController = EmployeeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('fix-roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "fixRoles", null);
__decorate([
    (0, common_1.Get)('stats/count'),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getCount", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employee_dto_1.UpdateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "remove", null);
exports.EmployeeController = EmployeeController = __decorate([
    (0, common_1.Controller)('employees'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService])
], EmployeeController);
//# sourceMappingURL=employee.controller.js.map