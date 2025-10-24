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

  //handling functions
  const handlePageChange = (direction: "prev" | "next") => {
    if (showCompleted) {
      const newPage =
        direction === "prev"
          ? Math.max(pageCompleted - 1, 1)
          : Math.min(pageCompleted + 1, numberOfPagesCompleted);
      setPageCompleted(newPage);
    } else {
      const newPage =
        direction === "prev"
          ? Math.max(pageNotCompleted - 1, 1)
          : Math.min(pageNotCompleted + 1, numberOfPagesNotCompleted);
      setPageNotCompleted(newPage);
    }
  };
  return (
    <div className="items-start">
      {/* Toggle Button */}
      <div className="flex justify-between items-center mb-4">
        {/* Left Section: Text and Toggle Button */}
        <div className="flex items-center gap-4">
          <span className="text-lg text-foreground font-semibold">
            {showCompleted ? "Completed Tasks" : "Tasks to Complete"}
          </span>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-foreground text-xs underline hover:no-underline transition"
          >
            {showCompleted ? "Show Not Completed" : "Show Completed"}
          </button>
        </div>
        {/* Right Section: Pagination */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange("prev")}
            className="px-2 py-1"
          >
            <ArrowBigLeft className="h-4 w-4 text-foreground hover:text-lavender-500" />
          </button>
          <span className="text-xs text-foreground">
            Page {showCompleted ? pageCompleted : pageNotCompleted} of{" "}
            {showCompleted ? numberOfPagesCompleted : numberOfPagesNotCompleted}
          </span>
          <button
            onClick={() => handlePageChange("next")}
            className="px-2 py-1 "
          >
            <ArrowBigRight className="h-4 w-4 text-foreground hover:text-lavender-500" />
          </button>
        </div>
      </div>
      {showCompleted ? <CompletedTaskList /> : <NotCompletedTaskList />}
    </div>
  );
};

export default TaskItemList;
