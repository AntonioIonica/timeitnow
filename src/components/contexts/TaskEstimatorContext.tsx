"use client";

import React, { createContext, useContext, useState } from "react";

type TaskEstimatorContextType = {
  estimatedTime: string;
  setEstimatedTime: (time: string) => void;
};

const TaskEstimatorContext = createContext<TaskEstimatorContextType>({
  estimatedTime: "",
  setEstimatedTime: () => {},
});

export function TaskEstimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [estimatedTime, setEstimatedTime] = useState("");

  return (
    <TaskEstimatorContext.Provider value={{ estimatedTime, setEstimatedTime }}>
      {children}
    </TaskEstimatorContext.Provider>
  );
}

export const useTaskEstimation = () => useContext(TaskEstimatorContext);
