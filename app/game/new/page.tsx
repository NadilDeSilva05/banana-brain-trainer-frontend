"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faTrophy,
  faBolt,
  faClock,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import FloatingBananas from "../../../components/FloatingBananas";
import BackButton from "../../../components/BackButton";
import GameModal from "../../../components/GameModal";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewGamePage() {
  const router = useRouter();
  const [username] = useState("nadil"); // TODO: Fetch from auth context
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  
  // Sample answers - in a real app, these would come from the API
  const answers = [5, 7, 9, 12];

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    // TODO: Implement answer submission logic
    console.log("Answer submitted:", selectedAnswer);
    // Reset answer and timer for next question
    setSelectedAnswer(null);
    setTimer(30);
  };

  const handleAnswerSelect = (value: number) => {
    setSelectedAnswer(value);
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowBackModal(true);
  };

  const handleContinue = () => {
    setShowBackModal(false);
  };

  const handleNewGame = () => {
    setShowBackModal(false);
    router.push("/game/new");
  };

  const handleMainMenu = () => {
    setShowBackModal(false);
    router.push("/main-menu");
  };

  const handleLogout = () => {
    setShowBackModal(false);
    router.push("/login");
  };

  const handleQuit = () => {
    setShowBackModal(false);
    // In a real app, you might want to show a confirmation or save progress
    router.push("/main-menu");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu && !(event.target as Element).closest('.menu-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);


  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#1A2B27]">
      <FloatingBananas />

      {/* Top Bar */}
      <header className="relative z-10 flex w-full items-center justify-between px-4 py-4 sm:px-6">
        {/* Back Button */}
        <div onClick={handleBackClick}>
          <BackButton href="#" />
        </div>

        {/* Logo - Center */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#4CAF50]">
            <FontAwesomeIcon icon={faBrain} className="text-[#4CAF50] text-lg" />
          </div>
          <span className="hidden sm:inline text-lg font-semibold text-white">Banana Brain</span>
        </div>

        {/* Profile with Menu - Right */}
        <div className="relative menu-container flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4CAF50]">
            <span className="text-white font-bold text-lg">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-white font-medium text-sm">{username}</span>
          <button
            onClick={handleMenuToggle}
            className="text-white transition-colors hover:text-[#4CAF50] p-2"
            aria-label="Menu"
          >
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </button>
          
          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-12 z-20 rounded-lg bg-[#223632] border border-[#4CAF50]/20 shadow-lg py-2 min-w-[150px]">
              <button
                onClick={() => {
                  router.push("/main-menu");
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-white text-sm hover:bg-[#2a423d] transition-colors"
              >
                Main Menu
              </button>
              <button
                onClick={() => {
                  router.push("/settings");
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-white text-sm hover:bg-[#2a423d] transition-colors"
              >
                Settings
              </button>
              <button
                onClick={() => {
                  router.push("/login");
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-white text-sm hover:bg-[#2a423d] transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Statistics Bar */}
      <div className="relative z-10 flex justify-center gap-4 px-4 ">
        {/* Score */}
        <div className="flex flex-col items-center rounded-xl bg-[#223632] px-6 py-3 min-w-[100px]">
          <FontAwesomeIcon icon={faTrophy} className="text-yellow-400 text-xl mb-1" />
          <span className="text-white text-xs mb-1">Score:</span>
          <span className="text-white text-lg font-bold">{score}</span>
        </div>

        {/* Streak */}
        <div className="flex flex-col items-center rounded-xl bg-[#223632] px-6 py-3 min-w-[100px]">
          <FontAwesomeIcon icon={faBolt} className="text-yellow-400 text-xl mb-1" />
          <span className="text-white text-xs mb-1">Streak:</span>
          <span className="text-white text-lg font-bold">{streak}</span>
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center rounded-xl bg-[#223632] px-6 py-3 min-w-[100px]">
          <FontAwesomeIcon icon={faClock} className="text-blue-400 text-xl mb-1" />
          <span className="text-white text-lg font-bold">{timer}</span>
          <span className="text-white text-xs">s</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 ">
        <div className="w-full max-w-2xl space-y-5">
          {/* Question */}
          <div className="text-center">
            <p className="text-white text-sm sm:text-base">
              Look at the image and figure out what number is hided by bananas!
            </p>
          </div>
          <div className="flex justify-center mt-8">
            <div className="w-full max-w-md h-64 rounded-xl bg-[#223632] border-2 border-dashed border-[#4CAF50]/30 flex items-center justify-center">
              <p className="text-gray-400 text-sm">Puzzle image will appear here</p>
            </div>
          </div>
          {/* Answer Options */}
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {answers.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleAnswerSelect(value)}
                className={`w-20 h-20 rounded-xl font-bold text-xl transition-all ${
                  selectedAnswer === value
                    ? "bg-[#4CAF50] text-white border-2 border-[#4CAF50] scale-105 shadow-lg"
                    : "bg-[#223632] text-white border-2 border-[#4CAF50]/30 hover:border-[#4CAF50] hover:bg-[#2a423d]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className={`rounded-lg px-8 py-3 text-white font-semibold text-base transition-colors ${
                selectedAnswer !== null
                  ? "bg-[#4CAF50] hover:bg-[#3bc66f] cursor-pointer"
                  : "bg-[#223632] border-2 border-[#4CAF50]/30 text-gray-400 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          </div>

          {/* Instruction */}
        

          {/* Placeholder for puzzle image */}
         
        </div>
      </main>

      {/* Back Modal */}
      <GameModal
        isOpen={showBackModal}
        onClose={() => setShowBackModal(false)}
        score={score}
        onContinue={handleContinue}
        onNewGame={handleNewGame}
        onMainMenu={handleMainMenu}
        onLogout={handleLogout}
        onQuit={handleQuit}
      />
    </div>
  );
}

