import { apiPOST } from "./apiManager";
import type { Task } from "../types/task";

export const createTaskService = async (newTask: Task) => {
  return await apiPOST("/tasks", newTask);
};