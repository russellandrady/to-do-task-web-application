import {
  createTaskService,
  fetchTasksCompletedService,
  fetchTasksNotCompletedService,
  markTaskAsCompletedService,
} from '../service'
import * as apiManager from '../apiManager'
import useTaskStore from '@/store/taskStore'
import { toast } from 'sonner'

// Mock dependencies
jest.mock('../apiManager')
jest.mock('sonner')
jest.mock('@/store/taskStore')

const mockedApiGET = apiManager.apiGET as jest.MockedFunction<typeof apiManager.apiGET>
const mockedApiPOST = apiManager.apiPOST as jest.MockedFunction<typeof apiManager.apiPOST>
const mockedApiPATCH = apiManager.apiPATCH as jest.MockedFunction<typeof apiManager.apiPATCH>

describe('API Service', () => {
  const mockSetNotCompletedTasksData = jest.fn()
  const mockSetCompletedTasksData = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock useTaskStore.getState()
    ;(useTaskStore.getState as jest.Mock).mockReturnValue({
      setNotCompletedTasksData: mockSetNotCompletedTasksData,
      setCompletedTasksData: mockSetCompletedTasksData,
    })
  })

  describe('fetchTasksNotCompletedService', () => {
    it('should fetch not completed tasks and update store', async () => {
      const mockResponse = {
        tasks: [
          { id: 1, title: 'Task 1', description: 'Desc 1', completed: false },
        ],
        totalPages: 1,
        page: 1,
      }

      mockedApiGET.mockResolvedValue(mockResponse)

      const result = await fetchTasksNotCompletedService(1)

      expect(mockedApiGET).toHaveBeenCalledWith('/tasks/not-completed?page=1')
      expect(mockSetNotCompletedTasksData).toHaveBeenCalledWith(
        mockResponse.tasks,
        mockResponse.page,
        mockResponse.totalPages
      )
      expect(result).toEqual(mockResponse.tasks)
    })

    it('should handle different page numbers', async () => {
      const mockResponse = {
        tasks: [],
        totalPages: 3,
        page: 2,
      }

      mockedApiGET.mockResolvedValue(mockResponse)

      await fetchTasksNotCompletedService(2)

      expect(mockedApiGET).toHaveBeenCalledWith('/tasks/not-completed?page=2')
      expect(mockSetNotCompletedTasksData).toHaveBeenCalledWith([], 2, 3)
    })

    it('should handle API errors', async () => {
      mockedApiGET.mockRejectedValue(new Error('Network error'))

      await expect(fetchTasksNotCompletedService(1)).rejects.toThrow('Network error')
    })
  })

  describe('fetchTasksCompletedService', () => {
    it('should fetch completed tasks and update store', async () => {
      const mockResponse = {
        tasks: [
          { id: 1, title: 'Task 1', description: 'Desc 1', completed: true },
        ],
        totalPages: 1,
        page: 1,
      }

      mockedApiGET.mockResolvedValue(mockResponse)

      const result = await fetchTasksCompletedService(1)

      expect(mockedApiGET).toHaveBeenCalledWith('/tasks/completed?page=1')
      expect(mockSetCompletedTasksData).toHaveBeenCalledWith(
        mockResponse.tasks,
        mockResponse.page,
        mockResponse.totalPages
      )
      expect(result).toEqual(mockResponse.tasks)
    })

    it('should handle pagination', async () => {
      const mockResponse = {
        tasks: [
          { id: 3, title: 'Task 3', description: 'Desc 3', completed: true },
        ],
        totalPages: 5,
        page: 3,
      }

      mockedApiGET.mockResolvedValue(mockResponse)

      await fetchTasksCompletedService(3)

      expect(mockedApiGET).toHaveBeenCalledWith('/tasks/completed?page=3')
      expect(mockSetCompletedTasksData).toHaveBeenCalledWith(
        mockResponse.tasks,
        3,
        5
      )
    })
  })

  describe('createTaskService', () => {
    it('should create a task and update store', async () => {
      const taskData = { title: 'New Task', description: 'New Desc' }
      const mockResponse = {
        tasks: [
          { id: 1, ...taskData, completed: false },
        ],
        totalPages: 1,
        page: 1,
      }

      mockedApiPOST.mockResolvedValue(mockResponse)

      const result = await createTaskService(taskData)

      expect(mockedApiPOST).toHaveBeenCalledWith('/tasks', taskData)
      expect(mockSetNotCompletedTasksData).toHaveBeenCalledWith(
        mockResponse.tasks,
        mockResponse.page,
        mockResponse.totalPages
      )
      expect(toast.success).toHaveBeenCalledWith('Task created successfully')
      expect(result).toEqual(mockResponse.tasks)
    })

    it('should handle API errors', async () => {
      mockedApiPOST.mockRejectedValue(new Error('Validation error'))

      await expect(
        createTaskService({ title: 'Test', description: 'Test' })
      ).rejects.toThrow('Validation error')
    })
  })

  describe('markTaskAsCompletedService', () => {
    it('should mark task as completed and update both stores', async () => {
      const mockResponse = {
        tasks: [
          { id: 2, title: 'Remaining Task', description: 'Desc', completed: false },
        ],
        totalPages: 1,
        page: 1,
      }

      mockedApiPATCH.mockResolvedValue(mockResponse)

      const result = await markTaskAsCompletedService(1)

      expect(mockedApiPATCH).toHaveBeenCalledWith('/tasks/1', {})
      expect(mockSetNotCompletedTasksData).toHaveBeenCalledWith(
        mockResponse.tasks,
        mockResponse.page,
        mockResponse.totalPages
      )
      expect(mockSetCompletedTasksData).toHaveBeenCalledWith([], 1, 1)
      expect(toast.success).toHaveBeenCalledWith('Task marked as completed')
      expect(result).toEqual(mockResponse.tasks)
    })

    it('should handle marking last not-completed task', async () => {
      const mockResponse = {
        tasks: [],
        totalPages: 0,
        page: 1,
      }

      mockedApiPATCH.mockResolvedValue(mockResponse)

      await markTaskAsCompletedService(5)

      expect(mockSetNotCompletedTasksData).toHaveBeenCalledWith([], 1, 0)
      expect(mockSetCompletedTasksData).toHaveBeenCalledWith([], 1, 1)
    })

    it('should handle API errors', async () => {
      mockedApiPATCH.mockRejectedValue(new Error('Task not found'))

      await expect(markTaskAsCompletedService(999)).rejects.toThrow('Task not found')
    })
  })
})