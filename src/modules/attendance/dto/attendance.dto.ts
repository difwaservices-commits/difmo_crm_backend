import { IsString, IsOptional, IsDateString, IsNumber, IsArray } from 'class-validator';

export class CheckInDto {
    @IsString()
    employeeId: string;

    @IsString()
    @IsOptional()
    location?: string;

    @IsNumber()
    @IsOptional()
    latitude?: number;

    @IsNumber()
    @IsOptional()
    longitude?: number;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class CheckOutDto {
    @IsString()
    attendanceId: string;

    @IsNumber()
    @IsOptional()
    latitude?: number;

    @IsNumber()
    @IsOptional()
    longitude?: number;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class CreateAttendanceDto {
    @IsString()
    employeeId: string;

    @IsDateString()
    date: string;

    @IsString()
    @IsOptional()
    checkInTime?: string;

    @IsString()
    @IsOptional()
    checkOutTime?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsNumber()
    @IsOptional()
    workHours?: number;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsOptional()
    location?: string;
}

export class BulkCheckInDto {
    @IsArray()
    @IsString({ each: true })
    employeeIds: string[];

    @IsString()
    @IsOptional()
    notes?: string;
}
