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
const ability_factory_1 = require("../access-control/ability.factory");
const abilities_decorator_1 = require("../access-control/abilities.decorator");
const abilities_guard_1 = require("../access-control/abilities.guard");
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
        return employees.map((emp) => this.transformEmployee(emp));
    }
    async findOne(id) {
        const employee = await this.employeeService.findOne(id);
        return employee ? this.transformEmployee(employee) : null;
    }
    async update(id, updateEmployeeDto) {
        const employee = await this.employeeService.update(id, updateEmployeeDto);
        return employee ? this.transformEmployee(employee) : null;
    }
    transformEmployee(emp) {
        return {
            ...emp,
            user: emp.user
                ? {
                    id: emp.user.id,
                    email: emp.user.email,
                    firstName: emp.user.firstName,
                    lastName: emp.user.lastName,
                    name: `${emp.user.firstName || ''} ${emp.user.lastName || ''}`.trim(),
                    phone: emp.user.phone,
                    isActive: emp.user.isActive,
                    roles: emp.user.roles?.map((r) => ({
                        id: r.id,
                        name: r.name,
                        permissions: r.permissions,
                    })),
                    permissions: emp.user.permissions,
                }
                : null,
            company: emp.company
                ? {
                    id: emp.company.id,
                    name: emp.company.name,
                }
                : null,
            department: emp.department
                ? {
                    id: emp.department.id,
                    name: emp.department.name,
                }
                : null,
            designation: emp.designation
                ? {
                    id: emp.designation.id,
                    name: emp.designation.name,
                }
                : null,
        };
    }
    async remove(id) {
        return this.employeeService.remove(id);
    }
};
exports.EmployeeController = EmployeeController;
__decorate([
    (0, common_1.Post)(),
    (0, abilities_decorator_1.CheckAbilities)({ action: ability_factory_1.Action.Create, subject: 'employee' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('fix-roles'),
    (0, abilities_decorator_1.CheckAbilities)({ action: ability_factory_1.Action.Update, subject: 'employee' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "fixRoles", null);
__decorate([
    (0, common_1.Get)('stats/count'),
    (0, abilities_decorator_1.CheckAbilities)({ action: ability_factory_1.Action.Read, subject: 'employee' }),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getCount", null);
__decorate([
    (0, common_1.Get)(),
    (0, abilities_decorator_1.CheckAbilities)({ action: ability_factory_1.Action.Read, subject: 'employee' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, abilities_decorator_1.CheckAbilities)({ action: ability_factory_1.Action.Read, subject: 'employee' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, abilities_decorator_1.CheckAbilities)({ action: ability_factory_1.Action.Update, subject: 'employee' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employee_dto_1.UpdateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, abilities_decorator_1.CheckAbilities)({ action: ability_factory_1.Action.Delete, subject: 'employee' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "remove", null);
exports.EmployeeController = EmployeeController = __decorate([
    (0, common_1.Controller)('employees'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, abilities_guard_1.AbilitiesGuard),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService])
], EmployeeController);
//# sourceMappingURL=employee.controller.js.map