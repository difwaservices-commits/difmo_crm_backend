import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeEntry } from './time-entry.entity';

@Injectable()
export class TimeTrackingService {
  constructor(
    @InjectRepository(TimeEntry)
    private readonly timeEntryRepository: Repository<TimeEntry>,
  ) {}

  async startTimer(data: Partial<TimeEntry>) {
    const entry = this.timeEntryRepository.create({
      ...data,
      startTime: new Date(),
    });
    return this.timeEntryRepository.save(entry);
  }

  async stopTimer(id: string, description?: string) {
    const entry = await this.timeEntryRepository.findOne({ where: { id } });
    if (!entry) throw new Error('Time entry not found');

    entry.endTime = new Date();
    const diffMs = entry.endTime.getTime() - entry.startTime.getTime();
    entry.durationMinutes = Math.round(diffMs / 60000);
    if (description) entry.description = description;

    return this.timeEntryRepository.save(entry);
  }

  async findAll(employeeId: string) {
    return this.timeEntryRepository.find({
      where: { employeeId },
      relations: ['task'],
      order: { startTime: 'DESC' },
    });
  }
}
