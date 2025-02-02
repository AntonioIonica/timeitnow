"use client";

import React, { useState } from "react";
import { useTaskEstimation } from "../contexts/TaskEstimatorContext";
import TaskRow from "./TaskRow";

export interface Task {
  id: number;
  text: string;
  estimatedTime: number; // in seconds
  completed: boolean;
}

export default function TaskEstimator() {
  const [taskInput, setTaskInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { tasks, activeTaskIndex, addTask, completeTask, deleteTask } =
    useTaskEstimation();

  const handleEstimate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    setLoading(true);

    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: taskInput,
        }),
      };

      const response = await fetch("/api/estimate-time", options);

      const data = await response.json();
      const estimatedTime: number = data.estimatedTime || 0;
      addTask({
        id: Date.now(),
        text: taskInput,
        estimatedTime,
      });
      setTaskInput("");
    } catch (error) {
      console.error("Error estimating time", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-2xl bg-white/20 p-6 shadow-md backdrop-blur-sm">
      <h2 className="mb-4 text-xl font-bold text-slate-100">
        -AI tasks time estimator:
      </h2>
      {/* Input area for new task */}
      <div className="mb-6 flex flex-row items-center justify-between">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Task..."
          className="font-sm h-[2rem] w-[80%] rounded px-2 text-sm text-gray-700"
        />
        <button
          type="submit"
          onClick={handleEstimate}
          className="text-lg disabled:opacity-50"
          disabled={loading}
        >
          {!loading ? "➕" : "🔃"}
        </button>
      </div>
      {/* Scheduled task list */}
      {tasks.length > 0 && (
        <div className="space-y-2 text-sm">
          {tasks.map((task, index) => (
            <TaskRow
              key={task.id}
              task={task}
              isActive={index === activeTaskIndex}
              completed={index < (activeTaskIndex ?? 0)}
              onComplete={completeTask}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
