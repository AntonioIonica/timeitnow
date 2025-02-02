"use client";

import React, { useEffect, useRef } from "react";
import { Task } from "./TaskEstimator";

interface TaskRowProps {
  task: Task;
  isActive: boolean;
  completed: boolean;
  onComplete: () => void;
  onDelete: () => void;
}

export default function TaskRow({
  task,
  isActive,
  completed,
  onComplete,
  onDelete,
}: TaskRowProps) {
  const hasCompleted = useRef(false);

  useEffect(
    function () {
      if (isActive) {
        hasCompleted.current = false;
      }
    },
    [isActive],
  );

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && isActive && !hasCompleted.current) {
      hasCompleted.current = true;
      onComplete();
    }
  };

  return (
    <div
      className={`flex items-center justify-between rounded-xl p-4 ${
        hasCompleted.current
          ? "bg-green-600/50"
          : isActive
            ? "bg-slate-800/50"
            : "bg-gray-700/50"
      }`}
    >
      <div className="flex flex-row items-center space-x-2">
        <input
          type="checkbox"
          checked={completed}
          onChange={handleCheckboxChange}
          className="h-4 w-4"
          aria-label={`Mark task "${task.text}" as complete`}
          disabled={!isActive}
        />
        <div
          className={`text-md font-semibold text-slate-200 ${
            hasCompleted.current ? "line-through" : ""
          }`}
        >
          {task.text}
        </div>
      </div>
      {/* Right side: Delete button */}
      <button
        type="button"
        onClick={onDelete}
        className="rounded bg-red-500 px-2 py-1 text-sm text-white"
        aria-label={`Delete task ${task.text}`}
      >
        Delete
      </button>
    </div>
  );
}
