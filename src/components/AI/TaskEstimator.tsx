"use client";

import React, { useState } from "react";
import { useTaskEstimation } from "../contexts/TaskEstimatorContext";
import TaskRow from "./TaskRow";
import { useSounds } from "../hooks/useSounds";

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
  const { typingSound } = useSounds();

  const handleEstimate = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const estimatedTime: number = parseInt(data.estimatedTime) || 0;

      if (estimatedTime > 0) {
        if (typingSound) {
          typingSound.currentTime = 0;
          typingSound.play();
        }
      }

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
    <div className="relative w-full rounded-2xl bg-white/20 p-6 shadow-md backdrop-blur-sm">
      <span className="transformation absolute -left-5 -top-2 -rotate-12 rounded-xl bg-white/30 px-2 text-lg font-semibold text-blue-500 backdrop-blur-sm duration-75 hover:-rotate-6 hover:scale-105">
        Powered by AI
      </span>
      <h2 className="mb-4 text-2xl font-bold text-slate-100">
        Task scheduler:
      </h2>
      {/* Input area for new task */}
      <form
        onSubmit={handleEstimate}
        className="mb-6 flex flex-row items-center justify-between"
      >
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="New Task..."
          className="font-sm h-[2rem] w-[80%] rounded px-2 text-sm text-gray-700"
        />
        <button
          type="submit"
          className="text-lg disabled:opacity-50"
          disabled={loading}
          aria-label="Add task"
        >
          {!loading ? "➕" : "🔃"}
        </button>
      </form>
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
