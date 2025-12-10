"use client";

import { useState, useEffect } from "react";
import { gameService } from "@/services/gameService";

interface EmojiBananaProps {
  emoji: string;
  onCollect: () => void;
  position: { x: number; y: number };
}

export default function EmojiBanana({ emoji, onCollect, position }: EmojiBananaProps) {
  const [isCollected, setIsCollected] = useState(false);

  const handleClick = () => {
    if (!isCollected) {
      setIsCollected(true);
      onCollect();
      // Remove after animation
      setTimeout(() => {
        setIsCollected(false);
      }, 500);
    }
  };

  if (isCollected) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className="fixed z-40 animate-bounce cursor-pointer transition-all duration-300 hover:scale-125 active:scale-95"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      aria-label="Collect Emoji Banana"
    >
      <div className="text-6xl filter drop-shadow-lg animate-pulse">
        {emoji}
      </div>
    </button>
  );
}

