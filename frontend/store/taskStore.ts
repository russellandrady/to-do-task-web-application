import { create } from "zustand";
import type { Task } from "../types/task";

interface TaskState {
  tasks: Task[];
  page: number;
  numberOfPages: number;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  setPage: (page: number) => void;
  setNumberOfPages: (numberOfPages: number) => void;
}

const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  page: 1,
  numberOfPages: 1,
  setTasks: (tasks) => set(() => ({ tasks })),
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  setPage: (page) => set(() => ({ page })),
  setNumberOfPages: (numberOfPages) => set(() => ({ numberOfPages })),
}));

export default useTaskStore;