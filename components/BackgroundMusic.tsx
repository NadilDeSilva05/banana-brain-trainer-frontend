"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";

const MUSIC_SRC = "/assets/audio/your-track.mp3";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("bbt-music-enabled");
    return saved ? saved === "true" : false;
  });
  const [isPrimed, setIsPrimed] = useState(false);

  // Persist preference whenever it changes
  useEffect(() => {
    localStorage.setItem("bbt-music-enabled", String(enabled));
  }, [enabled]);

  // Handle playback and browser autoplay rules
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.35;
    audio.loop = true;

    if (!enabled) {
      audio.pause();
      return;
    }

    const attemptPlay = () =>
      audio
        .play()
        .then(() => setIsPrimed(true))
        .catch(() => {
          // Wait for first user interaction to satisfy autoplay policies
          const unlock = () => {
            audio
              .play()
              .then(() => setIsPrimed(true))
              .finally(() => document.removeEventListener("pointerdown", unlock));
          };
          document.addEventListener("pointerdown", unlock, { once: true });
        });

    attemptPlay();

    return () => {
      audio.pause();
    };
  }, [enabled]);

  return (
    <>
      <audio ref={audioRef} src={MUSIC_SRC} preload="auto" />
      <div className="pointer-events-auto fixed top-15 right-4 z-60 flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-white shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => setEnabled((prev) => !prev)}
          className="flex items-center gap-2 text-sm font-semibold transition hover:text-primary"
          aria-label={enabled ? "Mute background music" : "Play background music"}
        >
          <FontAwesomeIcon
            icon={enabled ? faVolumeHigh : faVolumeXmark}
            className={enabled ? "text-primary" : "text-gray-300"}
          />
          <span>{enabled ? "Music on" : "Music off"}</span>
        </button>
        {enabled && !isPrimed && (
          <span className="text-xs text-gray-200">Tap anywhere to start</span>
        )}
      </div>
    </>
  );
}

