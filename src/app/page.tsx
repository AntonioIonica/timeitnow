"use client";

import MatrixBackground from "../components/MatrixBackground";
import { useCallback, useEffect, useState } from "react";
import {
  clickSound,
  deploySound,
  successSound,
  typingSound,
  warningSound,
} from "./lib/helpers";
import DailyStreak from "@/components/streak/DailyStreak";

const WORK_DURATION = 1 * 60;
const BREAK_DURATION = 1 * 60;

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(() => {
    if (typeof window !== "undefined") {
      const savedStreak = localStorage.getItem("dailyStreak");

      return savedStreak ? parseInt(savedStreak) : 0;
    }
    return 0;
  });

  function handleToggleMute() {
    setIsMuted((prev) => !prev);
  }

  const playSound = useCallback(
    (sound: HTMLAudioElement) => {
      if (!isMuted) sound.play();
    },
    [isMuted],
  );

  useEffect(function () {
    if (typeof window !== "undefined") {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);

      const timeUntilMidnight = midnight.getTime() - now.getTime();
      const timeoutId = setTimeout(() => {
        setDailyStreak(0);
        localStorage.removeItem("dailyStreak");
      }, timeUntilMidnight);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  useEffect(
    function () {
      if (typeof window !== "undefined") {
        localStorage.setItem("dailyStreak", dailyStreak.toString());
      }
    },
    [dailyStreak],
  );

  useEffect(
    function () {
      let timer: NodeJS.Timeout;

      if (isRunning && timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
      } else if (isRunning && timeLeft < 1) {
        playSound(successSound);
        clearInterval(timer);
        if (isBreak) {
          setIsBreak(false);
          setTimeLeft(WORK_DURATION);
          playSound(warningSound);
        } else {
          setIsBreak(true);
          setTimeLeft(BREAK_DURATION);
          setDailyStreak((prev) => prev + 1);
        }
      }
      return () => clearInterval(timer);
    },
    [isRunning, timeLeft, isBreak, playSound],
  );

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function handleReset() {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(WORK_DURATION);
  }

  return (
    <div className="relative min-h-screen">
      <MatrixBackground />
      <div className="relative z-10 min-h-screen">
        <div className="flex h-screen">
          {/* Left Section */}
          <section className="text-border z-10 flex w-1/4 items-center justify-center p-8">
            <div className="max-w-md text-gray-100">
              <h1 className="text-border text-5xl text-green-500">
                <button
                  type="button"
                  onClick={() => {
                    handleToggleMute();
                    if (isMuted) deploySound.play();
                  }}
                  className="absolute right-5 top-5 rounded-lg bg-green-600 px-4 py-3 text-4xl font-medium text-black shadow-md hover:bg-green-800"
                  aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>
                Settings
              </h1>
            </div>
          </section>

          {/* Center Section - Pomodoro Timer */}
          <section className="text-border flex w-1/2 flex-col items-center justify-center">
            <h1 className="mb-7 text-5xl font-bold text-green-500">
              Pomodoro Timer
            </h1>
            <div
              className={`mb-6 font-mono text-8xl ${isBreak ? "text-green-400" : "text-green-600"}`}
            >
              {formatTime(timeLeft)}
            </div>
            <div className="mb-4 text-2xl font-medium text-green-500">
              {isBreak ? "Break Time!" : "Focus Time"}
            </div>
            <button
              type="button"
              disabled={isRunning}
              onClick={() => {
                setIsRunning(true);
                clickSound.play();
              }}
              className="mb-5 w-[25%] rounded-lg bg-green-500 px-6 py-2 text-2xl font-medium text-black shadow-md hover:bg-green-600"
            >
              Start
            </button>
            <div className="flex w-[25%] flex-row items-center justify-between space-x-4">
              <button
                className="mb-5 w-[48%] rounded-lg bg-green-500 px-6 py-2 text-2xl font-medium text-black shadow-md hover:bg-green-600"
                onClick={() => {
                  typingSound.play();
                  setIsRunning(false);
                }}
                type="button"
              >
                Pause
              </button>
              <button
                onClick={() => {
                  warningSound.play();
                  handleReset();
                }}
                type="button"
                className="mb-5 w-[48%] rounded-lg bg-green-500 px-6 py-2 text-2xl font-medium text-black shadow-md hover:bg-green-600"
              >
                Reset
              </button>
            </div>
          </section>

          {/* Right Section - Daily Streak */}

          <section className="flex w-1/4 items-center justify-center p-8">
            <div className="items-center justify-center">
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
