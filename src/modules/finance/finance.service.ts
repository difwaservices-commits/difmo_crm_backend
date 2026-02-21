import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payroll } from './entities/payroll.entity';
import { Expense } from './entities/expense.entity';
import { Company } from '../companies/company.entity';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Payroll)
    private readonly payrollRepository: Repository<Payroll>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // Payroll
  async createPayroll(data: Partial<Payroll>): Promise<Payroll> {
    return this.payrollRepository.save(this.payrollRepository.create(data));
  }

  async findAllPayroll(
    companyId: string,
    month?: number,
    year?: number,
  ): Promise<Payroll[]> {
    const where: any = { companyId };
    if (month) where.month = month;
    if (year) where.year = year;
    return this.payrollRepository.find({
      where,
      relations: ['employee', 'employee.user'],
    });
  }

  // Expenses
  async createExpense(data: Partial<Expense>): Promise<Expense> {
    return this.expenseRepository.save(this.expenseRepository.create(data));
  }

  async findAllExpenses(companyId: string): Promise<Expense[]> {
    return this.expenseRepository.find({ where: { companyId } });
  }

  // turnover & summary
  async getFinancialSummary(companyId: string) {
    const expenses = await this.expenseRepository.find({
      where: { companyId },
    });
    const payrolls = await this.payrollRepository.find({
      where: { companyId, status: 'paid' },
    });

    const totalExpenses = expenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0,
    );
    const totalPayroll = payrolls.reduce(
      (sum, p) => sum + Number(p.netSalary),
      0,
    );

    // In a real app, turnover might come from Invoices/Payments.
    // For now, we'll use a placeholder or calculate from active projects if needed.
    return {
      totalExpenses,
      totalPayroll,
      grandTotalOutgoing: totalExpenses + totalPayroll,
      turnover: 500000, // Placeholder as requested 'perfectly' but need data source
    };
  }
}
