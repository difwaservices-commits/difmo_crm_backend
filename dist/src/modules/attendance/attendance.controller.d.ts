import { AttendanceService } from './attendance.service';
import { CheckInDto, CheckOutDto, CreateAttendanceDto, BulkCheckInDto } from './dto/attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    checkIn(checkInDto: CheckInDto): Promise<{
        data: import("./attendance.entity").Attendance;
        statusCode: number;
        message: string;
    }>;
    bulkCheckIn(bulkCheckInDto: BulkCheckInDto): Promise<{
        data: any;
        statusCode: number;
        message: string;
    }>;
    checkOut(checkOutDto: CheckOutDto): Promise<{
        data: import("./attendance.entity").Attendance;
        statusCode: number;
        message: string;
    }>;
    create(createAttendanceDto: CreateAttendanceDto): Promise<{
        data: import("./attendance.entity").Attendance;
        statusCode: number;
        message: string;
    }>;
    findAll(query: any): Promise<{
        data: import("./attendance.entity").Attendance[];
        statusCode: number;
        message: string;
    }>;
    getTodayAttendance(employeeId: string): Promise<{
        data: import("./attendance.entity").Attendance | null;
        statusCode: number;
        message: string;
    }>;
    getAnalytics(query: any): Promise<{
        data: any;
        statusCode: number;
        message: string;
    }>;
    findOne(id: string): Promise<{
        data: import("./attendance.entity").Attendance | null;
        statusCode: number;
        message: string;
    }>;
}
