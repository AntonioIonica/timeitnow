"use client";

import { useCallback, useEffect, useState } from "react";
const DailyStreak = dynamic(() => import("@/components/streak/DailyStreak"), {
  ssr: false,
});
import { Button } from "@/components/ui/button";
import { useBackground } from "@/components/Background";
import TaskEstimator from "@/components/AI/TaskEstimator";
import { useTaskEstimation } from "@/components/contexts/TaskEstimatorContext";
import { useSounds } from "@/components/hooks/useSounds";
import dynamic from "next/dynamic";

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

export default function Home() {
  const { tasks, activeTaskIndex, completeTask } = useTaskEstimation();
  const activeTask =
    activeTaskIndex !== null && tasks[activeTaskIndex]
      ? tasks[activeTaskIndex]
      : null;
  const estimatedTime = activeTask ? activeTask.estimatedTime : 0;

  const { deploySound, clickSound, successSound, typingSound, warningSound } =
    useSounds();
  const { changeBackground } = useBackground();

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

  const playSound = useCallback(
    (sound: HTMLAudioElement | null) => {
      if (!isMuted && sound) {
        sound.currentTime = 0;
        sound.play();
      }
    },
    [isMuted],
  );

  useEffect(() => {
    if (estimatedTime && estimatedTime > 0) {
      const totalSeconds = parseInt(String(estimatedTime));

      setIsRunning(false);

      if (!isNaN(totalSeconds) && totalSeconds > 0) {
        if (totalSeconds < WORK_DURATION) {
          setTotalSessions(1);
          setTimeLeft(totalSeconds);
          setTotalTimeLeft(totalSeconds);
        } else {
          const numberOfSessions = Math.ceil(totalSeconds / WORK_DURATION);
          setTotalSessions(numberOfSessions);
          setTimeLeft(WORK_DURATION);
          setTotalTimeLeft(totalSeconds);
        }
      }
    } else {
      setTotalSessions(1);
      setTimeLeft(WORK_DURATION);
      setTotalTimeLeft(WORK_DURATION);
      setIsRunning(false);
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
      const firstSessionDuration = Math.min(WORK_DURATION, totalSeconds);
      // Compute total sessions for display purposes
      setTotalSessions(
        totalSeconds < WORK_DURATION
          ? 1
          : Math.ceil(totalSeconds / WORK_DURATION),
      );
      // Reset both timer counts to the full initial estimated time.
      setTimeLeft(firstSessionDuration);
      setTotalTimeLeft(totalSeconds);
    } else {
      setTimeLeft(WORK_DURATION);
      setTotalTimeLeft(WORK_DURATION);
    }
    playSound(warningSound);
  }, [estimatedTime, playSound, warningSound]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        // possible sync timing
        setTimeLeft((prev) => Math.max(0, prev - 1));
        setTotalTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      if (totalTimeLeft === 0) {
        playSound(successSound);
        completeTask();
        if (!isBreak) {
          setDailyStreak((prev) => prev + 1);
        }
        setIsRunning(false);
        handleReset();
        return;
      }

      playSound(successSound);

      if (estimatedTime < WORK_DURATION) {
        setIsRunning(false);
        handleReset();
        return;
      }

      if (isBreak) {
        setIsBreak(false);
        if (currentSession < totalSessions) {
          const remainingSeconds = totalTimeLeft; // could add - BREAK_DURATION
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
        setTimeLeft(BREAK_DURATION);
        setIsBreak(true);
        changeBackground();
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
    successSound,
    completeTask,
  ]);

  function handleToggleMute() {
    setIsMuted((prev) => !prev);
  }

  function formatTime(seconds: number) {
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
    <div className="relative box-border min-h-screen">
      <div className="relative z-10 min-h-screen">
        <div className="flex h-screen w-screen flex-col space-y-4 md:flex-row">
          <Button
            onClick={() => {
              handleToggleMute();
              if (isMuted && deploySound) deploySound.play();
            }}
            // className="absolute right-5 top-5 rounded-lg bg-white/30 px-4 py-3 text-3xl font-medium text-black shadow-md backdrop-blur-sm hover:bg-white/40"
            className="absolute right-1 top-1 rounded-xl bg-white/30 px-[1px] py-[1px] text-2xl shadow-md backdrop-blur-sm md:right-5 md:top-5 md:px-4 md:py-6"
            aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? "🔇" : "🔊"}
          </Button>

          {/* Left Section: occupies 1/4 of screen width */}
          <section className="flex w-full flex-shrink-0 items-center justify-center text-border md:w-1/4">
            <div className="relative mx-10 w-full">
              <div className="text-5xl text-border text-slate-100">
                <TaskEstimator />
              </div>
            </div>
          </section>

          {/* Center Section - Pomodoro Timer */}
          <section className="flex w-full flex-col items-center justify-center md:w-1/2">
            <div className="flex w-4/5 flex-col items-center justify-center rounded-3xl bg-white/20 p-10 backdrop-blur-sm">
              <h1 className="mb-7 text-5xl font-bold text-slate-100">
                Pomodoro timer
              </h1>
              {estimatedTime > 1 &&
                totalTimeLeft >= WORK_DURATION &&
                totalSessions > 1 && (
                  <div className="mb-4 text-xl text-slate-100">
                    Session {currentSession} of {totalSessions}
                  </div>
                )}
              <div className="py-3 text-lg font-bold text-slate-100 underline">
                {isBreak ? "( Break Time )" : "( Work Time )"}
              </div>
              {/* {estimatedTime > 1 &&
                totalTimeLeft >= WORK_DURATION &&
                totalSessions > 1 && (
                  <div className="mb-4 text-lg text-slate-100">
                    Total Time Remaining: {formatTotalTime(totalTimeLeft)}
                  </div>
                )} */}
              <div
                className={`mb-6 font-mono text-8xl ${isBreak ? "text-slate-100" : "text-slate-100"}`}
              >
                {formatTime(timeLeft)}
              </div>
              <Button
                type="button"
                disabled={isRunning}
                onClick={handleStart}
                variant="ghost"
                className="mb-5 w-[40%] px-6 py-2 text-2xl font-medium text-slate-100 shadow-md"
              >
                START
              </Button>

              <div className="flex w-[40%] flex-col items-center justify-between md:flex-row">
                <Button
                  className="mb-5 w-full rounded-lg px-6 py-2 text-2xl font-medium text-slate-100 shadow-md md:w-[48%]"
                  onClick={handlePause}
                  variant="ghost"
                  type="button"
                  disabled={!isRunning}
                >
                  PAUSE
                </Button>
                <Button
                  onClick={handleReset}
                  type="button"
                  variant="ghost"
                  className="mb-5 w-full rounded-lg px-6 py-2 text-2xl font-medium text-slate-100 shadow-md md:w-[48%]"
                >
                  RESET
                </Button>
              </div>
            </div>
          </section>

          {/* Right Section - Daily Streak */}
          <section className="flex w-full flex-shrink-0 items-center justify-center text-border md:w-1/4">
            <div className="relative mx-10 w-full">
              <div className="flex flex-col items-center justify-center rounded-3xl bg-white/20 p-8 backdrop-blur-sm">
                <div className="max-w-md">
                  <DailyStreak dailyStreak={dailyStreak} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
