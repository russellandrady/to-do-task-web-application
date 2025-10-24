import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;

  // Mock data
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTasks = [
    { ...mockTask, id: 1 },
    { ...mockTask, id: 2, title: 'Task 2' },
    { ...mockTask, id: 3, title: 'Task 3' },
  ];

  // Mock PrismaService
  const mockPrismaService = {
    task: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task and return not completed tasks', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
      };

      mockPrismaService.task.create.mockResolvedValue(mockTask);
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);
      mockPrismaService.task.count.mockResolvedValue(3);

      const result = await service.createTask(createTaskDto);

      expect(prisma.task.create).toHaveBeenCalledWith({ data: createTaskDto });
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 5,
        where: { completed: false },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual({
        tasks: mockTasks,
        totalPages: 1,
        page: 1,
      });
    });

    it('should handle empty task list after creation', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
      };

      mockPrismaService.task.create.mockResolvedValue(mockTask);
      mockPrismaService.task.findMany.mockResolvedValue([]);
      mockPrismaService.task.count.mockResolvedValue(0);

      const result = await service.createTask(createTaskDto);

      expect(result).toEqual({
        tasks: [],
        totalPages: 0,
        page: 1,
      });
    });
  });

  describe('markTaskAsCompleted', () => {
    it('should mark a task as completed and return not completed tasks', async () => {
      const taskId = 1;
      const updatedTask = { ...mockTask, completed: true };

      mockPrismaService.task.update.mockResolvedValue(updatedTask);
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);
      mockPrismaService.task.count.mockResolvedValue(3);

      const result = await service.markTaskAsCompleted(taskId);

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: { completed: true },
      });
      expect(result).toEqual({
        tasks: mockTasks,
        totalPages: 1,
        page: 1,
      });
    });

    it('should handle marking non-existent task', async () => {
      const taskId = 999;
      mockPrismaService.task.update.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.markTaskAsCompleted(taskId)).rejects.toThrow(
        'Record not found',
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and return not completed tasks', async () => {
      const taskId = 1;

      mockPrismaService.task.delete.mockResolvedValue(mockTask);
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);
      mockPrismaService.task.count.mockResolvedValue(2);

      const result = await service.deleteTask(taskId);

      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(result).toEqual({
        tasks: mockTasks,
        totalPages: 1,
        page: 1,
      });
    });

    it('should handle deleting non-existent task', async () => {
      const taskId = 999;
      mockPrismaService.task.delete.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.deleteTask(taskId)).rejects.toThrow(
        'Record not found',
      );
    });
  });

  describe('getTasks', () => {
    it('should return completed tasks with pagination', async () => {
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);
      mockPrismaService.task.count.mockResolvedValue(10);

      const result = await service.getTasks(1, true);

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 5,
        where: { completed: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(prisma.task.count).toHaveBeenCalledWith({
        where: { completed: true },
      });
      expect(result).toEqual({
        tasks: mockTasks,
        totalPages: 2,
        page: 1,
      });
    });

    it('should return not completed tasks with pagination', async () => {
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);
      mockPrismaService.task.count.mockResolvedValue(15);

      const result = await service.getTasks(2, false);

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        where: { completed: false },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual({
        tasks: mockTasks,
        totalPages: 3,
        page: 2,
      });
    });

    it('should handle empty task list', async () => {
      mockPrismaService.task.findMany.mockResolvedValue([]);
      mockPrismaService.task.count.mockResolvedValue(0);

      const result = await service.getTasks(1, false);

      expect(result).toEqual({
        tasks: [],
        totalPages: 0,
        page: 1,
      });
    });

    it('should calculate correct pagination for page 3', async () => {
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);
      mockPrismaService.task.count.mockResolvedValue(25);

      const result = await service.getTasks(3, true);

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        skip: 10,
        take: 5,
        where: { completed: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual({
        tasks: mockTasks,
        totalPages: 5,
        page: 3,
      });
    });

    it('should handle exact page boundary (count divisible by pageSize)', async () => {
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);
      mockPrismaService.task.count.mockResolvedValue(10);

      const result = await service.getTasks(2, false);

      expect(result).toEqual({
        tasks: mockTasks,
        totalPages: 2,
        page: 2,
      });
    });
  });

  describe('Error Handling', () => {
    it('should propagate database errors on create', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
      };

      mockPrismaService.task.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.createTask(createTaskDto)).rejects.toThrow(
        'Database error',
      );
    });

    it('should propagate database errors on getTasks', async () => {
      mockPrismaService.task.findMany.mockRejectedValue(
        new Error('Connection error'),
      );

      await expect(service.getTasks(1, false)).rejects.toThrow(
        'Connection error',
      );
    });
  });
});