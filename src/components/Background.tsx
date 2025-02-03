"use client";

import Image from "next/image";
import { createContext, useContext, useState, useCallback } from "react";

const images = [
  { alt: "ballon", src: "/backgrounds/baloon.jpg" },
  { alt: "caban", src: "/backgrounds/caban.jpg" },
  { alt: "park", src: "/backgrounds/park.jpg" },
  { alt: "rice", src: "/backgrounds/rice.jpg" },
];

type BackgroundContextType = {
  currentIndex: number;
  changeBackground: () => void;
};

const BackgroundContext = createContext<BackgroundContextType | null>(null);

export function BackgroundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const changeBackground = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, []);

  return (
    <BackgroundContext.Provider value={{ currentIndex, changeBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
}

function Background() {
  const { currentIndex } = useBackground();

  return (
    <div className="fixed inset-0 -z-50 h-screen w-screen">
      <Image
        src={images[currentIndex].src}
        alt={images[currentIndex].alt}
        fill
        priority
        className="object-cover transition-opacity duration-1000"
        sizes="100vw"
        quality={100}
      />
    </div>
  );
}

export default Background;
