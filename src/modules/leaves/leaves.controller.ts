import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveDto, UpdateLeaveStatusDto } from './dto/create-leave.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('leaves')
@UseGuards(JwtAuthGuard)
export class LeavesController {
    constructor(private readonly leavesService: LeavesService) { }

    @Post()
    create(@Body() createLeaveDto: CreateLeaveDto) {
        return this.leavesService.create(createLeaveDto);
    }

    @Get()
    findAll(@Query() query: any) {
        return this.leavesService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.leavesService.findOne(id);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body() updateLeaveStatusDto: UpdateLeaveStatusDto) {
        return this.leavesService.updateStatus(id, updateLeaveStatusDto);
    }
}
