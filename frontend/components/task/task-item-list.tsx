"use client";

import { useState } from "react";
import CompletedTaskList from "./completed-task-list";
import NotCompletedTaskList from "./not-completed-task-list";
import useTaskStore from "@/store/taskStore";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

const TaskItemList = () => {
  const [showCompleted, setShowCompleted] = useState(false);
  const {
    pageCompleted,
    setPageCompleted,
    pageNotCompleted,
    setPageNotCompleted,
    numberOfPagesCompleted,
    numberOfPagesNotCompleted,
  } = useTaskStore();
  return (
    <div className="items-start">
      {/* Toggle Button */}
      <div className="flex justify-between items-center mb-4">
        {/* Left Section: Text and Toggle Button */}
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">
            {showCompleted ? "Completed Tasks" : "Tasks to Complete"}
          </span>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-black text-xs underline hover:no-underline transition"
          >
            {showCompleted ? "Show Not Completed" : "Show Completed"}
          </button>
        </div>

        {/* Right Section: Pagination */}
        <div className="flex items-center gap-2">
          <button
            onClick={
              () =>
                showCompleted
                  ? setPageCompleted(Math.max(pageCompleted - 1, 1)) // Decrease page for completed tasks
                  : setPageNotCompleted(Math.max(pageNotCompleted - 1, 1)) // Decrease page for not completed tasks
            }
            className="px-2 py-1"
          >
            <ArrowBigLeft className="h-4 w-4 hover:text-lavender-500" />
          </button>
          <span className="text-xs">
            Page {showCompleted ? pageCompleted : pageNotCompleted} of{" "}
            {showCompleted ? numberOfPagesCompleted : numberOfPagesNotCompleted}
          </span>
          <button
            onClick={
              () =>
                showCompleted
                  ? setPageCompleted(
                      Math.min(pageCompleted + 1, numberOfPagesCompleted)
                    ) // Increase page for completed tasks
                  : setPageNotCompleted(
                      Math.min(pageNotCompleted + 1, numberOfPagesNotCompleted)
                    ) // Increase page for not completed tasks
            }
            className="px-2 py-1"
          >
            <ArrowBigRight className="h-4 w-4 hover:text-lavender-500" />
          </button>
        </div>
      </div>

      {/* Render the appropriate task list */}
      {showCompleted ? <CompletedTaskList /> : <NotCompletedTaskList />}
    </div>
  );
};

export default TaskItemList;
