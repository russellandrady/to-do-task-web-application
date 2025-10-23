"use client";

import { useState } from "react";
import CompletedTaskList from "./completed-task-list";
import NotCompletedTaskList from "./not-completed-task-list";

const TaskItemList = () => {
  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <div>
      {/* Toggle Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {showCompleted ? "Show Not Completed" : "Show Completed"}
        </button>
      </div>

      {/* Render the appropriate task list */}
      {showCompleted ? <CompletedTaskList /> : <NotCompletedTaskList />}
    </div>
  );
};

export default TaskItemList;