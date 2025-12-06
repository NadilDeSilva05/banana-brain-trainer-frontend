"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPlus,
  faHome,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  onContinue: () => void;
  onNewGame: () => void;
  onMainMenu: () => void;
  onLogout: () => void;
}

export default function GameModal({
  isOpen,
  onClose,
  score,
  onContinue,
  onNewGame,
  onMainMenu,
  onLogout,
}: GameModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-modal-enter"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-[#223632] shadow-2xl animate-modal-content">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#4CAF50]/30">
          <h3 className="text-xl font-bold text-white text-center animate-slide-in-down">Your Score</h3>
          <p className="text-3xl font-bold text-[#4CAF50] text-center mt-2 animate-score-pop">{score}</p>
        </div>

        {/* Modal Options */}
        <div className="p-4 space-y-2">
          <button
            onClick={onContinue}
            className="w-full rounded-xl bg-[#1A2B27] px-6 py-4 text-left text-white hover:bg-[#2a423d] transition-all duration-300 border-2 border-transparent flex items-center gap-4 transform hover:scale-105 hover:shadow-lg animate-slide-in-left"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#223632] border-2 border-[#4CAF50]">
              <FontAwesomeIcon icon={faPlay} className="text-[#4CAF50] text-lg" />
            </div>
            <span className="text-lg font-semibold">Continue</span>
          </button>
          <button
            onClick={onNewGame}
            className="w-full rounded-xl bg-[#1A2B27] px-6 py-4 text-left text-white hover:bg-[#2a423d] transition-all duration-300 border-2 border-transparent flex items-center gap-4 transform hover:scale-105 hover:shadow-lg animate-slide-in-left"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#223632] border-2 border-[#4CAF50]">
              <FontAwesomeIcon icon={faPlus} className="text-[#4CAF50] text-lg" />
            </div>
            <span className="text-lg font-semibold">New Game</span>
          </button>
          <button
            onClick={onMainMenu}
            className="w-full rounded-xl bg-[#1A2B27] px-6 py-4 text-left text-white hover:bg-[#2a423d] transition-all duration-300 border-2 border-transparent flex items-center gap-4 transform hover:scale-105 hover:shadow-lg animate-slide-in-left"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#223632] border-2 border-[#4CAF50]">
              <FontAwesomeIcon icon={faHome} className="text-[#4CAF50] text-lg" />
            </div>
            <span className="text-lg font-semibold">Main Menu</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full rounded-xl bg-[#1A2B27] px-6 py-4 text-left text-white hover:bg-[#2a423d] transition-all duration-300 border-2 border-transparent flex items-center gap-4 transform hover:scale-105 hover:shadow-lg animate-slide-in-left"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#223632] border-2 border-[#4CAF50]">
              <FontAwesomeIcon icon={faArrowRight} className="text-[#4CAF50] text-lg" />
            </div>
            <span className="text-lg font-semibold">Logout</span>
          </button>
        </div>

        {/* Close Button */}
        <div className="px-4 pb-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-[#4CAF50] px-6 py-3 text-white font-semibold hover:bg-[#3bc66f] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary/50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

