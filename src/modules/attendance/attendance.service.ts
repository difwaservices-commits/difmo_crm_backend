import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './attendance.entity';
import { CheckInDto, CheckOutDto, CreateAttendanceDto } from './dto/attendance.dto';
import { LeavesService } from '../leaves/leaves.service';
import { EmployeeService } from '../employees/employee.service';

@Injectable()
export class AttendanceService {
    // Office coordinates: 26.8604896, 81.0200511
    private readonly OFFICE_LAT = 26.8604896;
    private readonly OFFICE_LNG = 81.0200511;
    private readonly MAX_DISTANCE_METERS = 100;

    constructor(
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
        private leavesService: LeavesService,
        private employeeService: EmployeeService,
    ) { }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // in metres
    }

    async checkIn(checkInDto: CheckInDto): Promise<Attendance> {
        const today = new Date().toISOString().split('T')[0];

        // 1. Check for Leave
        const isOnLeave = await this.leavesService.isEmployeeOnLeave(checkInDto.employeeId, today);
        if (isOnLeave) {
            throw new BadRequestException('Cannot check in: Employee is on approved leave today.');
        }

        // 2. Geofencing Check
        if (checkInDto.latitude && checkInDto.longitude) {
            const distance = this.calculateDistance(
                checkInDto.latitude,
                checkInDto.longitude,
                this.OFFICE_LAT,
                this.OFFICE_LNG
            );
            if (distance > this.MAX_DISTANCE_METERS) {
                throw new ForbiddenException(`You are ${Math.round(distance)}m away. You must be within ${this.MAX_DISTANCE_METERS}m of the office to check in.`);
            }
        }

        // 3. Time Constraints based on Company Settings
        const employee = await this.employeeService.findOne(checkInDto.employeeId);
        if (employee && employee.company && employee.company.openingTime) {
            const now = new Date();
            const [openHour, openMinute] = employee.company.openingTime.split(':').map(Number);
            const openTime = new Date(now);
            openTime.setHours(openHour, openMinute, 0, 0);

            // Allow check-in 1 hour before opening time
            const earliestCheckIn = new Date(openTime);
            earliestCheckIn.setHours(openHour - 1);

            if (now < earliestCheckIn) {
                throw new ForbiddenException(`Cannot check in before ${earliestCheckIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`);
            }
        }

        // Check if already checked in today
        const existing = await this.attendanceRepository.findOne({
            where: {
                employeeId: checkInDto.employeeId,
                date: today as any,
            },
        });

        if (existing) {
            throw new BadRequestException('Already checked in today');
        }

        const now = new Date();
        const checkInTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        // Determine status
        let status = 'present';
        if (employee && employee.company && employee.company.openingTime) {
            const [openHour, openMinute] = employee.company.openingTime.split(':').map(Number);
            // Late if more than 15 mins after opening time
            if (now.getHours() > openHour || (now.getHours() === openHour && now.getMinutes() > openMinute + 15)) {
                status = 'late';
            }
        } else {
            // Default logic if no company time set
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

    async bulkCheckIn(employeeIds: string[], notes?: string): Promise<any> {
        const results: { success: string[], failed: { employeeId: string, error: any }[] } = {
            success: [],
            failed: []
        };

        for (const employeeId of employeeIds) {
            try {
                await this.checkIn({ employeeId, notes, location: 'Bulk Check-in' });
                results.success.push(employeeId);
            } catch (error) {
                results.failed.push({ employeeId, error: error.message });
            }
        }

        return results;
    }

    async checkOut(checkOutDto: CheckOutDto): Promise<Attendance> {
        const attendance = await this.attendanceRepository.findOne({
            where: { id: checkOutDto.attendanceId },
        });

        if (!attendance) {
            throw new NotFoundException('Attendance record not found');
        }

        if (attendance.checkOutTime) {
            throw new BadRequestException('Already checked out');
        }

        // Geofencing Check for Checkout
        if (checkOutDto.latitude && checkOutDto.longitude) {
            const distance = this.calculateDistance(
                checkOutDto.latitude,
                checkOutDto.longitude,
                this.OFFICE_LAT,
                this.OFFICE_LNG
            );
            if (distance > this.MAX_DISTANCE_METERS) {
                throw new ForbiddenException(`You are ${Math.round(distance)}m away. You must be within ${this.MAX_DISTANCE_METERS}m of the office to check out.`);
            }
        }

        const now = new Date();
        const checkOutTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        // Calculate work hours
        if (attendance.checkInTime) {
            const checkIn = new Date(`2000-01-01 ${attendance.checkInTime}`);
            const checkOut = new Date(`2000-01-01 ${checkOutTime}`);
            const workHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
            attendance.workHours = Math.round(workHours * 100) / 100;

            // Overtime logic
            if (attendance.workHours > 8) {
                attendance.overtime = Math.round((attendance.workHours - 8) * 100) / 100;
            }
        }

        attendance.checkOutTime = checkOutTime;

        // Early departure logic
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

    async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
        const attendance = this.attendanceRepository.create(createAttendanceDto);

        if (attendance.checkInTime && attendance.checkOutTime) {
            const checkIn = new Date(`2000-01-01 ${attendance.checkInTime}`);
            const checkOut = new Date(`2000-01-01 ${attendance.checkOutTime}`);
            const workHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
            attendance.workHours = Math.round(workHours * 100) / 100;
        }

        return this.attendanceRepository.save(attendance);
    }

    async findAll(filters?: any): Promise<Attendance[]> {
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

    async findOne(id: string): Promise<Attendance | null> {
        return this.attendanceRepository.findOne({
            where: { id },
            relations: ['employee', 'employee.user'],
        });
    }

    async getTodayAttendance(employeeId: string): Promise<Attendance | null> {
        const today = new Date().toISOString().split('T')[0];
        return this.attendanceRepository.findOne({
            where: {
                employeeId,
                date: new Date(today) as any,
            },
        });
    }

    async getAnalytics(filters?: any): Promise<any> {
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

        // 1. Weekly Attendance Trend (Last 7 Days)
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
        } else {
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

        // 2. Attendance Distribution (Today)
        const today = new Date().toISOString().split('T')[0];
        // Parameter placeholder syntax differs: $1 for Postgres, ? for SQLite
        // However, TypeORM query() usually handles ? for both if not using native driver directly, 
        // but for safety with Postgres we can use simple string interpolation or $1 if we are sure.
        // Let's use standard TypeORM parameter handling which maps parameters.
        const distributionSql = `
            SELECT status as name, COUNT(*) as value
            FROM attendance
            WHERE date = $1
            GROUP BY status
        `.replace('$1', isPostgres ? '$1' : '?');

        const distribution = await this.attendanceRepository.query(distributionSql, [today]);

        // 3. 6-Month Punctuality Trend
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
        } else {
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
}
