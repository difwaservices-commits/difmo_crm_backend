import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AbilitiesGuard } from '../access-control/abilities.guard';
import { CheckAbilities } from '../access-control/abilities.decorator';
import { Action } from '../access-control/ability.factory';

@Controller('finance')
@UseGuards(JwtAuthGuard, AbilitiesGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('payroll')
  @CheckAbilities({ action: Action.Create, subject: 'payroll' })
  createPayroll(@Body() data: any) {
    return this.financeService.createPayroll(data);
  }

  @Get('payroll')
  @CheckAbilities({ action: Action.Read, subject: 'payroll' })
  findAllPayroll(
    @Query('companyId') companyId: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.financeService.findAllPayroll(companyId, month, year);
  }

  @Post('expenses')
  @CheckAbilities({ action: Action.Create, subject: 'expense' })
  createExpense(@Body() data: any) {
    return this.financeService.createExpense(data);
  }

  @Get('expenses')
  @CheckAbilities({ action: Action.Read, subject: 'expense' })
  findAllExpenses(@Query('companyId') companyId: string) {
    return this.financeService.findAllExpenses(companyId);
  }

  @Get('summary')
  @CheckAbilities({ action: Action.Read, subject: 'finance_summary' })
  getSummary(@Query('companyId') companyId: string) {
    return this.financeService.getFinancialSummary(companyId);
  }
}
