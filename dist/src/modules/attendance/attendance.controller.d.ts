import { AttendanceService } from './attendance.service';
import { CheckInDto, CheckOutDto, CreateAttendanceDto, BulkCheckInDto } from './dto/attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    checkIn(checkInDto: CheckInDto): Promise<import("./attendance.entity").Attendance>;
    bulkCheckIn(bulkCheckInDto: BulkCheckInDto): Promise<any>;
    checkOut(checkOutDto: CheckOutDto): Promise<import("./attendance.entity").Attendance>;
    create(createAttendanceDto: CreateAttendanceDto): Promise<import("./attendance.entity").Attendance>;
    findAll(query: any): Promise<import("./attendance.entity").Attendance[]>;
    getTodayAttendance(employeeId: string): Promise<import("./attendance.entity").Attendance | null>;
    getAnalytics(query: any): Promise<any>;
    findOne(id: string): Promise<import("./attendance.entity").Attendance | null>;
}
