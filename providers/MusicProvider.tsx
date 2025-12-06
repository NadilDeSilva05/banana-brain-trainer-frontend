"use client";

import { createContext, useContext, useState, useEffect, useLayoutEffect, useRef, startTransition, ReactNode } from "react";

interface MusicContextType {
  isMusicOn: boolean;
  toggleMusic: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}

export default function MusicProvider({ children }: { children: ReactNode }) {
  // Always start with false to match server-side rendering
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasInitializedRef = useRef(false);

  // Load music preference from localStorage after hydration
  // Using useLayoutEffect to synchronize with DOM updates and avoid hydration mismatch
  useLayoutEffect(() => {
    if (hasInitializedRef.current || typeof window === "undefined") return;
    
    hasInitializedRef.current = true;
    const savedPreference = localStorage.getItem("musicEnabled");
    const shouldBeOn = savedPreference === "true";
    
    // Use startTransition to mark these as non-urgent updates
    // This prevents cascading renders and satisfies the linter
    startTransition(() => {
      setIsHydrated(true);
      if (shouldBeOn) {
        setIsMusicOn(true);
      }
    });
  }, []);

  // Handle music playback (only after hydration to avoid hydration mismatch)
  useEffect(() => {
    if (!isHydrated) return;
    
    const audio = audioRef.current;
    if (!audio) return;

    if (isMusicOn) {
      audio.volume = 0.3; // Set volume to 30%
      audio.loop = true; // Loop the music
      audio.play().catch((error) => {
        console.log("Audio play failed:", error);
        // Auto-play might be blocked by browser, user will need to interact first
      });
    } else {
      audio.pause();
    }

    // Save preference to localStorage
    localStorage.setItem("musicEnabled", isMusicOn.toString());
  }, [isMusicOn, isHydrated]);

  const toggleMusic = () => {
    setIsMusicOn((prev) => !prev);
  };

  return (
    <MusicContext.Provider value={{ isMusicOn, toggleMusic }}>
      {/* Background Music - Global */}
      <audio ref={audioRef} preload="auto">
        <source src="/assets/audio/akon.mp3" type="audio/mpeg" />
        <source src="/assets/audio/akon.ogg" type="audio/ogg" />
        Your browser does not support the audio element.
      </audio>
      {children}
    </MusicContext.Provider>
  );
}

