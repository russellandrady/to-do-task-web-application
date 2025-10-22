import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { executeService } from 'src/common/utils/execute-service.util';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  createTask(@Body() dto: CreateTaskDto) {
    return executeService(() => this.taskService.createTask(dto) );
  }

  @Patch(':id')
  markTaskAsCompleted(@Param('id') id: string) {
    return executeService(() => this.taskService.markTaskAsCompleted(Number(id)));
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return executeService(() => this.taskService.deleteTask(Number(id)));
  }

  @Get('completed')
  getCompletedTasks(@Query('page') page: string) {
    const pageNumber = page ? Number(page) : 1;
    return executeService(() => this.taskService.getTasks(pageNumber, true));
  }

  @Get('not-completed')
  getNotCompletedTasks(@Query('page') page: string) {
    const pageNumber = page ? Number(page) : 1;
    return executeService(() => this.taskService.getTasks(pageNumber, false));
  }
}