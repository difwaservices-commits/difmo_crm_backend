import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CheckInDto, CheckOutDto, CreateAttendanceDto, BulkCheckInDto } from './dto/attendance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('check-in')
    async checkIn(@Body() checkInDto: CheckInDto) {
        const attendance = await this.attendanceService.checkIn(checkInDto);
        return {
            data: attendance,
            statusCode: 201,
            message: 'Checked in successfully'
        };
    }

    @Post('bulk-check-in')
    async bulkCheckIn(@Body() bulkCheckInDto: BulkCheckInDto) {
        const results = await this.attendanceService.bulkCheckIn(bulkCheckInDto.employeeIds, bulkCheckInDto.notes);
        return {
            data: results,
            statusCode: 200,
            message: 'Bulk check-in processed'
        };
    }

    @Post('check-out')
    async checkOut(@Body() checkOutDto: CheckOutDto) {
        const attendance = await this.attendanceService.checkOut(checkOutDto);
        return {
            data: attendance,
            statusCode: 200,
            message: 'Checked out successfully'
        };
    }

    @Post()
    async create(@Body() createAttendanceDto: CreateAttendanceDto) {
        const attendance = await this.attendanceService.create(createAttendanceDto);
        return {
            data: attendance,
            statusCode: 201,
            message: 'Attendance record created successfully'
        };
    }

    @Get()
    async findAll(@Query() query: any) {
        const attendance = await this.attendanceService.findAll(query);
        return {
            data: attendance,
            statusCode: 200,
            message: 'Success'
        };
    }

    @Get('today/:employeeId')
    async getTodayAttendance(@Param('employeeId') employeeId: string) {
        const attendance = await this.attendanceService.getTodayAttendance(employeeId);
        return {
            data: attendance,
            statusCode: 200,
            message: 'Success'
        };
    }

    @Get('analytics')
    async getAnalytics(@Query() query: any) {
        const analytics = await this.attendanceService.getAnalytics(query);
        return {
            data: analytics,
            statusCode: 200,
            message: 'Success'
        };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const attendance = await this.attendanceService.findOne(id);
        return {
            data: attendance,
            statusCode: 200,
            message: 'Success'
        };
    }
}
