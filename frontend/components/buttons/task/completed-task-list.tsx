"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTasksCompletedService } from "@/api/service";
import TaskItem from "./task-item";
import { Task } from "@/types/task";
import useTaskStore from "@/store/taskStore";
import { useEffect } from "react";

const CompletedTaskList = () => {
  const { tasksCompleted, pageCompleted } = useTaskStore();
  const { isLoading, isError, refetch } = useQuery({
    enabled: tasksCompleted.length == 0,
    queryKey: ["tasksCompleted", pageCompleted],
    queryFn: () => fetchTasksCompletedService(pageCompleted),
  });

  if (isLoading) {
    return <div>Loading completed tasks...</div>;
  }

  if (isError) {
    return <div>Failed to load completed tasks.</div>;
  }

  return (
    <div className="space-y-4">
      {tasksCompleted.length > 0 ? (
        tasksCompleted.map((task: Task) => (
          <TaskItem
            key={task.id}
            title={task.title}
            description={task.description}
            id={task.id}
            completed={task.completed}
          />
        ))
      ) : (
        <div>No completed tasks to display</div>
      )}
    </div>
  );
};

export default CompletedTaskList;