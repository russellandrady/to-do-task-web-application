import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Add validation pipe (same as main.ts)
    app.useGlobalPipes(new ValidationPipe());
    
    // Set global prefix (same as main.ts)
    app.setGlobalPrefix('api');

    prisma = app.get<PrismaService>(PrismaService);
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.task.deleteMany();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const response = await request(app.getHttpServer())
        .post('/api/tasks')
        .send(createTaskDto)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        statusCode: 200,
        message: 'Operation completed successfully.',
      });
      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0]).toMatchObject({
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
      });
    });

    it('should fail without title', async () => {
      const createTaskDto = {
        description: 'Test Description',
      };

      await request(app.getHttpServer())
        .post('/api/tasks')
        .send(createTaskDto)
        .expect(400);
    });

    it('should fail with empty title', async () => {
      const createTaskDto = {
        title: '',
        description: 'Test Description',
      };

      await request(app.getHttpServer())
        .post('/api/tasks')
        .send(createTaskDto)
        .expect(400);
    });

    it('should create task without description', async () => {
      const createTaskDto = {
        title: 'Test Task',
      };

      const response = await request(app.getHttpServer())
        .post('/api/tasks')
        .send(createTaskDto)
        .expect(201);

      expect(response.body.data.tasks[0].description).toBeNull();
    });
  });

  describe('GET /api/tasks/not-completed', () => {
    it('should return empty list when no tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/tasks/not-completed')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          tasks: [],
          totalPages: 0,
          page: 1,
        },
      });
    });

    it('should return not completed tasks', async () => {
      // Create test data
      await prisma.task.createMany({
        data: [
          { title: 'Task 1', description: 'Desc 1', completed: false },
          { title: 'Task 2', description: 'Desc 2', completed: false },
          { title: 'Task 3', description: 'Desc 3', completed: true },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/tasks/not-completed')
        .expect(200);

      expect(response.body.data.tasks).toHaveLength(2);
      expect(response.body.data.totalPages).toBe(1);
      expect(response.body.data.tasks.every((task) => !task.completed)).toBe(true);
    });

    it('should support pagination', async () => {
      // Create 7 tasks (pageSize is 5)
      const tasks = Array.from({ length: 7 }, (_, i) => ({
        title: `Task ${i + 1}`,
        description: `Desc ${i + 1}`,
        completed: false,
      }));
      await prisma.task.createMany({ data: tasks });

      // Page 1
      const page1 = await request(app.getHttpServer())
        .get('/api/tasks/not-completed?page=1')
        .expect(200);

      expect(page1.body.data.tasks).toHaveLength(5);
      expect(page1.body.data.totalPages).toBe(2);
      expect(page1.body.data.page).toBe(1);

      // Page 2
      const page2 = await request(app.getHttpServer())
        .get('/api/tasks/not-completed?page=2')
        .expect(200);

      expect(page2.body.data.tasks).toHaveLength(2);
      expect(page2.body.data.page).toBe(2);
    });

    it('should order by createdAt desc', async () => {
      // Create tasks with delays to ensure different timestamps
      await prisma.task.create({
        data: { title: 'First', description: 'First', completed: false },
      });
      await new Promise((resolve) => setTimeout(resolve, 10));
      await prisma.task.create({
        data: { title: 'Second', description: 'Second', completed: false },
      });
      await new Promise((resolve) => setTimeout(resolve, 10));
      await prisma.task.create({
        data: { title: 'Third', description: 'Third', completed: false },
      });

      const response = await request(app.getHttpServer())
        .get('/api/tasks/not-completed')
        .expect(200);

      expect(response.body.data.tasks[0].title).toBe('Third');
      expect(response.body.data.tasks[2].title).toBe('First');
    });
  });

  describe('GET /api/tasks/completed', () => {
    it('should return only completed tasks', async () => {
      await prisma.task.createMany({
        data: [
          { title: 'Task 1', description: 'Desc 1', completed: true },
          { title: 'Task 2', description: 'Desc 2', completed: false },
          { title: 'Task 3', description: 'Desc 3', completed: true },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/tasks/completed')
        .expect(200);

      expect(response.body.data.tasks).toHaveLength(2);
      expect(response.body.data.tasks.every((task) => task.completed)).toBe(true);
    });

    it('should support pagination for completed tasks', async () => {
      const tasks = Array.from({ length: 6 }, (_, i) => ({
        title: `Task ${i + 1}`,
        description: `Desc ${i + 1}`,
        completed: true,
      }));
      await prisma.task.createMany({ data: tasks });

      const response = await request(app.getHttpServer())
        .get('/api/tasks/completed?page=2')
        .expect(200);

      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.totalPages).toBe(2);
      expect(response.body.data.page).toBe(2);
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('should mark task as completed', async () => {
      const task = await prisma.task.create({
        data: { title: 'Test Task', description: 'Test', completed: false },
      });

      const response = await request(app.getHttpServer())
        .patch(`/api/tasks/${task.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify in database
      const updatedTask = await prisma.task.findUnique({
        where: { id: task.id },
      });
      expect(updatedTask.completed).toBe(true);
    });

    it('should return 500 for non-existent task', async () => {
      await request(app.getHttpServer())
        .patch('/api/tasks/99999')
        .expect(500);
    });

    it('should return updated not-completed list after marking', async () => {
      await prisma.task.createMany({
        data: [
          { title: 'Task 1', description: 'Desc 1', completed: false },
          { title: 'Task 2', description: 'Desc 2', completed: false },
        ],
      });

      const tasks = await prisma.task.findMany();
      
      const response = await request(app.getHttpServer())
        .patch(`/api/tasks/${tasks[0].id}`)
        .expect(200);

      // Should only have 1 not-completed task now
      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].id).toBe(tasks[1].id);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const task = await prisma.task.create({
        data: { title: 'Test Task', description: 'Test', completed: false },
      });

      await request(app.getHttpServer())
        .delete(`/api/tasks/${task.id}`)
        .expect(200);

      // Verify deleted from database
      const deletedTask = await prisma.task.findUnique({
        where: { id: task.id },
      });
      expect(deletedTask).toBeNull();
    });

    it('should return 500 for non-existent task', async () => {
      await request(app.getHttpServer())
        .delete('/api/tasks/99999')
        .expect(500);
    });

    it('should return updated list after deletion', async () => {
      await prisma.task.createMany({
        data: [
          { title: 'Task 1', description: 'Desc 1', completed: false },
          { title: 'Task 2', description: 'Desc 2', completed: false },
        ],
      });

      const tasks = await prisma.task.findMany();

      const response = await request(app.getHttpServer())
        .delete(`/api/tasks/${tasks[0].id}`)
        .expect(200);

      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].id).toBe(tasks[1].id);
    });
  });

  describe('Complete Flow', () => {
    it('should handle complete task lifecycle', async () => {
      // 1. Create task
      const createResponse = await request(app.getHttpServer())
        .post('/api/tasks')
        .send({ title: 'Lifecycle Task', description: 'Test lifecycle' })
        .expect(201);

      const taskId = createResponse.body.data.tasks[0].id;

      // 2. Verify it appears in not-completed list
      const notCompletedResponse = await request(app.getHttpServer())
        .get('/api/tasks/not-completed')
        .expect(200);

      expect(notCompletedResponse.body.data.tasks).toHaveLength(1);

      // 3. Mark as completed
      await request(app.getHttpServer())
        .patch(`/api/tasks/${taskId}`)
        .expect(200);

      // 4. Verify it's in completed list
      const completedResponse = await request(app.getHttpServer())
        .get('/api/tasks/completed')
        .expect(200);

      expect(completedResponse.body.data.tasks).toHaveLength(1);
      expect(completedResponse.body.data.tasks[0].completed).toBe(true);

      // 5. Verify it's NOT in not-completed list
      const notCompletedAfter = await request(app.getHttpServer())
        .get('/api/tasks/not-completed')
        .expect(200);

      expect(notCompletedAfter.body.data.tasks).toHaveLength(0);

      // 6. Delete task
      await request(app.getHttpServer())
        .delete(`/api/tasks/${taskId}`)
        .expect(200);

      // 7. Verify it's gone from completed list
      const finalCompleted = await request(app.getHttpServer())
        .get('/api/tasks/completed')
        .expect(200);

      expect(finalCompleted.body.data.tasks).toHaveLength(0);
    });
  });
});