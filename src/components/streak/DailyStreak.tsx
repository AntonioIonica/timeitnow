interface DailyStreakProps {
  dailyStreak: number;
}

function DailyStreak({ dailyStreak }: DailyStreakProps) {
  return (
    <div className="mb-2 text-5xl font-medium text-border text-slate-300">
      Daily Streak: {dailyStreak}
    </div>
  );
}
export default DailyStreak;
