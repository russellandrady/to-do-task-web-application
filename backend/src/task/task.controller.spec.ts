import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  // Mock data
  const mockTaskResponse = {
    tasks: [
      {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    totalPages: 1,
    page: 1,
  };

  const mockTaskService = {
    createTask: jest.fn(),
    markTaskAsCompleted: jest.fn(),
    deleteTask: jest.fn(),
    getTasks: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
      };

      mockTaskService.createTask.mockResolvedValue(mockTaskResponse);

      const result = await controller.createTask(createTaskDto);

      expect(service.createTask).toHaveBeenCalledWith(createTaskDto);
      expect(result).toEqual({
      success: true,
      statusCode: 200,
      message: "Operation completed successfully.",
      data: mockTaskResponse,
    });
    });

    it('should handle service errors', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
      };
    
      mockTaskService.createTask.mockRejectedValue(
        new Error('Service error'),
      );
    
      await expect(controller.createTask(createTaskDto)).rejects.toThrow(
        'Something is UNUSUAL',
      );
    });
  });

  describe('markTaskAsCompleted', () => {
    it('should mark a task as completed', async () => {
      const taskId = '1';

      mockTaskService.markTaskAsCompleted.mockResolvedValue(mockTaskResponse);

      const result = await controller.markTaskAsCompleted(taskId);

      expect(service.markTaskAsCompleted).toHaveBeenCalledWith(1);
      expect(result).toEqual({
      success: true,
      statusCode: 200,
      message: "Operation completed successfully.",
      data: mockTaskResponse,
    });
    });

    it('should convert string id to number', async () => {
      const taskId = '42';

      mockTaskService.markTaskAsCompleted.mockResolvedValue(mockTaskResponse);

      await controller.markTaskAsCompleted(taskId);

      expect(service.markTaskAsCompleted).toHaveBeenCalledWith(42);
    });

    it('should handle service errors', async () => {
      const taskId = '999';
    
      mockTaskService.markTaskAsCompleted.mockRejectedValue(
        new Error('Task not found'),
      );
    
      await expect(controller.markTaskAsCompleted(taskId)).rejects.toThrow(
        'Something is UNUSUAL',
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const taskId = '1';

      mockTaskService.deleteTask.mockResolvedValue(mockTaskResponse);

      const result = await controller.deleteTask(taskId);

      expect(service.deleteTask).toHaveBeenCalledWith(1);
      expect(result).toEqual({
      success: true,
      statusCode: 200,
      message: "Operation completed successfully.",
      data: mockTaskResponse,
    });
    });

    it('should convert string id to number', async () => {
      const taskId = '123';

      mockTaskService.deleteTask.mockResolvedValue(mockTaskResponse);

      await controller.deleteTask(taskId);

      expect(service.deleteTask).toHaveBeenCalledWith(123);
    });

    it('should handle service errors', async () => {
      const taskId = '1';
    
      mockTaskService.deleteTask.mockRejectedValue(
        new Error('Delete failed'),
      );
    
      await expect(controller.deleteTask(taskId)).rejects.toThrow(
        'Something is UNUSUAL',
      );
    });
  });

  describe('getCompletedTasks', () => {
    it('should get completed tasks with page number', async () => {
      const page = '2';

      mockTaskService.getTasks.mockResolvedValue(mockTaskResponse);

      const result = await controller.getCompletedTasks(page);

      expect(service.getTasks).toHaveBeenCalledWith(2, true);
      expect(result).toEqual({
      success: true,
      statusCode: 200,
      message: "Operation completed successfully.",
      data: mockTaskResponse,
    });
    });

    it('should default to page 1 when page is undefined', async () => {
      mockTaskService.getTasks.mockResolvedValue(mockTaskResponse);

      const result = await controller.getCompletedTasks(undefined);

      expect(service.getTasks).toHaveBeenCalledWith(1, true);
      expect(result).toEqual({
      success: true,
      statusCode: 200,
      message: "Operation completed successfully.",
      data: mockTaskResponse,
    });
    });

    it('should handle service errors', async () => {
      mockTaskService.getTasks.mockRejectedValue(
        new Error('Database error'),
      );
    
      await expect(controller.getCompletedTasks('1')).rejects.toThrow(
        'Something is UNUSUAL',
      );
    });
  });

  describe('getNotCompletedTasks', () => {
    it('should get not completed tasks with page number', async () => {
      const page = '3';

      mockTaskService.getTasks.mockResolvedValue(mockTaskResponse);

      const result = await controller.getNotCompletedTasks(page);

      expect(service.getTasks).toHaveBeenCalledWith(3, false);
      expect(result).toEqual({
      success: true,
      statusCode: 200,
      message: "Operation completed successfully.",
      data: mockTaskResponse,
    });
    });

    it('should default to page 1 when page is undefined', async () => {
      mockTaskService.getTasks.mockResolvedValue(mockTaskResponse);

      const result = await controller.getNotCompletedTasks(undefined);

      expect(service.getTasks).toHaveBeenCalledWith(1, false);
      expect(result).toEqual({
      success: true,
      statusCode: 200,
      message: "Operation completed successfully.",
      data: mockTaskResponse,
    });
    });

    it('should handle invalid page numbers gracefully', async () => {
      const page = 'invalid';

      mockTaskService.getTasks.mockResolvedValue(mockTaskResponse);

      await controller.getNotCompletedTasks(page);

      // NaN converts to NaN, but controller should handle it
      expect(service.getTasks).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      mockTaskService.getTasks.mockRejectedValue(
        new Error('Connection lost'),
      );
    
      await expect(controller.getNotCompletedTasks('1')).rejects.toThrow(
        'Something is UNUSUAL',
      );
    });
  });
});