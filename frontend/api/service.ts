import { apiGET, apiPATCH, apiPOST } from "./apiManager";
import type { TaskBase } from "../types/task";
import useTaskStore from "@/store/taskStore";
import { toast } from "sonner";

export const createTaskService = async (newTask: TaskBase) => {
  const data = await apiPOST("/tasks", newTask);
  const { setNotCompletedTasksData } = useTaskStore.getState();
  setNotCompletedTasksData(data.tasks, data.page, data.totalPages);
  toast.success("Task created successfully");
  return data.tasks;
};

export const fetchTasksCompletedService = async (page: number) => {
  const data = await apiGET(`/tasks/completed?page=${page}`);
  const { setCompletedTasksData } = useTaskStore.getState();
  setCompletedTasksData(data.tasks, data.page, data.totalPages);
  return data.tasks;
};

export const fetchTasksNotCompletedService = async (page: number) => {
  const data = await apiGET(`/tasks/not-completed?page=${page}`);
  const { setNotCompletedTasksData } = useTaskStore.getState();
  setNotCompletedTasksData(data.tasks, data.page, data.totalPages);
  return data.tasks;
};

export const markTaskAsCompletedService = async (taskId: number) => {
  const data = await apiPATCH(`/tasks/${taskId}`, {});
  const { setCompletedTasksData, setNotCompletedTasksData } = useTaskStore.getState();
  setNotCompletedTasksData(data.tasks, data.page, data.totalPages);
  setCompletedTasksData([], 1, 1);
  toast.success("Task marked as completed");
  return data.tasks;
};