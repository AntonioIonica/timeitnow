"use client";

import { useState } from "react";
import { useTaskEstimation } from "../contexts/TaskEstimatorContext";

export default function TaskEstimator() {
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const { setEstimatedTime } = useTaskEstimation();

  const handleEstimate = async () => {
    if (!task.trim()) return;

    setLoading(true);

    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: task,
        }),
      };

      const response = await fetch("/api/estimate-time", options);

      const data = await response.json();
      const time = data.estimatedTime || "Could not determine the time";
      setEstimatedTime(time);
    } catch (error) {
      console.error("Error estimating time", error);
      setEstimatedTime("Error retrieving estimate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold">AI Task Time Estimator</h2>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter your task..."
        className="w-full rounded border p-2"
      />
      <button
        type="button"
        onClick={handleEstimate}
        className="mt-3 rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Estimating..." : "Estimate Time"}
      </button>
    </div>
  );
}
