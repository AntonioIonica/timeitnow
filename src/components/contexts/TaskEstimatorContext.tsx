"use client";

import React, { createContext, useContext, useState } from "react";
import { Task } from "../AI/TaskEstimator";

type TaskEstimatorContextType = {
  tasks: Task[];
  activeTaskIndex: number | null;
  addTask: (task: Omit<Task, "completed">) => void;
  completeTask: () => void;
  deleteTask: (id: number) => void;
};

const TaskEstimatorContext = createContext<TaskEstimatorContextType>({
  tasks: [],
  activeTaskIndex: null,
  addTask: () => {},
  completeTask: () => {},
  deleteTask: () => {},
});

export function TaskEstimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);

  const addTask = (task: Omit<Task, "completed">) => {
    const newTask = { ...task, completed: false };
    setTasks((prev) => [...prev, newTask]);

    if (activeTaskIndex === null) {
      setActiveTaskIndex(0);
    }
  };

  const completeTask = () => {
    if (activeTaskIndex === null) return;

    setTasks((prev) =>
      prev.map((task, index) =>
        index === activeTaskIndex ? { ...task, completed: true } : task,
      ),
    );

    setActiveTaskIndex((prev) => {
      if (prev === null) return null;
      const nextIndex = prev + 1;
      return nextIndex < tasks.length ? nextIndex : tasks.length;
    });
  };

  const deleteTask = (id: number) => {
    setTasks((prevTasks) => {
      const deletedIndex = prevTasks.findIndex((task) => task.id === id);
      const newTasks = prevTasks.filter((task) => task.id !== id);

      let newActiveIndex = activeTaskIndex;
      if (newTasks.length === 0) {
        newActiveIndex = null;
      } else if (activeTaskIndex !== null) {
        if (deletedIndex < activeTaskIndex) {
          newActiveIndex = activeTaskIndex - 1;
        } else if (deletedIndex === activeTaskIndex) {
          newActiveIndex =
            activeTaskIndex >= newTasks.length
              ? newTasks.length - 1
              : activeTaskIndex;
        }
      }
      setActiveTaskIndex(newActiveIndex);
      return newTasks;
    });
  };

  return (
    <TaskEstimatorContext.Provider
      value={{ tasks, activeTaskIndex, addTask, completeTask, deleteTask }}
    >
      {children}
    </TaskEstimatorContext.Provider>
  );
}

export const useTaskEstimation = () => useContext(TaskEstimatorContext);
