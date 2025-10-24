"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTasksCompletedService } from "@/api/service";
import TaskItem from "./task-item";
import { Task } from "@/types/task";
import useTaskStore from "@/store/taskStore";
import { useEffect } from "react";
import LoadingSpinner from "../loading/loading-spinner";
import AnimatedWrapper from "../animation/animated-wrapper";

const CompletedTaskList = () => {
  const { tasksCompleted, pageCompleted } = useTaskStore();
  const { isLoading } = useQuery({
    queryKey: ["tasksCompleted", pageCompleted],
    queryFn: () => fetchTasksCompletedService(pageCompleted),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4 items-start">
      {tasksCompleted.length > 0 ? (
        tasksCompleted.map((task: Task) => (
          <AnimatedWrapper key={task.id.toString()} keyProp={task.id.toString()}>
            <TaskItem
              key={task.id}
              title={task.title}
              description={task.description}
              id={task.id}
              completed={task.completed}
            />
          </AnimatedWrapper>
        ))
      ) : (
        <div className="w-full flex items-center justify-center py-4">
          No tasks to complete
        </div>
      )}
    </div>
  );
};

export default CompletedTaskList;
