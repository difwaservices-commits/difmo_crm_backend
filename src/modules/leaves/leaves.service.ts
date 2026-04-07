import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Leave } from './leave.entity';
import { CreateLeaveDto, UpdateLeaveStatusDto } from './dto/create-leave.dto';
import { Employee } from '../employees/employee.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LeavesService {
  constructor(
    @InjectRepository(Leave)
    private leavesRepository: Repository<Leave>,

    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private readonly notificationsService: NotificationsService
  ) {}

  // ✅ CREATE LEAVE
  async create(createLeaveDto: CreateLeaveDto): Promise<Leave> {
    console.log("Incoming employeeId:", createLeaveDto.employeeId);

    // 🔥 Map userId → employee
    const employee = await this.employeeRepository.findOne({
      where: { userId: createLeaveDto.employeeId },
      relations: ['user'],
    });

    if (!employee) {
      throw new NotFoundException("Employee not found");
    }

    // ✅ Validation: date check
    if (createLeaveDto.startDate > createLeaveDto.endDate) {
      throw new BadRequestException("Start date cannot be after end date");
    }

    // ✅ Conflict check (already approved leave)
    const conflict = await this.leavesRepository.findOne({
      where: {
        employeeId: employee.id,
        status: 'APPROVED',
        startDate: LessThanOrEqual(createLeaveDto.endDate),
        endDate: MoreThanOrEqual(createLeaveDto.startDate),
      },
    });

    if (conflict) {
      throw new BadRequestException("Leave already exists in this date range");
    }

    const leave = this.leavesRepository.create({
      ...createLeaveDto,
      status: 'PENDING', // always default
      employee: employee,
      employeeId: employee.id,
    });

    console.log("✅ Saving leave for employeeId:", employee.id);

    return await this.leavesRepository.save(leave);
  }

  // ✅ GET ALL (FILTER SUPPORT)
// leaves.service.ts ke andar isse replace karein

async findAll(filters?: any): Promise<Leave[]> {
  const query = this.leavesRepository
    .createQueryBuilder('leave')
    .leftJoinAndSelect('leave.employee', 'employee') // Leave se Employee join kiya
    .leftJoinAndSelect('employee.user', 'user')    // 🔥 AB USER BHI JOIN KIYA (Naam ke liye)
    .orderBy('leave.createdAt', 'DESC');

  // Filter logic (Same as before)
  if (filters?.employeeId) {
    query.andWhere('employee.userId = :userId', {
      userId: filters.employeeId,
    });
  }

  if (filters?.status) {
    query.andWhere('leave.status = :status', { status: filters.status });
  }

  return query.getMany();
}

  // ✅ GET ONE
 async findOne(id: string): Promise<Leave> {
  const leave = await this.leavesRepository.findOne({
    where: { id },
    relations: ['employee', 'employee.user'], // 🔥 'employee.user' zaroori hai
  });

  if (!leave) {
    throw new NotFoundException('Leave not found');
  }

  return leave;
}

  // ✅ UPDATE STATUS (APPROVE / REJECT)
  async updateStatus(id: string, dto: UpdateLeaveStatusDto): Promise<Leave> {
    const leave = await this.findOne(id);

    leave.status = dto.status.toUpperCase(); // 🔥 normalize

    if (dto.adminComment) {
      leave.adminComment = dto.adminComment;
    }

    console.log("✅ Updating leave:", id, "→", leave.status);

    return await this.leavesRepository.save(leave);
  }

  // ✅ CHECK IF EMPLOYEE ON LEAVE
  async isEmployeeOnLeave(employeeId: string, date: string): Promise<boolean> {
    const leave = await this.leavesRepository.findOne({
      where: {
        employeeId,
        status: 'APPROVED',
        startDate: LessThanOrEqual(date),
        endDate: MoreThanOrEqual(date),
      },
    });

    return !!leave;
  }
}