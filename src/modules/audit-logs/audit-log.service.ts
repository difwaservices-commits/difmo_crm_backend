import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(
    userId: string,
    action: string,
    resource: string,
    details?: any,
    ipAddress?: string,
  ) {
    const auditLog = this.auditLogRepository.create({
      userId,
      action,
      resource,
      details,
      ipAddress,
    });
    return this.auditLogRepository.save(auditLog);
  }

  async findAll(filters?: any) {
    return this.auditLogRepository.find({
      where: filters,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}
