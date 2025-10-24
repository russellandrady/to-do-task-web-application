import { renderHook, act } from '@testing-library/react'
import useTaskStore from '../taskStore'
import type { Task } from '@/types/task'

describe('TaskStore', () => {
  beforeEach(() => {
    // Clear store before each test
    const { result } = renderHook(() => useTaskStore())
    act(() => {
      result.current.setTasksCompleted([])
      result.current.setTasksNotCompleted([])
      result.current.setPageCompleted(1)
      result.current.setPageNotCompleted(1)
      result.current.setNumberOfPagesCompleted(1)
      result.current.setNumberOfPagesNotCompleted(1)
    })
  })

  afterEach(() => {
    // Clear localStorage after each test
    localStorage.clear()
  })

  it('should have initial state', () => {
    const { result } = renderHook(() => useTaskStore())

    expect(result.current.tasksCompleted).toEqual([])
    expect(result.current.tasksNotCompleted).toEqual([])
    expect(result.current.pageCompleted).toBe(1)
    expect(result.current.pageNotCompleted).toBe(1)
    expect(result.current.numberOfPagesCompleted).toBe(1)
    expect(result.current.numberOfPagesNotCompleted).toBe(1)
  })

  describe('Completed Tasks', () => {
    it('should set completed tasks', () => {
      const { result } = renderHook(() => useTaskStore())
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Completed Task 1',
          description: 'Description 1',
          completed: true,
        },
        {
          id: 2,
          title: 'Completed Task 2',
          description: 'Description 2',
          completed: true,
        },
      ]

      act(() => {
        result.current.setTasksCompleted(mockTasks)
      })

      expect(result.current.tasksCompleted).toEqual(mockTasks)
      expect(result.current.tasksCompleted).toHaveLength(2)
    })

    it('should set completed page', () => {
      const { result } = renderHook(() => useTaskStore())

      act(() => {
        result.current.setPageCompleted(3)
      })

      expect(result.current.pageCompleted).toBe(3)
    })

    it('should set number of completed pages', () => {
      const { result } = renderHook(() => useTaskStore())

      act(() => {
        result.current.setNumberOfPagesCompleted(5)
      })

      expect(result.current.numberOfPagesCompleted).toBe(5)
    })

    it('should set all completed task data at once', () => {
      const { result } = renderHook(() => useTaskStore())
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Desc 1',
          completed: true,
        },
      ]

      act(() => {
        result.current.setCompletedTasksData(mockTasks, 2, 5)
      })

      expect(result.current.tasksCompleted).toEqual(mockTasks)
      expect(result.current.pageCompleted).toBe(2)
      expect(result.current.numberOfPagesCompleted).toBe(5)
    })
  })

  describe('Not Completed Tasks', () => {
    it('should set not completed tasks', () => {
      const { result } = renderHook(() => useTaskStore())
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Not Completed Task 1',
          description: 'Description 1',
          completed: false,
        },
      ]

      act(() => {
        result.current.setTasksNotCompleted(mockTasks)
      })

      expect(result.current.tasksNotCompleted).toEqual(mockTasks)
      expect(result.current.tasksNotCompleted).toHaveLength(1)
    })

    it('should set not completed page', () => {
      const { result } = renderHook(() => useTaskStore())

      act(() => {
        result.current.setPageNotCompleted(4)
      })

      expect(result.current.pageNotCompleted).toBe(4)
    })

    it('should set number of not completed pages', () => {
      const { result } = renderHook(() => useTaskStore())

      act(() => {
        result.current.setNumberOfPagesNotCompleted(10)
      })

      expect(result.current.numberOfPagesNotCompleted).toBe(10)
    })

    it('should set all not completed task data at once', () => {
      const { result } = renderHook(() => useTaskStore())
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Desc 1',
          completed: false,
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Desc 2',
          completed: false,
        },
      ]

      act(() => {
        result.current.setNotCompletedTasksData(mockTasks, 3, 7)
      })

      expect(result.current.tasksNotCompleted).toEqual(mockTasks)
      expect(result.current.pageNotCompleted).toBe(3)
      expect(result.current.numberOfPagesNotCompleted).toBe(7)
    })
  })

  describe('Batch Updates', () => {
    it('should update completed tasks data in single operation', () => {
      const { result } = renderHook(() => useTaskStore())
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Desc 1',
          completed: true,
        },
      ]

      act(() => {
        result.current.setCompletedTasksData(mockTasks, 2, 4)
      })

      expect(result.current.tasksCompleted).toEqual(mockTasks)
      expect(result.current.pageCompleted).toBe(2)
      expect(result.current.numberOfPagesCompleted).toBe(4)
    })

    it('should update not completed tasks data in single operation', () => {
      const { result } = renderHook(() => useTaskStore())
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Desc 1',
          completed: false,
        },
      ]

      act(() => {
        result.current.setNotCompletedTasksData(mockTasks, 1, 3)
      })

      expect(result.current.tasksNotCompleted).toEqual(mockTasks)
      expect(result.current.pageNotCompleted).toBe(1)
      expect(result.current.numberOfPagesNotCompleted).toBe(3)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty task arrays', () => {
      const { result } = renderHook(() => useTaskStore())

      act(() => {
        result.current.setTasksCompleted([])
        result.current.setTasksNotCompleted([])
      })

      expect(result.current.tasksCompleted).toEqual([])
      expect(result.current.tasksNotCompleted).toEqual([])
    })

    it('should handle page number 0', () => {
      const { result } = renderHook(() => useTaskStore())

      act(() => {
        result.current.setPageCompleted(0)
        result.current.setNumberOfPagesCompleted(0)
      })

      expect(result.current.pageCompleted).toBe(0)
      expect(result.current.numberOfPagesCompleted).toBe(0)
    })
  })
})