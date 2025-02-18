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

function getStoredTasks(): Task[] {
  try {
    const storedTask = localStorage.getItem("tasks");
    return storedTask ? JSON.parse(storedTask) : [];
  } catch (error) {
    console.error("Failing to get any task", error);
    return [];
  }
}

function setStoredTask(tasks: Task[]) {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save the task", error);
  }
}

export function getStoredActiveIndex(): number | null {
  try {
    const storedActiveIndex = localStorage.getItem("activeIndex");
    return storedActiveIndex ? JSON.parse(storedActiveIndex) : null;
  } catch (error) {
    console.error("Failed to get the active index", error);
    return null;
  }
}

function setStoredActiveIndex(index: number | null) {
  try {
    localStorage.setItem("activeIndex", JSON.stringify(index));
  } catch (error) {
    console.error("Failed to set the active index", error);
  }
}

export function TaskEstimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasks, setTasks] = useState<Task[]>(getStoredTasks());
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(
    getStoredActiveIndex(),
  );

  const addTask = (task: Omit<Task, "completed">) => {
    const newTask = { ...task, completed: false };
    const newTasks = [...tasks, newTask];
    setStoredTask(newTasks);
    setTasks(newTasks);

    if (activeTaskIndex === null) {
      setActiveTaskIndex(0);
      setStoredActiveIndex(0);
    }
  };

  const completeTask = () => {
    if (activeTaskIndex === null) return;

    const storedTasks = tasks.map((task, index) =>
      index === activeTaskIndex ? { ...task, completed: true } : task,
    );
    setTasks(storedTasks);
    setStoredTask(storedTasks);

    setActiveTaskIndex((prev) => {
      if (prev === null) return null;
      const nextIndex = prev + 1;
      setStoredActiveIndex(nextIndex);
      return nextIndex < tasks.length ? nextIndex : tasks.length;
    });
  };

  const deleteTask = (id: number) => {
    setTasks((prevTasks) => {
      const deletedIndex = prevTasks.findIndex((task) => task.id === id);
      const newTasks = prevTasks.filter((task) => task.id !== id);
      setStoredTask(newTasks);

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
      setStoredActiveIndex(newActiveIndex);
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
