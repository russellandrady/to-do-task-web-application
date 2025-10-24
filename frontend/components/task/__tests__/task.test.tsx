import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TaskItem from "../task-item";
import TaskItemList from "../task-item-list";
import NotCompletedTaskList from "../not-completed-task-list";
import CompletedTaskList from "../completed-task-list";
import type { Task } from "@/types/task";
import * as service from "@/api/service";
import useTaskStore from "@/store/taskStore";

// Mock dependencies
jest.mock("@/api/service");
jest.mock("@/store/taskStore");
const mockedService = service as jest.Mocked<typeof service>;

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Check: () => <span>Check Icon</span>,
  ArrowBigLeft: () => <span>Left Arrow</span>,
  ArrowBigRight: () => <span>Right Arrow</span>,
}));

describe("Task Components", () => {
  let queryClient: QueryClient;

  const mockTask: Task = {
    id: 1,
    title: "Test Task",
    description: "Test Description",
    completed: false,
  };

  const mockStoreState = {
    tasksCompleted: [],
    tasksNotCompleted: [mockTask],
    pageCompleted: 1,
    pageNotCompleted: 1,
    numberOfPagesCompleted: 1,
    numberOfPagesNotCompleted: 1,
    setPageCompleted: jest.fn(),
    setPageNotCompleted: jest.fn(),
    setTasksCompleted: jest.fn(),
    setTasksNotCompleted: jest.fn(),
    setNumberOfPagesCompleted: jest.fn(),
    setNumberOfPagesNotCompleted: jest.fn(),
    setCompletedTasksData: jest.fn(),
    setNotCompletedTasksData: jest.fn(),
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
    (useTaskStore as unknown as jest.Mock).mockReturnValue(mockStoreState);
    (useTaskStore.getState as jest.Mock).mockReturnValue(mockStoreState);
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  // ============================================
  // TaskItem Component Tests
  // ============================================
  describe("TaskItem", () => {
    it("should render task title and description", () => {
      renderWithProviders(<TaskItem {...mockTask} />);

      expect(screen.getByText("Test Task")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("should show Done button for incomplete tasks", () => {
      renderWithProviders(<TaskItem {...mockTask} />);

      expect(screen.getByText("Done")).toBeInTheDocument();
    });

    it("should NOT show Done button for completed tasks", () => {
      const completedTask = { ...mockTask, completed: true };
      renderWithProviders(<TaskItem {...completedTask} />);

      expect(screen.queryByText("Done")).not.toBeInTheDocument();
    });

    it("should call markTaskAsCompletedService when Done is clicked", async () => {
      mockedService.markTaskAsCompletedService.mockResolvedValue([]);

      renderWithProviders(<TaskItem {...mockTask} />);

      const doneButton = screen.getByText("Done");
      fireEvent.click(doneButton);

      await waitFor(() => {
        expect(mockedService.markTaskAsCompletedService).toHaveBeenCalledWith(
          1
        );
      });
    });
  });

  describe("NotCompletedTaskList", () => {
    it("should display loading spinner while fetching", () => {
      mockedService.fetchTasksNotCompletedService.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderWithProviders(<NotCompletedTaskList />);

      // Check for loading spinner by class
      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("should display tasks when loaded", async () => {
      mockedService.fetchTasksNotCompletedService.mockResolvedValue([mockTask]);

      renderWithProviders(<NotCompletedTaskList />);

      await waitFor(() => {
        expect(screen.getByText("Test Task")).toBeInTheDocument();
      });
    });

    it("should show empty message when no tasks", async () => {
      (useTaskStore as unknown as jest.Mock).mockReturnValue({
        ...mockStoreState,
        tasksNotCompleted: [],
      });

      mockedService.fetchTasksNotCompletedService.mockResolvedValue([]);

      renderWithProviders(<NotCompletedTaskList />);

      await waitFor(() => {
        expect(screen.getByText("No tasks to complete")).toBeInTheDocument();
      });
    });
  });

  describe("CompletedTaskList", () => {
    it("should display loading spinner while fetching", () => {
      mockedService.fetchTasksCompletedService.mockImplementation(
        () => new Promise(() => {})
      );

      renderWithProviders(<CompletedTaskList />);

      // Check for loading spinner by class
      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("should display completed tasks when loaded", async () => {
      const completedTask = { ...mockTask, completed: true };
      (useTaskStore.getState as jest.Mock).mockReturnValue({
        ...mockStoreState,
        tasksCompleted: [completedTask],
      });

      mockedService.fetchTasksCompletedService.mockResolvedValue([
        completedTask,
      ]);

      renderWithProviders(<CompletedTaskList />);

      await waitFor(() => {
        expect(screen.getByText("Test Task")).toBeInTheDocument();
      });
    });

    it("should show empty message when no completed tasks", async () => {
      (useTaskStore.getState as jest.Mock).mockReturnValue({
        ...mockStoreState,
        tasksCompleted: [],
      });

      mockedService.fetchTasksCompletedService.mockResolvedValue([]);

      renderWithProviders(<CompletedTaskList />);

      await waitFor(() => {
        expect(screen.getByText("No tasks to complete")).toBeInTheDocument();
      });
    });
  });

  describe("TaskItemList", () => {
    beforeEach(() => {
      mockedService.fetchTasksNotCompletedService.mockResolvedValue([mockTask]);
      mockedService.fetchTasksCompletedService.mockResolvedValue([]);
    });

    it('should render with "Tasks to Complete" by default', () => {
      renderWithProviders(<TaskItemList />);

      expect(screen.getByText("Tasks to Complete")).toBeInTheDocument();
    });

    it("should toggle to show completed tasks", async () => {
      renderWithProviders(<TaskItemList />);

      const toggleButton = screen.getByText("Show Completed");
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText("Completed Tasks")).toBeInTheDocument();
      });
    });

    it("should display pagination controls", () => {
      renderWithProviders(<TaskItemList />);

      expect(screen.getByText(/Page 1 of 1/)).toBeInTheDocument();
      expect(screen.getByText("Left Arrow")).toBeInTheDocument();
      expect(screen.getByText("Right Arrow")).toBeInTheDocument();
    });

    it("should handle next page click for not completed tasks", () => {
      (useTaskStore as unknown as jest.Mock).mockReturnValue({
        ...mockStoreState,
        numberOfPagesNotCompleted: 3,
        pageNotCompleted: 1,
      });

      renderWithProviders(<TaskItemList />);

      const nextButton = screen.getAllByRole("button")[2]; // Right arrow button
      fireEvent.click(nextButton);

      expect(mockStoreState.setPageNotCompleted).toHaveBeenCalledWith(2);
    });

    it("should handle previous page click", () => {
      (useTaskStore as unknown as jest.Mock).mockReturnValue({
        ...mockStoreState,
        pageNotCompleted: 2,
      });

      renderWithProviders(<TaskItemList />);

      const prevButton = screen.getAllByRole("button")[1]; // Left arrow button
      fireEvent.click(prevButton);

      expect(mockStoreState.setPageNotCompleted).toHaveBeenCalledWith(1);
    });

    it("should not go below page 1", () => {
      renderWithProviders(<TaskItemList />);

      const prevButton = screen.getAllByRole("button")[1];
      fireEvent.click(prevButton);

      // Should still be page 1
      expect(mockStoreState.setPageNotCompleted).toHaveBeenCalledWith(1);
    });

    it("should not exceed max pages", () => {
      (useTaskStore as unknown as jest.Mock).mockReturnValue({
        ...mockStoreState,
        numberOfPagesNotCompleted: 2,
        pageNotCompleted: 2,
      });

      renderWithProviders(<TaskItemList />);

      const nextButton = screen.getAllByRole("button")[2];
      fireEvent.click(nextButton);

      // Should still be page 2
      expect(mockStoreState.setPageNotCompleted).toHaveBeenCalledWith(2);
    });
  });
});
