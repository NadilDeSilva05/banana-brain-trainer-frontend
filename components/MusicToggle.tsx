"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { useMusic } from "@/providers/MusicProvider";

interface MusicToggleProps {
  className?: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "inline";
}

export default function MusicToggle({ 
  className = "", 
  position = "top-right" 
}: MusicToggleProps) {
  const { isMusicOn, toggleMusic } = useMusic();

  const positionClasses = {
    "top-right": "fixed top-4 right-4 z-50",
    "top-left": "fixed top-4 left-4 z-50",
    "bottom-right": "fixed bottom-4 right-4 z-50",
    "bottom-left": "fixed bottom-4 left-4 z-50",
    "inline": "",
  };

  return (
    <button
      onClick={toggleMusic}
      className={`${positionClasses[position]} p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 animate-fade-in ${className}`}
      aria-label={isMusicOn ? "Turn off music" : "Turn on music"}
      title={isMusicOn ? "Turn off music" : "Turn on music"}
    >
      <FontAwesomeIcon 
        icon={isMusicOn ? faVolumeUp : faVolumeMute} 
        className={`text-white text-lg sm:text-xl transition-all duration-300 ${isMusicOn ? 'animate-pulse' : ''}`}
      />
    </button>
  );
}

