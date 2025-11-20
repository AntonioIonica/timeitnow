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

// Get all the tasks from local storage
function getStoredTasks(): Task[] {
  try {
    let storedTask = null;
    if (typeof window !== "undefined") {
      storedTask = localStorage.getItem("tasks");
      if (storedTask === "undefined") return [];
    }

    return storedTask ? JSON.parse(storedTask) : [];
  } catch (error) {
    console.error("Failing to get any task", error);
    return [];
  }
}

// set the tasks in local storage
function setStoredTask(tasks: Task[]) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  } catch (error) {
    console.error("Failed to save the task", error);
  }
}

// gets the index of active task (first) from the local storage
export function getStoredActiveIndex(): number | null {
  try {
    let storedActiveIndex = null;
    if (typeof window !== "undefined") {
      storedActiveIndex = localStorage.getItem("activeIndex");
      if (storedActiveIndex === "undefined") return null;
    }

    return storedActiveIndex ? JSON.parse(storedActiveIndex) : null;
  } catch (error) {
    console.error("Failed to get the active index", error);
    return null;
  }
}

// save the index of active task in local storage
function setStoredActiveIndex(index: number | null) {
  try {
    if (typeof window !== "undefined")
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
    const newTask = { ...task, completed: false }; // add a new task
    const newTasks = [...tasks, newTask]; // add the task in the array

    setStoredTask(newTasks);
    setTasks(newTasks);

    if (activeTaskIndex === null) {
      setActiveTaskIndex(0);
      setStoredActiveIndex(0);
    }
  };

  const completeTask = () => {
    if (activeTaskIndex === null) return;

    // Set the task attribute as complete
    const storedTasks = tasks.map((task, index) =>
      index === activeTaskIndex ? { ...task, completed: true } : task,
    );
    setTasks(storedTasks); // save the task
    setStoredTask(storedTasks); // set the task in localstorage

    // when a task is completed, the active tasks index is incremented so the next task becomes active
    setActiveTaskIndex((prev) => {
      if (prev === null) return null;

      const nextIndex = prev + 1; // next task becomes active
      setStoredActiveIndex(nextIndex); // move the active task to the next one by index
      return nextIndex < tasks.length ? nextIndex : tasks.length; // index or end
    });
  };

  const deleteTask = (id: number) => {
    setTasks((prevTasks) => {
      const deletedIndex = prevTasks.findIndex((task) => task.id === id); // get the task to be deleted
      const newTasks = prevTasks.filter((task) => task.id !== id); // deleting the task from array tasks
      setStoredTask(newTasks);

      // change the active task by index
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
