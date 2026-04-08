import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Employee } from '../employees/employee.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly notificationsService: NotificationsService,
  ) { }

  // Clients
  async createClient(data: Partial<Client>): Promise<Client> {
    return this.clientRepository.save(this.clientRepository.create(data));
  }

  async findAllClients(companyId: string): Promise<Client[]> {
    return this.clientRepository.find({ where: { companyId } });
  }

  // Projects
  async createProject(data: Partial<Project>): Promise<Project> {
    return this.projectRepository.save(this.projectRepository.create(data));
  }

  async findAllProjects(companyId: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: { companyId },
      relations: ['client'],
    });
  }

  async findOneProject(id: string): Promise<Project | null> {
    return this.projectRepository.findOne({
      where: { id },
      relations: ['client'],
    });
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
    await this.projectRepository.update(id, data);
    return this.findOneProject(id);
  }

  async deleteProject(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }

  // Tasks
  async createTask(data: any): Promise<Task> {
    const taskData = {
      ...data,
      deadline: data.dueDate ? new Date(data.dueDate) : undefined,
    };
    const newTask = this.taskRepository.create(taskData);
    const savedTask = await this.taskRepository.save(newTask) as any;

    // 🔥 Real-time Notification for Task Assignment
    if (savedTask.assigneeId) {
      try {
        // We need to fetch the employee to get the userId for notification
        const assignee = await this.employeeRepository.findOne({
          where: { id: savedTask.assigneeId },
          relations: ['user']
        });

        if (assignee?.userId) {
          await this.notificationsService.send({
            title: 'New Task Assigned',
            message: `You have been assigned a new task: ${savedTask.title}. Priority: ${savedTask.priority}.`,
            type: 'both',
            recipientFilter: 'employees',
            recipientIds: [assignee.userId],
            companyId: savedTask.companyId || (assignee.companyId),
            metadata: {
              type: 'TASK_ASSIGNED',
              taskId: savedTask.id,
              projectId: savedTask.projectId,
              priority: savedTask.priority
            }
          });
        }
      } catch (err) {
        console.error('[ProjectsService] Failed to notify assignee:', err.message);
      }
    }

    return savedTask;
  }

  async findAllTasks(projectId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { projectId },
      relations: ['assignee', 'assignee.user'],
    });
  }

  async findAllTasksByCompany(companyId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: [
        { companyId },
        { project: { companyId } }
      ],
      relations: ['assignee', 'assignee.user', 'project'],
      order: { createdAt: 'DESC' }
    });
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task | null> {
    await this.taskRepository.update(id, data);
    return this.taskRepository.findOne({
      where: { id },
      relations: ['assignee'],
    });
  }
}
