interface DailyStreakProps {
  dailyStreak: number;
}

function DailyStreak({ dailyStreak }: DailyStreakProps) {
  return (
    <div className="mb-2 text-4xl font-medium text-border text-slate-200">
      Daily Streak:
      <br />
      <span className="flex items-center justify-center pt-3">
        {dailyStreak}
      </span>
      <br />
      <span className="flex items-center justify-center">
        {new Date().toLocaleDateString()}
      </span>
    </div>
  );
}
export default DailyStreak;
