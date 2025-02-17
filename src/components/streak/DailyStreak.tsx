"use client";

import { useEffect, useState } from "react";

interface DailyStreakProps {
  dailyStreak: number;
}

function DailyStreak({ dailyStreak }: DailyStreakProps) {
  const [bestStreak, setBestStreak] = useState<number>(0);

  useEffect(() => {
    const savedStreak = Number(localStorage.getItem("bestStreak")) || 0;

    if (savedStreak < dailyStreak) {
      localStorage.setItem("bestStreak", String(dailyStreak));
      setBestStreak(dailyStreak);
    } else {
      setBestStreak(savedStreak);
    }

    const today = new Date().toDateString();
    const lastSavedStreak = localStorage.getItem("lastSavedStreak");

    if (today === lastSavedStreak) return;

    localStorage.setItem("lastSavedStreak", today);
    localStorage.setItem("bestStreak", String(savedStreak));
    setBestStreak(savedStreak);
  }, [dailyStreak]);

  return (
    <div className="mb-2 text-4xl font-medium text-border text-slate-200">
      Today streak:
      <br />
      <span className="flex items-center justify-center py-4">
        {dailyStreak}🔥
      </span>
      Best streak:
      <br />
      <span className="flex items-center justify-center pt-4">
        {bestStreak}🔥
      </span>
    </div>
  );
}
export default DailyStreak;
