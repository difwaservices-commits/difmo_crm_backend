export declare class CheckInDto {
    employeeId: string;
    location?: string;
    notes?: string;
}
export declare class CheckOutDto {
    attendanceId: string;
    notes?: string;
}
export declare class CreateAttendanceDto {
    employeeId: string;
    date: string;
    checkInTime?: string;
    checkOutTime?: string;
    status?: string;
    workHours?: number;
    notes?: string;
    location?: string;
}
