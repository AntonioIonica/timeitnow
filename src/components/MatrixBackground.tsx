"use client";

import { useEffect, useRef } from "react";

function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const fontSize = 24; // Slightly larger font for better visibility
    const columns = Math.floor(width / fontSize) + 1;
    const yPositions = Array(columns).fill(0);

    function drawMatrix() {
      if (!ctx) return;

      // Semi-transparent overlay for trailing effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);

      // Set text style
      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;

      yPositions.forEach((y, index) => {
        // Generate a random character
        const text = String.fromCharCode(
          Math.floor(Math.random() * (126 - 32 + 1)) + 32,
        );
        const x = index * fontSize;

        // Draw the character
        ctx.fillText(text, x, y);

        // Randomly reset the column if it's beyond a certain height
        if (y > height && Math.random() > 0.975) {
          yPositions[index] = 0;
        } else {
          // Move the column down
          yPositions[index] = y + fontSize;
        }
      });
    }

    const interval = setInterval(drawMatrix, 90);
    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ background: "black" }}
    />
  );
}

export default MatrixBackground;
