import { apiGET, apiPATCH, apiPOST } from "./apiManager";
import type { TaskBase } from "../types/task";
import useTaskStore from "@/store/taskStore";

export const createTaskService = async (newTask: TaskBase) => {
  const data = await apiPOST("/tasks", newTask);
  const { setTasksNotCompleted, setPageNotCompleted, setNumberOfPagesNotCompleted } = useTaskStore.getState();
  setTasksNotCompleted(data.tasks);
  setPageNotCompleted(data.page);
  setNumberOfPagesNotCompleted(data.totalPages);
  return data.tasks;
};

export const fetchTasksCompletedService = async (page: number) => {
  const data = await apiGET(`/tasks/completed?page=${page}`);
  const { setTasksCompleted, setPageCompleted, setNumberOfPagesCompleted } = useTaskStore.getState();
  setTasksCompleted(data.tasks);
  setPageCompleted(data.page);
  setNumberOfPagesCompleted(data.totalPages);
  return data.tasks;
};

export const fetchTasksNotCompletedService = async (page: number) => {
  const data = await apiGET(`/tasks/not-completed?page=${page}`);
  const { setTasksNotCompleted, setPageNotCompleted, setNumberOfPagesNotCompleted } = useTaskStore.getState();
  setTasksNotCompleted(data.tasks);
  setPageNotCompleted(data.page);
  setNumberOfPagesNotCompleted(data.totalPages);
  return data.tasks;
};

export const markTaskAsCompletedService = async (taskId: number) => {
  const data = await apiPATCH(`/tasks/${taskId}`, {});
  const { setTasksCompleted, setTasksNotCompleted, setPageNotCompleted, setNumberOfPagesNotCompleted, setPageCompleted, setNumberOfPagesCompleted } = useTaskStore.getState();
  setTasksNotCompleted(data.tasks);
  setPageNotCompleted(data.page);
  setNumberOfPagesNotCompleted(data.totalPages);
  setTasksCompleted([]);
  setPageCompleted(1);
  setNumberOfPagesCompleted(1);
  return data.tasks;
};