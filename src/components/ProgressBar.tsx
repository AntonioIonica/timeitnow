"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
  progress: number;
}

function ProgressBar({ progress }: ProgressBarProps) {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (progress < 100) {
      setWidth(progress);
    } else {
      setWidth(0);
    }
  }, [progress]);

  return (
    <div className="h-5 w-full overflow-hidden rounded-full bg-gray-200 md:h-4">
      <div
        className="h-full bg-green-700 transition-all duration-300"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
export default ProgressBar;
