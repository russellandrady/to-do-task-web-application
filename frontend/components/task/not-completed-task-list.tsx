"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTasksNotCompletedService } from "@/api/service";
import TaskItem from "./task-item";
import { Task } from "@/types/task";
import useTaskStore from "@/store/taskStore";
import { useEffect } from "react";
import LoadingSpinner from "../loading/loading-spinner";
import LoadingThreeDotsPulse from "./completed-task-list";
import AnimatedWrapper from "../animation/animated-wrapper";

const NotCompletedTaskList = () => {
  const { tasksNotCompleted, pageNotCompleted } = useTaskStore();
  const {  isLoading, isError, refetch } = useQuery({
    queryKey: ["tasksNotCompleted", pageNotCompleted],
    queryFn: () => fetchTasksNotCompletedService(pageNotCompleted),
  });

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  if (isError) {
    return <div>Failed to load not completed tasks.</div>;
  }

  return (
    <div className="space-y-4 items-start">
      {tasksNotCompleted.length > 0 ? (
        tasksNotCompleted.map((task: Task) => (
          <AnimatedWrapper keyProp={task.id.toString()}>
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
        <div>No not completed tasks to display</div>
      )}
    </div>
  );
};

export default NotCompletedTaskList;