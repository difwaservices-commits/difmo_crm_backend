import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AbilitiesGuard } from '../access-control/abilities.guard';
import { CheckAbilities } from '../access-control/abilities.decorator';
import { Action } from '../access-control/ability.factory';
import type { Response } from 'express';
import { Attendance } from '../attendance/attendance.entity';

@Controller('finance')
@UseGuards(JwtAuthGuard, AbilitiesGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) { }

  @Post('payroll')
  @CheckAbilities({ action: Action.Create, subject: 'payroll' })

  createPayroll(@Body() data: any) {

    console.log("🔥 BODY:", data);
    return this.financeService.createPayroll(data);
  }


  @Post('payroll/pay')
  markAsPaid(@Body() body: { payrollId: string }) {
    return this.financeService.markPayrollPaid(body.payrollId);
  }

  @Get('payroll')
  @CheckAbilities({ action: Action.Read, subject: 'payroll' })
  findAllPayroll(
    @Query('attendanceId') AttendanceId: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    ``
    console.log(" USER:", AttendanceId);
    console.log(" BODY:", month);
    return this.financeService.findAllPayroll(AttendanceId, month, year);
  }

  @Post('expenses')
  @CheckAbilities({ action: Action.Create, subject: 'expense' })
  createExpense(@Request() req, @Body() data: any) {
    return this.financeService.createExpense(data, req.user.id);
  }

  @Get('expenses')
  @CheckAbilities({ action: Action.Read, subject: 'expense' })
  findAllExpenses(
    @Query('companyId') companyId: string,
    @Query('currency') currency?: string,
  ) {
    return this.financeService.findAllExpenses(companyId, currency);
  }

  @Get('payroll/:id/slip')
  async getPayrollSlip(
    @Param('id') payrollId: string,
    @Res({ passthrough: false }) res: Response
  ) {
    const pdfBuffer = await this.financeService.generatePayrollSlip(payrollId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=payroll_${payrollId}.pdf`,
    });

    return res.end(pdfBuffer); //  use end instead of send
  }
  //download slip logic in pdf format .filter by months
  @Get('payslip')
  async downloadSlipByMonth(
    @Query('employeeId') employeeId: string,
    @Query('month') month: number,
    @Query('year') year: number,
    @Res() res: Response
  ) {

    const pdfBuffer =
      await this.financeService.generatePayrollSlipByMonth(
        employeeId,
        Number(month),
        Number(year)
      );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=payslip_${month}_${year}.pdf`,
    });

    res.end(pdfBuffer);
  }

  @Post('generate')
  generatePayroll(
    @Body() body: { attendanceId: string; month: number; year: number }
  ) {
    return this.financeService.generatePayroll(body);
  }



  // Filter payrolls by employee, month & year (for employee dashboard)
  // @Get('payroll/employee/:employeeId/filter')
  // async getFilteredPayrolls(
  //   @Param('employeeId') employeeId: string,
  //   @Query('month') month?: string,
  //   @Query('year') year?: string,
  // ) {
  //   // Convert query params to numbers
  //   const monthNum = month ? parseInt(month) : undefined;
  //   const yearNum = year ? parseInt(year) : undefined;

  //   const payrolls = await this.financeService.findAllPayroll(
  //     employeeId,
  //     monthNum,
  //     yearNum
  //   );

  //   return payrolls.map(p => ({
  //     payrollId: p.id,
  //     month: p.month,
  //     year: p.year,
  //     netSalary: p.netSalary,
  //     status: p.status,
  //   }));
  // }

  @Post('generate-single')
  generateSingle(@Body() body: { attendanceId: string }) {
    return this.financeService.generatePayrollSingle(body.attendanceId);
  }

  @Get('summary')
  @CheckAbilities({ action: Action.Read, subject: 'expense' })
  getSummary(
    @Query('companyId') companyId: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
    @Query('currency') currency?: string,
  ) {
    return this.financeService.getFinancialSummary(companyId, month, year, currency);
  }
}
