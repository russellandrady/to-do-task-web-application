import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';

export interface TaskResponse {
  tasks: Task[];
  totalPages: number;
  page: number;
}
@Injectable()
export class TaskService {
  
  constructor(private prisma: PrismaService) {}

  async createTask(dto: CreateTaskDto): Promise<TaskResponse> {
    await this.prisma.task.create({ data: dto });
    return this.getTasks(1, false);
  }

  async markTaskAsCompleted(id: number): Promise<TaskResponse> {
    await this.prisma.task.update({
      where: { id },
      data: { completed: true },
    });
    return this.getTasks(1, false);
  }

  async deleteTask(id: number): Promise<TaskResponse> {
    await this.prisma.task.delete({
      where: { id },
    });
    return this.getTasks(1, false);
  }

  async getTasks(page: number, completed: boolean): Promise<TaskResponse> {
    const pageSize = 5;
    const skip = (page - 1) * pageSize;
  
    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        skip,
        take: pageSize,
        where: { completed },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where: { completed } }),
    ]);
  
    const totalPages = Math.ceil(total / pageSize); // Calculate total pages
  
    return { tasks, totalPages, page };
  }
}