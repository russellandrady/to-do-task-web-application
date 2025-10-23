"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTasksNotCompletedService } from "@/api/service";
import TaskItem from "./task-item";
import { Task } from "@/types/task";
import useTaskStore from "@/store/taskStore";
import { useEffect } from "react";

const NotCompletedTaskList = () => {
  const { tasksNotCompleted, pageNotCompleted } = useTaskStore();
  const {  isLoading, isError, refetch } = useQuery({
    enabled: tasksNotCompleted.length === 0,
    queryKey: ["tasksNotCompleted", pageNotCompleted],
    queryFn: () => fetchTasksNotCompletedService(pageNotCompleted),
  });

  if (isLoading) {
    return <div>Loading not completed tasks...</div>;
  }

  if (isError) {
    return <div>Failed to load not completed tasks.</div>;
  }

  return (
    <div className="space-y-4">
      {tasksNotCompleted.length > 0 ? (
        tasksNotCompleted.map((task: Task) => (
          <TaskItem
            key={task.id}
            title={task.title}
            description={task.description}
            id={task.id}
            completed={task.completed}
          />
        ))
      ) : (
        <div>No not completed tasks to display</div>
      )}
    </div>
  );
};

export default NotCompletedTaskList;