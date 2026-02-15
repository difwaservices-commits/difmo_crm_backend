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
        return this.attendanceService.checkIn(checkInDto);
    }

    @Post('bulk-check-in')
    async bulkCheckIn(@Body() bulkCheckInDto: BulkCheckInDto) {
        return this.attendanceService.bulkCheckIn(bulkCheckInDto.employeeIds, bulkCheckInDto.notes);
    }

    @Post('check-out')
    async checkOut(@Body() checkOutDto: CheckOutDto) {
        return this.attendanceService.checkOut(checkOutDto);
    }

    @Post()
    async create(@Body() createAttendanceDto: CreateAttendanceDto) {
        return this.attendanceService.create(createAttendanceDto);
    }

    @Get()
    async findAll(@Query() query: any) {
        return this.attendanceService.findAll(query);
    }

    @Get('today/:employeeId')
    async getTodayAttendance(@Param('employeeId') employeeId: string) {
        return this.attendanceService.getTodayAttendance(employeeId);
    }

    @Get('analytics')
    async getAnalytics(@Query() query: any) {
        return this.attendanceService.getAnalytics(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.attendanceService.findOne(id);
    }
}
