"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clickSound,
  deploySound,
  successSound,
  typingSound,
  warningSound,
} from "./lib/helpers";
import DailyStreak from "@/components/streak/DailyStreak";
import { Button } from "@/components/ui/button";
import { useBackground } from "@/components/Background";
import TaskEstimator from "@/components/AI/TaskEstimator";
import { useTaskEstimation } from "@/components/contexts/TaskEstimatorContext";

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

export default function Home() {
  const { tasks, activeTaskIndex } = useTaskEstimation();
  const activeTask =
    activeTaskIndex !== null && tasks[activeTaskIndex]
      ? tasks[activeTaskIndex]
      : null;
  const estimatedTime = activeTask ? activeTask.estimatedTime : 0;

  const [totalSessions, setTotalSessions] = useState(1);
  const [currentSession, setCurrentSession] = useState(1);
  const [totalTimeLeft, setTotalTimeLeft] = useState(WORK_DURATION);

  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [dailyStreak, setDailyStreak] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedStreak = localStorage.getItem("dailyStreak");
      const lastUpdated = localStorage.getItem("lastUpdated");

      if (savedStreak && lastUpdated) {
        const now = new Date();
        const lastUpdatedDate = new Date(parseInt(lastUpdated));

        if (now.toDateString() !== lastUpdatedDate.toDateString()) {
          localStorage.removeItem("dailyStreak");
          localStorage.removeItem("lastUpdated");
          return 0;
        }

        return parseInt(savedStreak);
      }
      return 0;
    }
    return 0;
  });
  const { changeBackground } = useBackground();

  const playSound = useCallback(
    (sound: HTMLAudioElement) => {
      if (!isMuted) {
        sound.currentTime = 0;
        sound.play();
      }
    },
    [isMuted],
  );

  useEffect(() => {
    if (estimatedTime) {
      const totalSeconds = estimatedTime;

      if (!isNaN(totalSeconds) && totalSeconds > 0) {
        if (totalSeconds < WORK_DURATION) {
          setTotalSessions(1);
          setTimeLeft(totalSeconds);
          setTotalTimeLeft(totalSeconds);
          return;
        }

        const numberOfSessions = Math.ceil(totalSeconds / WORK_DURATION);
        setTotalSessions(numberOfSessions);
        setTimeLeft(WORK_DURATION);
        setTotalTimeLeft(totalSeconds);
      }
    } else {
      // No active task: reset the timer to the initial work duration.
      setTotalSessions(1);
      setTimeLeft(WORK_DURATION);
      setTotalTimeLeft(WORK_DURATION);
    }
  }, [estimatedTime]);

  useEffect(function () {
    if (typeof window !== "undefined") {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);

      const timeUntilMidnight = midnight.getTime() - now.getTime();
      const timeoutId = setTimeout(() => {
        setDailyStreak(0);
        localStorage.removeItem("dailyStreak");
        localStorage.removeItem("lastUpdated");
      }, timeUntilMidnight);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  useEffect(
    function () {
      if (typeof window !== "undefined") {
        localStorage.setItem("dailyStreak", dailyStreak.toString());
        localStorage.setItem("lastUpdated", new Date().getTime().toString());
      }
    },
    [dailyStreak],
  );

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    setCurrentSession(1);

    if (estimatedTime) {
      const totalSeconds = estimatedTime;
      // Compute total sessions for display purposes
      const numberOfSessions =
        totalSeconds < WORK_DURATION
          ? 1
          : Math.ceil(totalSeconds / WORK_DURATION);
      setTotalSessions(numberOfSessions);
      // Reset both timer counts to the full initial estimated time.
      setTimeLeft(totalSeconds);
      setTotalTimeLeft(totalSeconds);
    } else {
      setTimeLeft(WORK_DURATION);
      setTotalTimeLeft(WORK_DURATION);
    }
    playSound(warningSound);
  }, [estimatedTime, playSound]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setTotalTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      playSound(successSound);
      setDailyStreak((prev) => prev + 1);

      if (estimatedTime < WORK_DURATION) {
        handleReset();
        return;
      }

      if (isBreak) {
        setIsBreak(false);
        if (currentSession < totalSessions) {
          const remainingSeconds = totalTimeLeft - BREAK_DURATION;
          const nextSessionDuration =
            currentSession === totalSessions - 1
              ? remainingSeconds
              : Math.min(WORK_DURATION, remainingSeconds);

          setTimeLeft(nextSessionDuration);
          setCurrentSession((prev) => prev + 1);
        } else {
          handleReset();
        }
      } else {
        changeBackground();
        setIsBreak(true);
        setTimeLeft(BREAK_DURATION);
      }
    }

    return () => clearInterval(timer);
  }, [
    isRunning,
    timeLeft,
    isBreak,
    currentSession,
    totalSessions,
    totalTimeLeft,
    playSound,
    changeBackground,
    estimatedTime,
    handleReset,
  ]);

  function handleToggleMute() {
    setIsMuted((prev) => !prev);
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function formatTotalTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function handleStart() {
    setIsRunning(true);
    playSound(clickSound);
  }

  function handlePause() {
    setIsRunning(false);
    playSound(typingSound);
  }

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 min-h-screen">
        <div className="flex h-screen">
          {/* Left Section */}
          <section className="z-10 flex w-1/4 items-center justify-center p-8 text-border">
            <div className="max-w-md">
              <h1 className="text-5xl text-border text-slate-300">
                <button
                  type="button"
                  onClick={() => {
                    handleToggleMute();
                    if (isMuted) deploySound.play();
                  }}
                  className="absolute right-5 top-5 rounded-lg bg-white/30 px-4 py-3 text-3xl font-medium text-black shadow-md backdrop-blur-sm hover:bg-white/40"
                  aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>
                <TaskEstimator />
              </h1>
            </div>
          </section>

          {/* Center Section - Pomodoro Timer */}
          <section className="flex w-1/2 flex-col items-center justify-center">
            <div className="flex w-4/5 flex-col items-center justify-center rounded-3xl bg-white/20 p-8 backdrop-blur-sm">
              <h1 className="mb-7 text-5xl font-bold text-slate-300">
                Pomodoro Timer
              </h1>
              {totalSessions > 1 && (
                <div className="mb-4 text-xl text-slate-100">
                  Session {currentSession} of {totalSessions}
                  {isBreak ? " (Break)" : ""}
                </div>
              )}
              {totalTimeLeft > WORK_DURATION && (
                <div className="mb-4 text-lg text-slate-100">
                  Total Time Remaining: {formatTotalTime(totalTimeLeft)}
                </div>
              )}
              <div
                className={`mb-6 font-mono text-8xl ${isBreak ? "text-slate-200" : "text-slate-300"}`}
              >
                {formatTime(timeLeft)}
              </div>
              <Button
                type="button"
                disabled={isRunning}
                onClick={handleStart}
                className="mb-5 w-[40%] rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-2 text-2xl font-medium text-slate-200 shadow-md transition duration-300 hover:opacity-90"
              >
                Start
              </Button>

              <div className="flex w-[40%] flex-row items-center justify-between">
                <Button
                  className="mb-5 w-[48%] rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-2 text-2xl font-medium text-slate-200 shadow-md transition duration-300 hover:opacity-90"
                  onClick={handlePause}
                  type="button"
                  disabled={!isRunning}
                >
                  Pause
                </Button>
                <Button
                  onClick={handleReset}
                  type="button"
                  className="mb-5 w-[48%] rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-2 text-2xl font-medium text-slate-200 shadow-md transition duration-300 hover:opacity-90"
                >
                  Reset
                </Button>
              </div>
            </div>
          </section>

          {/* Right Section - Daily Streak */}
          <section className="flex w-1/4 items-center justify-center p-8">
            <div className="flex flex-col items-center justify-center rounded-3xl bg-white/20 p-8 backdrop-blur-sm">
              <div className="max-w-md">
                <DailyStreak dailyStreak={dailyStreak} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
