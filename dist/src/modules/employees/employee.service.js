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
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("./employee.entity");
const user_service_1 = require("../users/user.service");
let EmployeeService = class EmployeeService {
    employeeRepository;
    userService;
    constructor(employeeRepository, userService) {
        this.employeeRepository = employeeRepository;
        this.userService = userService;
    }
    async create(createEmployeeDto) {
        let userId = createEmployeeDto.userId;
        if (!userId && createEmployeeDto.email) {
            console.log('[EmployeeService] Creating new user for employee:', createEmployeeDto.email);
            const existingUser = await this.userService.findByEmail(createEmployeeDto.email);
            if (existingUser) {
                console.log('[EmployeeService] User already exists, using existing userId:', existingUser.id);
                userId = existingUser.id;
            }
            else {
                const newUser = await this.userService.create({
                    email: createEmployeeDto.email,
                    password: createEmployeeDto.password || 'Welcome123!',
                    firstName: createEmployeeDto.firstName,
                    lastName: createEmployeeDto.lastName,
                    phone: createEmployeeDto.phone,
                    companyId: createEmployeeDto.companyId,
                    isActive: true
                });
                userId = newUser.id;
                console.log('[EmployeeService] Created new user with ID:', userId);
            }
        }
        if (!userId) {
            throw new Error('User ID is required or sufficient details to create a user');
        }
        const employee = this.employeeRepository.create({
            ...createEmployeeDto,
            userId
        });
        const count = await this.employeeRepository.count();
        const code = `DIF${(count + 1).toString().padStart(4, '0')}`;
        employee.employeeCode = code;
        return this.employeeRepository.save(employee);
    }
    async findAll(filters) {
        console.log('[EmployeeService] findAll called with filters:', JSON.stringify(filters));
        const query = this.employeeRepository.createQueryBuilder('employee')
            .leftJoinAndSelect('employee.user', 'user')
            .leftJoinAndSelect('employee.company', 'company')
            .leftJoinAndSelect('employee.department', 'department');
        if (filters?.companyId) {
            console.log('[EmployeeService] Filtering by companyId:', filters.companyId);
            query.andWhere('employee.companyId = :companyId', { companyId: filters.companyId });
        }
        if (filters?.userId) {
            console.log('[EmployeeService] Filtering by userId:', filters.userId);
            query.andWhere('employee.userId = :userId', { userId: filters.userId });
        }
        if (filters?.department) {
            console.log('[EmployeeService] Filtering by department:', filters.department);
            query.andWhere('employee.departmentId = :departmentId', { departmentId: filters.department });
        }
        if (filters?.status) {
            console.log('[EmployeeService] Filtering by status:', filters.status);
            query.andWhere('employee.status = :status', { status: filters.status });
        }
        if (filters?.employmentType) {
            console.log('[EmployeeService] Filtering by employmentType:', filters.employmentType);
            query.andWhere('employee.employmentType = :employmentType', { employmentType: filters.employmentType });
        }
        if (filters?.branch) {
            console.log('[EmployeeService] Filtering by branch:', filters.branch);
            query.andWhere('employee.branch = :branch', { branch: filters.branch });
        }
        if (filters?.search) {
            console.log('[EmployeeService] Filtering by search:', filters.search);
            query.andWhere('(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search OR employee.role LIKE :search)', { search: `%${filters.search}%` });
        }
        const sql = query.getSql();
        console.log('[EmployeeService] Generated SQL:', sql);
        const results = await query.getMany();
        console.log('[EmployeeService] Query returned', results.length, 'employees');
        return results;
    }
    async findOne(id) {
        return this.employeeRepository.findOne({
            where: { id },
            relations: ['user', 'company', 'department'],
        });
    }
    async findByUserId(userId) {
        return this.employeeRepository.findOne({
            where: { userId },
            relations: ['user', 'company', 'department'],
        });
    }
    async update(id, updateEmployeeDto) {
        console.log('[EmployeeService] Updating employee:', id, updateEmployeeDto);
        try {
            const employee = await this.findOne(id);
            if (!employee) {
                console.log('[EmployeeService] Employee not found:', id);
                return null;
            }
            if (updateEmployeeDto.firstName || updateEmployeeDto.lastName) {
                const userUpdate = {};
                if (updateEmployeeDto.firstName)
                    userUpdate.firstName = updateEmployeeDto.firstName;
                if (updateEmployeeDto.lastName)
                    userUpdate.lastName = updateEmployeeDto.lastName;
                if (employee.userId) {
                    console.log('[EmployeeService] Updating user:', employee.userId, userUpdate);
                    await this.userService.update(employee.userId, userUpdate);
                }
            }
            const { firstName, lastName, ...employeeUpdate } = updateEmployeeDto;
            console.log('[EmployeeService] Updating employee record:', employeeUpdate);
            await this.employeeRepository.update(id, employeeUpdate);
            return this.findOne(id);
        }
        catch (error) {
            console.error('[EmployeeService] Update failed:', error);
            throw error;
        }
    }
    async remove(id) {
        await this.employeeRepository.delete(id);
    }
    async count(companyId) {
        const query = this.employeeRepository.createQueryBuilder('employee');
        if (companyId) {
            query.where('employee.companyId = :companyId', { companyId });
        }
        return query.getCount();
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map