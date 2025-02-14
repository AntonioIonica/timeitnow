"use client";

import Lottie from "lottie-react";
import animationData from "../../public/catAnimation.json";
import { useState } from "react";

interface CatAnimationProps {
  width: number;
  height: number;
  play: boolean;
}

function CatAnimation({
  width = 100,
  height = 100,
  play = false,
}: CatAnimationProps) {
  const [isVisible, setIsVisible] = useState(play);

  if (!isVisible) return null;

  return (
    <div>
      <Lottie
        loop={false}
        style={{ width, height }}
        animationData={animationData}
        onComplete={() => setIsVisible(false)}
        autoplay={play}
      />
    </div>
  );
}

export default CatAnimation;
