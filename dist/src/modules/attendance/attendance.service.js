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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_entity_1 = require("./attendance.entity");
const leaves_service_1 = require("../leaves/leaves.service");
const employee_service_1 = require("../employees/employee.service");
let AttendanceService = class AttendanceService {
    attendanceRepository;
    leavesService;
    employeeService;
    OFFICE_LAT = 26.8604896;
    OFFICE_LNG = 81.0200511;
    MAX_DISTANCE_METERS = 100;
    constructor(attendanceRepository, leavesService, employeeService) {
        this.attendanceRepository = attendanceRepository;
        this.leavesService = leavesService;
        this.employeeService = employeeService;
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    async checkIn(checkInDto) {
        const today = new Date().toISOString().split('T')[0];
        const isOnLeave = await this.leavesService.isEmployeeOnLeave(checkInDto.employeeId, today);
        if (isOnLeave) {
            throw new common_1.BadRequestException('Cannot check in: Employee is on approved leave today.');
        }
        if (checkInDto.latitude && checkInDto.longitude) {
            const distance = this.calculateDistance(checkInDto.latitude, checkInDto.longitude, this.OFFICE_LAT, this.OFFICE_LNG);
            if (distance > this.MAX_DISTANCE_METERS) {
                throw new common_1.ForbiddenException(`You are ${Math.round(distance)}m away. You must be within ${this.MAX_DISTANCE_METERS}m of the office to check in.`);
            }
        }
        const employee = await this.employeeService.findOne(checkInDto.employeeId);
        if (employee && employee.company && employee.company.openingTime) {
            const now = new Date();
            const [openHour, openMinute] = employee.company.openingTime.split(':').map(Number);
            const openTime = new Date(now);
            openTime.setHours(openHour, openMinute, 0, 0);
            const earliestCheckIn = new Date(openTime);
            earliestCheckIn.setHours(openHour - 1);
            if (now < earliestCheckIn) {
                throw new common_1.ForbiddenException(`Cannot check in before ${earliestCheckIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`);
            }
        }
        const existing = await this.attendanceRepository.findOne({
            where: {
                employeeId: checkInDto.employeeId,
                date: today,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Already checked in today');
        }
        const now = new Date();
        const checkInTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        let status = 'present';
        if (employee && employee.company && employee.company.openingTime) {
            const [openHour, openMinute] = employee.company.openingTime.split(':').map(Number);
            if (now.getHours() > openHour || (now.getHours() === openHour && now.getMinutes() > openMinute + 15)) {
                status = 'late';
            }
        }
        else {
            const startHour = 9;
            const startMinute = 0;
            if (now.getHours() > startHour || (now.getHours() === startHour && now.getMinutes() > startMinute + 15)) {
                status = 'late';
            }
        }
        const attendance = this.attendanceRepository.create({
            employeeId: checkInDto.employeeId,
            date: today,
            checkInTime,
            status,
            location: checkInDto.location,
            notes: checkInDto.notes,
        });
        return this.attendanceRepository.save(attendance);
    }
    async bulkCheckIn(employeeIds, notes) {
        const results = {
            success: [],
            failed: []
        };
        for (const employeeId of employeeIds) {
            try {
                await this.checkIn({ employeeId, notes, location: 'Bulk Check-in' });
                results.success.push(employeeId);
            }
            catch (error) {
                results.failed.push({ employeeId, error: error.message });
            }
        }
        return results;
    }
    async checkOut(checkOutDto) {
        const attendance = await this.attendanceRepository.findOne({
            where: { id: checkOutDto.attendanceId },
        });
        if (!attendance) {
            throw new common_1.NotFoundException('Attendance record not found');
        }
        if (attendance.checkOutTime) {
            throw new common_1.BadRequestException('Already checked out');
        }
        if (checkOutDto.latitude && checkOutDto.longitude) {
            const distance = this.calculateDistance(checkOutDto.latitude, checkOutDto.longitude, this.OFFICE_LAT, this.OFFICE_LNG);
            if (distance > this.MAX_DISTANCE_METERS) {
                throw new common_1.ForbiddenException(`You are ${Math.round(distance)}m away. You must be within ${this.MAX_DISTANCE_METERS}m of the office to check out.`);
            }
        }
        const now = new Date();
        const checkOutTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        if (attendance.checkInTime) {
            const checkIn = new Date(`2000-01-01 ${attendance.checkInTime}`);
            const checkOut = new Date(`2000-01-01 ${checkOutTime}`);
            const workHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
            attendance.workHours = Math.round(workHours * 100) / 100;
            if (attendance.workHours > 8) {
                attendance.overtime = Math.round((attendance.workHours - 8) * 100) / 100;
            }
        }
        attendance.checkOutTime = checkOutTime;
        const endHour = 17;
        if (now.getHours() < endHour) {
            if (attendance.status === 'present') {
                attendance.status = 'early_departure';
            }
        }
        if (checkOutDto.notes) {
            attendance.notes = checkOutDto.notes;
        }
        return this.attendanceRepository.save(attendance);
    }
    async create(createAttendanceDto) {
        const attendance = this.attendanceRepository.create(createAttendanceDto);
        if (attendance.checkInTime && attendance.checkOutTime) {
            const checkIn = new Date(`2000-01-01 ${attendance.checkInTime}`);
            const checkOut = new Date(`2000-01-01 ${attendance.checkOutTime}`);
            const workHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
            attendance.workHours = Math.round(workHours * 100) / 100;
        }
        return this.attendanceRepository.save(attendance);
    }
    async findAll(filters) {
        const query = this.attendanceRepository.createQueryBuilder('attendance')
            .leftJoinAndSelect('attendance.employee', 'employee')
            .leftJoinAndSelect('employee.user', 'user')
            .leftJoinAndSelect('employee.company', 'company');
        if (filters?.companyId) {
            query.andWhere('employee.companyId = :companyId', { companyId: filters.companyId });
        }
        if (filters?.employeeId) {
            query.andWhere('attendance.employeeId = :employeeId', { employeeId: filters.employeeId });
        }
        if (filters?.startDate && filters?.endDate) {
            query.andWhere('attendance.date BETWEEN :startDate AND :endDate', {
                startDate: filters.startDate,
                endDate: filters.endDate,
            });
        }
        if (filters?.status) {
            query.andWhere('attendance.status = :status', { status: filters.status });
        }
        query.orderBy('attendance.date', 'DESC');
        return query.getMany();
    }
    async findOne(id) {
        return this.attendanceRepository.findOne({
            where: { id },
            relations: ['employee', 'employee.user'],
        });
    }
    async getTodayAttendance(employeeId) {
        const today = new Date().toISOString().split('T')[0];
        return this.attendanceRepository.findOne({
            where: {
                employeeId,
                date: new Date(today),
            },
        });
    }
    async getAnalytics(filters) {
        const query = this.attendanceRepository.createQueryBuilder('attendance');
        if (filters?.startDate && filters?.endDate) {
            query.where('attendance.date BETWEEN :startDate AND :endDate', {
                startDate: filters.startDate,
                endDate: filters.endDate,
            });
        }
        if (filters?.employeeId) {
            query.andWhere('attendance.employeeId = :employeeId', { employeeId: filters.employeeId });
        }
        const total = await query.getCount();
        const present = await query.clone().andWhere('attendance.status = :status', { status: 'present' }).getCount();
        const absent = await query.clone().andWhere('attendance.status = :status', { status: 'absent' }).getCount();
        const late = await query.clone().andWhere('attendance.status = :status', { status: 'late' }).getCount();
        const avgWorkHours = await query
            .select('AVG(attendance.workHours)', 'avg')
            .getRawOne();
        const isPostgres = this.attendanceRepository.manager.connection.options.type === 'postgres';
        let weeklyTrendSql = '';
        if (isPostgres) {
            weeklyTrendSql = `
                SELECT 
                    EXTRACT(DOW FROM date) as "dayIndex",
                    TO_CHAR(date, 'Dy') as day,
                    COUNT(CASE WHEN status = 'present' THEN 1 END) as present,
                    COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent,
                    COUNT(CASE WHEN status = 'late' THEN 1 END) as late
                FROM attendance
                WHERE date >= CURRENT_DATE - INTERVAL '7 days'
                GROUP BY "dayIndex", day
                ORDER BY "dayIndex"
            `;
        }
        else {
            weeklyTrendSql = `
                SELECT 
                    strftime('%w', date) as dayIndex,
                    CASE strftime('%w', date)
                        WHEN '0' THEN 'Sun'
                        WHEN '1' THEN 'Mon'
                        WHEN '2' THEN 'Tue'
                        WHEN '3' THEN 'Wed'
                        WHEN '4' THEN 'Thu'
                        WHEN '5' THEN 'Fri'
                        WHEN '6' THEN 'Sat'
                    END as day,
                    COUNT(CASE WHEN status = 'present' THEN 1 END) as present,
                    COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent,
                    COUNT(CASE WHEN status = 'late' THEN 1 END) as late
                FROM attendance
                WHERE date >= date('now', '-7 days')
                GROUP BY dayIndex
                ORDER BY dayIndex
            `;
        }
        const weeklyTrend = await this.attendanceRepository.query(weeklyTrendSql);
        const today = new Date().toISOString().split('T')[0];
        const distributionSql = `
            SELECT status as name, COUNT(*) as value
            FROM attendance
            WHERE date = $1
            GROUP BY status
        `.replace('$1', isPostgres ? '$1' : '?');
        const distribution = await this.attendanceRepository.query(distributionSql, [today]);
        let punctualityTrendSql = '';
        if (isPostgres) {
            punctualityTrendSql = `
                SELECT 
                    TO_CHAR(date, 'YYYY-MM') as "monthKey",
                    TO_CHAR(date, 'Mon') as month,
                    COUNT(CASE WHEN status = 'present' THEN 1 END) as "onTime",
                    COUNT(CASE WHEN status = 'late' THEN 1 END) as late,
                    COUNT(CASE WHEN status = 'early_departure' THEN 1 END) as "earlyOut"
                FROM attendance
                WHERE date >= CURRENT_DATE - INTERVAL '6 months'
                GROUP BY "monthKey", month
                ORDER BY "monthKey"
            `;
        }
        else {
            punctualityTrendSql = `
                SELECT 
                    strftime('%Y-%m', date) as monthKey,
                    CASE strftime('%m', date)
                        WHEN '01' THEN 'Jan'
                        WHEN '02' THEN 'Feb'
                        WHEN '03' THEN 'Mar'
                        WHEN '04' THEN 'Apr'
                        WHEN '05' THEN 'May'
                        WHEN '06' THEN 'Jun'
                        WHEN '07' THEN 'Jul'
                        WHEN '08' THEN 'Aug'
                        WHEN '09' THEN 'Sep'
                        WHEN '10' THEN 'Oct'
                        WHEN '11' THEN 'Nov'
                        WHEN '12' THEN 'Dec'
                    END as month,
                    COUNT(CASE WHEN status = 'present' THEN 1 END) as onTime,
                    COUNT(CASE WHEN status = 'late' THEN 1 END) as late,
                    COUNT(CASE WHEN status = 'early_departure' THEN 1 END) as earlyOut
                FROM attendance
                WHERE date >= date('now', '-6 months')
                GROUP BY monthKey
                ORDER BY monthKey
            `;
        }
        const punctualityTrend = await this.attendanceRepository.query(punctualityTrendSql);
        return {
            total,
            present,
            absent,
            late,
            averageWorkHours: avgWorkHours?.avg || 0,
            weeklyTrend,
            distribution,
            punctualityTrend
        };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        leaves_service_1.LeavesService,
        employee_service_1.EmployeeService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map