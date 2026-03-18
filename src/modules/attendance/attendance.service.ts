import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './attendance.entity';
import {
  CheckInDto,
  CheckOutDto,
  CreateAttendanceDto,
} from './dto/attendance.dto';
import { LeavesService } from '../leaves/leaves.service';
import { EmployeeService } from '../employees/employee.service';
import { Employee } from '../employees/employee.entity';

@Injectable()
export class AttendanceService {
  // Office coordinates: 26.8604896, 81.0200511
  private readonly OFFICE_LAT = 26.8604896;
  private readonly OFFICE_LNG = 81.0200511;
  private readonly MAX_DISTANCE_METERS = 10000;

  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private leavesService: LeavesService,
    private employeeService: EmployeeService,
  ) { }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
  }

  private getISTDateString(): string {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  }

  private getISTTimeParts() {
    const istString = new Date().toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
    });
    const [hours, minutes, seconds] = istString.split(':').map(Number);
    return { hours, minutes, seconds, timeString: istString };
  }

  async checkIn(checkInDto: CheckInDto): Promise<Attendance> {
    console.log('[AttendanceService] checkIn initiated for employeeId:', checkInDto.employeeId);
    const today = this.getISTDateString();
    console.log('[AttendanceService] Date:', today);

    // 1. Check for Leave
    try {
      const isOnLeave = await this.leavesService.isEmployeeOnLeave(
        checkInDto.employeeId,
        today,
      );
      console.log('[AttendanceService] isOnLeave:', isOnLeave);
      if (isOnLeave) {
        throw new BadRequestException(
          'Cannot check in: Employee is on approved leave today.',
        );
      }
    } catch (e) {
      console.error('[AttendanceService] Error checking leave status:', e);
      throw e;
    }

    // 2. Geofencing Check
    if (checkInDto.latitude && checkInDto.longitude) {
      const distance = this.calculateDistance(
        checkInDto.latitude,
        checkInDto.longitude,
        this.OFFICE_LAT,
        this.OFFICE_LNG,
      );
      console.log('[AttendanceService] Distance:', distance, 'MAX:', this.MAX_DISTANCE_METERS);
      if (distance > this.MAX_DISTANCE_METERS) {
        throw new ForbiddenException(
          `You are ${Math.round(distance)}m away. You must be within ${this.MAX_DISTANCE_METERS}m of the office to check in.`,
        );
      }
    }

    // 3. Resolve true Employee Record (handling userId vs employeeId)
    let employeeRecord: Employee | null = null;
    try {
      // First try as direct Employee ID
      employeeRecord = await this.employeeService.findOne(checkInDto.employeeId);

      // If not found, it might be a userId (common in mobile app)
      if (!employeeRecord) {
        console.log('[AttendanceService] Resolving employee by userId:', checkInDto.employeeId);
        employeeRecord = await this.employeeService.findByUserId(checkInDto.employeeId);
      }

      if (!employeeRecord) {
        console.error('[AttendanceService] No employee found for ID:', checkInDto.employeeId);
        throw new NotFoundException('Employee not found');
      }

      console.log('[AttendanceService] Resolved Employee PK:', employeeRecord.id);

      // Update DTO with the TRUE PK for database integrity
      checkInDto.employeeId = employeeRecord.id;

      if (employeeRecord.company && employeeRecord.company.openingTime) {
        console.log('[AttendanceService] Opening Time:', employeeRecord.company.openingTime);
        const ist = this.getISTTimeParts();
        const [openHour, openMinute] = employeeRecord.company.openingTime
          .split(':')
          .map(Number);

        // Allow check-in 1 hour before opening time
        const earliestHour = openHour - 1;

        if (ist.hours < earliestHour) {
          const earliestStr = `${earliestHour.toString().padStart(2, '0')}:${openMinute.toString().padStart(2, '0')}`;
          throw new ForbiddenException(
            `Cannot check in before ${earliestStr} AM.`,
          );
        }
      }
    } catch (e) {
      console.error('[AttendanceService] Error during employee resolution:', e);
      throw e;
    }

    // Check if already checked in today
    try {
      const existing = await this.attendanceRepository.findOne({
        where: {
          employeeId: checkInDto.employeeId,
          date: today as any,
        },
      });
      console.log('[AttendanceService] Existing attendance:', !!existing);

      if (existing) {
        throw new BadRequestException('Already checked in today');
      }
    } catch (e) {
      console.error('[AttendanceService] Error checking existing attendance:', e);
      throw e;
    }

    const ist = this.getISTTimeParts();
    const checkInTime = ist.timeString;

    // Determine status
    let status = 'present';
    // ... existing logic ...
    try {
      const employee = await this.employeeService.findOne(checkInDto.employeeId);
      if (employee && employee.company && employee.company.openingTime) {
        const [openHour, openMinute] = employee.company.openingTime
          .split(':')
          .map(Number);
        // Late if more than 15 mins after opening time
        if (
          ist.hours > openHour ||
          (ist.hours === openHour && ist.minutes > openMinute + 15)
        ) {
          
        }
      } else {
        // Default logic if no company time set
        const startHour = 9;
        const startMinute = 0;
        if (
          ist.hours > startHour ||
          (ist.hours === startHour && ist.minutes > startMinute + 15)
        ) {
          
        }
      }
    } catch (e) {
      console.error('[AttendanceService] Error determining status:', e);
      // Fallback to present
    }

    console.log('[AttendanceService] Status:', status);

    const attendance = this.attendanceRepository.create({
      employeeId: checkInDto.employeeId,
      date: today as any,
      checkInTime,
      status,
      location: checkInDto.location,
      notes: checkInDto.notes,
    });

    console.log('[AttendanceService] Saving attendance record...');
    try {
      const saved = await this.attendanceRepository.save(attendance);
      console.log('[AttendanceService] Success! ID:', saved.id);
      return saved;
    } catch (e) {
      console.error('[AttendanceService] Database save error:', e);
      throw e;
    }
  }

  async bulkCheckIn(employeeIds: string[], notes?: string): Promise<any> {
    const results: {
      success: string[];
      failed: { employeeId: string; error: any }[];
    } = {
      success: [],
      failed: [],
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
        this.OFFICE_LNG,
      );
      if (distance > this.MAX_DISTANCE_METERS) {
        throw new ForbiddenException(
          `You are ${Math.round(distance)}m away. You must be within ${this.MAX_DISTANCE_METERS}m of the office to check out.`,
        );
      }
    }

    const ist = this.getISTTimeParts();
    const checkOutTime = ist.timeString;

    // Calculate work hours
    if (attendance.checkInTime) {
      const checkIn = new Date(`2000-01-01 ${attendance.checkInTime}`);
      const checkOut = new Date(`2000-01-01 ${checkOutTime}`);
      const workHours =
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
      attendance.workHours = Math.round(workHours * 100) / 100;

      // Overtime logic
      if (attendance.workHours > 8) {
        attendance.overtime =
          Math.round((attendance.workHours - 8) * 100) / 100;
      }
    }

    attendance.checkOutTime = checkOutTime;

    // Early departure logic
    const endHour = 17;
    if (ist.hours < endHour) {
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
      const workHours =
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
      attendance.workHours = Math.round(workHours * 100) / 100;
    }

    return this.attendanceRepository.save(attendance);
  }

  async findAll(filters?: any): Promise<Attendance[]> {
    const query = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.employee', 'employee')
      .leftJoinAndSelect('employee.user', 'user')
      .leftJoinAndSelect('employee.company', 'company');

    if (filters?.companyId) {
      query.andWhere('employee.companyId = :companyId', {
        companyId: filters.companyId,
      });
    }

    if (filters?.employeeId) {
      let targetEmployeeId = filters.employeeId;
      const employee = await this.employeeService.findByUserId(targetEmployeeId);
      if (employee) {
        targetEmployeeId = employee.id;
      }
      query.andWhere('attendance.employeeId = :employeeId', {
        employeeId: targetEmployeeId,
      });
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
    const today = this.getISTDateString();

    // First attempt with what we got
    let attendance = await this.attendanceRepository.findOne({
      where: {
        employeeId,
        date: today as any,
      },
    });

    // If not found, check if employeeId is actually a userId
    if (!attendance) {
      const employee = await this.employeeService.findByUserId(employeeId);
      if (employee) {
        attendance = await this.attendanceRepository.findOne({
          where: {
            employeeId: employee.id,
            date: today as any,
          },
        });
      }
    }

    return attendance;
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
      // Robust resolution for userId vs employeeId in filters
      let targetEmployeeId = filters.employeeId;
      const employee = await this.employeeService.findByUserId(targetEmployeeId);
      if (employee) {
        targetEmployeeId = employee.id;
      }

      query.andWhere('attendance.employeeId = :employeeId', {
        employeeId: targetEmployeeId,
      });
    }

    const total = await query.getCount();
    const present = await query
      .clone()
      .andWhere('attendance.status = :status', { status: 'present' })
      .getCount();
    const absent = await query
      .clone()
      .andWhere('attendance.status = :status', { status: 'absent' })
      .getCount();
    const late = await query
      .clone()
      .andWhere('attendance.status = :status', { status: 'late' })
      .getCount();

    const avgWorkHours = await query
      .select('AVG(attendance.workHours)', 'avg')
      .getRawOne();

    const isPostgres =
      this.attendanceRepository.manager.connection.options.type === 'postgres';

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

    const distributionSql = `
            SELECT status as name, COUNT(*) as value
            FROM attendance
            WHERE date = $1
            GROUP BY status
        `.replace('$1', isPostgres ? '$1' : '?');

    const distribution = await this.attendanceRepository.query(
      distributionSql,
      [this.getISTDateString()],
    );

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
    const punctualityTrend =
      await this.attendanceRepository.query(punctualityTrendSql);

    return {
      total,
      present,
      absent,
      late,
      averageWorkHours: avgWorkHours?.avg || 0,
      weeklyTrend,
      distribution,
      punctualityTrend,
    };
  }
}
