"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faPlus,
  faChartBar,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  level: number;
  isHighScore: boolean;
  onNewGame: () => void;
  onLeaderboard: () => void;
  onExit: () => void;
}

export default function GameOverModal({
  isOpen,
  score,
  level,
  isHighScore,
  onNewGame,
  onLeaderboard,
  onExit,
}: GameOverModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-modal-enter">
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-[#223632] shadow-2xl border-2 border-[#4CAF50]/30 animate-modal-content">
        {/* Modal Header */}
        <div className="px-6 py-6 border-b border-[#4CAF50]/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-2 animate-scale-in-bounce">Game Over!</h2>
          {isHighScore && (
            <div className="flex items-center justify-center gap-2 mb-3 animate-bounce">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-400 text-xl animate-pulse" />
              <span className="text-yellow-400 font-semibold text-sm">New High Score!</span>
            </div>
          )}
        </div>

        {/* Score and Level Display */}
        <div className="px-6 py-6 space-y-4">
          <div className="flex justify-between items-center rounded-xl bg-[#1A2B27] px-4 py-3 border border-[#4CAF50]/20 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
            <span className="text-gray-300 text-sm font-medium">Final Score:</span>
            <span className="text-white text-xl font-bold animate-score-pop">{score}</span>
          </div>
          <div className="flex justify-between items-center rounded-xl bg-[#1A2B27] px-4 py-3 border border-[#4CAF50]/20 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
            <span className="text-gray-300 text-sm font-medium">Level Reached:</span>
            <span className="text-white text-xl font-bold">{level}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={onNewGame}
            className="w-full rounded-xl bg-[#4CAF50] px-6 py-4 text-white font-semibold hover:bg-[#3bc66f] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg transform hover:scale-105 active:scale-95 animate-slide-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <FontAwesomeIcon icon={faPlus} className="text-lg" />
            <span>New Game</span>
          </button>
          
          <button
            onClick={onLeaderboard}
            className="w-full rounded-xl bg-[#1A2B27] px-6 py-4 text-white font-semibold hover:bg-[#2a423d] transition-all duration-300 border-2 border-[#4CAF50]/30 flex items-center justify-center gap-3 transform hover:scale-105 hover:shadow-lg animate-slide-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <FontAwesomeIcon icon={faChartBar} className="text-[#4CAF50] text-lg" />
            <span>Leaderboard</span>
          </button>
          
          <button
            onClick={onExit}
            className="w-full rounded-xl bg-[#1A2B27] px-6 py-4 text-white font-semibold hover:bg-[#2a423d] transition-all duration-300 border-2 border-[#4CAF50]/30 flex items-center justify-center gap-3 transform hover:scale-105 hover:shadow-lg animate-slide-in-up"
            style={{ animationDelay: '0.5s' }}
          >
            <FontAwesomeIcon icon={faHome} className="text-[#4CAF50] text-lg" />
            <span>Exit Game</span>
          </button>
        </div>
      </div>
    </div>
  );
}

