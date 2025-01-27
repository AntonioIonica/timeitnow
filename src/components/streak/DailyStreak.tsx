interface DailyStreakProps {
  dailyStreak: number;
}

function DailyStreak({ dailyStreak }: DailyStreakProps) {
  return (
    <div className="text-border mb-2 text-5xl font-medium text-green-500">
      Daily Streak: {dailyStreak}
    </div>
  );
}
export default DailyStreak;
