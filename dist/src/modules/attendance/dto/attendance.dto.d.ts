export declare class CheckInDto {
    employeeId: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
}
export declare class CheckOutDto {
    attendanceId: string;
    latitude?: number;
    longitude?: number;
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
export declare class BulkCheckInDto {
    employeeIds: string[];
    notes?: string;
}
