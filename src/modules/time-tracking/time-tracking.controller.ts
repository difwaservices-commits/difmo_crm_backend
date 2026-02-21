import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TimeTrackingService } from './time-tracking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AbilitiesGuard } from '../access-control/abilities.guard';
import { CheckAbilities } from '../access-control/abilities.decorator';
import { Action } from '../access-control/ability.factory';

@Controller('time-tracking')
@UseGuards(JwtAuthGuard, AbilitiesGuard)
export class TimeTrackingController {
  constructor(private readonly timeTrackingService: TimeTrackingService) {}

  @Post('start')
  @CheckAbilities({ action: Action.Create, subject: 'time_entry' })
  start(@Body() data: any) {
    return this.timeTrackingService.startTimer(data);
  }

  @Put('stop/:id')
  @CheckAbilities({ action: Action.Update, subject: 'time_entry' })
  stop(@Param('id') id: string, @Body('description') description: string) {
    return this.timeTrackingService.stopTimer(id, description);
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: 'time_entry' })
  findAll(@Query('employeeId') employeeId: string) {
    return this.timeTrackingService.findAll(employeeId);
  }
}
