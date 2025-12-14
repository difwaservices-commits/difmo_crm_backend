import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { CheckInDto, CheckOutDto, CreateAttendanceDto } from './dto/attendance.dto';
import { LeavesService } from '../leaves/leaves.service';
import { EmployeeService } from '../employees/employee.service';
export declare class AttendanceService {
    private attendanceRepository;
    private leavesService;
    private employeeService;
    private readonly OFFICE_LAT;
    private readonly OFFICE_LNG;
    private readonly MAX_DISTANCE_METERS;
    constructor(attendanceRepository: Repository<Attendance>, leavesService: LeavesService, employeeService: EmployeeService);
    private calculateDistance;
    checkIn(checkInDto: CheckInDto): Promise<Attendance>;
    bulkCheckIn(employeeIds: string[], notes?: string): Promise<any>;
    checkOut(checkOutDto: CheckOutDto): Promise<Attendance>;
    create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance>;
    findAll(filters?: any): Promise<Attendance[]>;
    findOne(id: string): Promise<Attendance | null>;
    getTodayAttendance(employeeId: string): Promise<Attendance | null>;
    getAnalytics(filters?: any): Promise<any>;
}
