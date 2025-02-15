"use client";

interface ProgressBarProps {
  totalTime: number;
  timeLeft: number;
}

function ProgressBar({ totalTime, timeLeft }: ProgressBarProps) {
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="h-5 w-full overflow-hidden rounded-full bg-gray-200 md:h-4">
      <div
        className="duration-50 h-full bg-green-700 transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
export default ProgressBar;
