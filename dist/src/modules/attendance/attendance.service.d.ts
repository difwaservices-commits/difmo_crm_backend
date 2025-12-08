import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { CheckInDto, CheckOutDto, CreateAttendanceDto } from './dto/attendance.dto';
export declare class AttendanceService {
    private attendanceRepository;
    constructor(attendanceRepository: Repository<Attendance>);
    checkIn(checkInDto: CheckInDto): Promise<Attendance>;
    checkOut(checkOutDto: CheckOutDto): Promise<Attendance>;
    create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance>;
    findAll(filters?: any): Promise<Attendance[]>;
    findOne(id: string): Promise<Attendance | null>;
    getTodayAttendance(employeeId: string): Promise<Attendance | null>;
    getAnalytics(filters?: any): Promise<any>;
}
