import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task } from "../types/task";

interface TaskState {
  tasksCompleted: Task[];
  tasksNotCompleted: Task[];
  page: number;
  numberOfPages: number;
  setTasksCompleted: (tasks: Task[]) => void;
  setTasksNotCompleted: (tasks: Task[]) => void;
  setPage: (page: number) => void;
  setNumberOfPages: (numberOfPages: number) => void;
}

const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasksCompleted: [],
      tasksNotCompleted: [],
      page: 1,
      numberOfPages: 1,
      setTasksCompleted: (tasks) => set(() => ({ tasksCompleted: tasks })),
      setTasksNotCompleted: (tasks) => set(() => ({ tasksNotCompleted: tasks })),

      setPage: (page) => set(() => ({ page })),
      setNumberOfPages: (numberOfPages) => set(() => ({ numberOfPages })),
    }),
    {
      name: "task-store",
      partialize: (state) => ({
        tasksCompleted: state.tasksCompleted,
        tasksNotCompleted: state.tasksNotCompleted,
      }),
    }
  )
);

export default useTaskStore;