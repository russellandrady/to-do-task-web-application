import { apiGET, apiPATCH, apiPOST } from "./apiManager";
import type { TaskBase } from "../types/task";
import useTaskStore from "@/store/taskStore";

export const createTaskService = async (newTask: TaskBase) => {
  const data = await apiPOST("/tasks", newTask);
  const { setTasksNotCompleted } = useTaskStore.getState();
  setTasksNotCompleted([]);
  return data;
};

export const fetchTasksCompletedService = async () => {
  const data = await apiGET("/tasks/completed");
  const { setTasksCompleted } = useTaskStore.getState();
  setTasksCompleted(data.tasks);
  return data.tasks;
};

export const fetchTasksNotCompletedService = async () => {
  const data = await apiGET("/tasks/not-completed");
  const { setTasksNotCompleted } = useTaskStore.getState();
  setTasksNotCompleted(data.tasks);
  return data.tasks;
};

export const markTaskAsCompletedService = async (taskId: number) => {
  const data = await apiPATCH(`/tasks/${taskId}`, {});
  const { setTasksCompleted, setTasksNotCompleted } = useTaskStore.getState();
  setTasksNotCompleted([]);
  setTasksCompleted([]);
  return data;
};