import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task } from "../types/task";

interface TaskState {
  tasksCompleted: Task[];
  tasksNotCompleted: Task[];
  pageCompleted: number;
  pageNotCompleted: number;
  numberOfPagesCompleted: number;
  numberOfPagesNotCompleted: number;
  setTasksCompleted: (tasks: Task[]) => void;
  setTasksNotCompleted: (tasks: Task[]) => void;
  setPageCompleted: (page: number) => void;
  setNumberOfPagesCompleted: (numberOfPages: number) => void;
  setPageNotCompleted: (page: number) => void;
  setNumberOfPagesNotCompleted: (numberOfPages: number) => void;
}

const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasksCompleted: [],
      tasksNotCompleted: [],
      pageCompleted: 1,
      pageNotCompleted: 1,
      numberOfPagesCompleted: 1,
      numberOfPagesNotCompleted: 1,
      setTasksCompleted: (tasks) => set(() => ({ tasksCompleted: tasks })),
      setTasksNotCompleted: (tasks) => set(() => ({ tasksNotCompleted: tasks })),

      setPageCompleted: (page) => set(() => ({ pageCompleted: page })),
      setNumberOfPagesCompleted: (numberOfPages) => set(() => ({ numberOfPagesCompleted: numberOfPages })),
      setPageNotCompleted: (page) => set(() => ({ pageNotCompleted: page })),
      setNumberOfPagesNotCompleted: (numberOfPages) => set(() => ({ numberOfPagesNotCompleted: numberOfPages })),
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