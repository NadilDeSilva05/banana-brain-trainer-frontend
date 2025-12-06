"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faTrophy,
  faBolt,
  faClock,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import FloatingBananas from "@/components/FloatingBananas";
import BackButton from "@/components/BackButton";
import GameModal from "@/components/GameModal";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { gameService } from "@/services/gameService";

interface Puzzle {
  solution: number;
  imageUrl?: string;
}
import { leaderboardService } from "@/services/leaderboardService";

export default function NewGamePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading: authLoading, isAuthenticated } = useAppSelector((state) => state.auth);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(30);
  const [startTime] = useState(() => Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isHighScore, setIsHighScore] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true);
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [levelAnimation, setLevelAnimation] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Generate answer options including correct answer and 3 random wrong answers
  const generateAnswers = (correctAnswer: number): number[] => {
    const answersSet = new Set<number>([correctAnswer]);
    
    // Generate 3 unique wrong answers
    while (answersSet.size < 4) {
      // Generate wrong answers in a range around the correct answer
      const range = Math.max(5, correctAnswer);
      const wrongAnswer = correctAnswer + Math.floor(Math.random() * range * 2) - range;
      if (wrongAnswer >= 0 && wrongAnswer !== correctAnswer) {
        answersSet.add(wrongAnswer);
      }
    }
    
    // Convert to array and shuffle
    const answersArray = Array.from(answersSet);
    return answersArray.sort(() => Math.random() - 0.5);
  };
  // Fetch new puzzle from Banana API
  const fetchPuzzle = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelectedAnswer(null);
    
    try {
      // TODO: Implement puzzle fetching from API
      // For now, generate a random puzzle
      const randomSolution = Math.floor(Math.random() * 20) + 1;
      const puzzle: Puzzle = { solution: randomSolution };
      setCurrentPuzzle(puzzle);
      const answerOptions = generateAnswers(puzzle.solution);
      setAnswers(answerOptions);
    } catch (err) {
      setError('Failed to fetch puzzle. Please try again.');
      console.error('Error fetching puzzle:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch puzzle on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchPuzzle();
    }
  }, [isAuthenticated, fetchPuzzle]);

  // Calculate timer based on level (decreases as level increases)
  const getTimerForLevel = (currentLevel: number): number => {
    // Start at 30 seconds, decrease by 2 seconds per level, minimum 10 seconds
    return Math.max(10, 30 - (currentLevel - 1) * 2);
  };

  // Calculate questions per level (increases as level increases)
  const getQuestionsForLevel = (currentLevel: number): number => {
    // Start with 5 questions, increase by 2 per level
    return 5 + (currentLevel - 1) * 2;
  };

  const saveGameSession = useCallback(async () => {
    if (!user) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      await gameService.createSession({
        user: user.id,
        score,
        level,
        timeSpent,
        gameType: 'mixed',
        completed: true,
      });
    } catch (error) {
      console.error('Failed to save game session:', error);
    }
  }, [user, score, level, startTime]);

  const handleAnswerSelect = (value: number) => {
    setSelectedAnswer(value);
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null || !currentPuzzle) return;
    
    const isCorrect = selectedAnswer === currentPuzzle.solution;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      if (streak + 1 >= 5) {
        setLevel(prev => prev + 1);
      }
      // Fetch next puzzle
      fetchPuzzle();
    } else {
      setStreak(0);
      // Fetch next puzzle
      fetchPuzzle();
    }
    
    // Reset answer
    setSelectedAnswer(null);
    setTimer(getTimerForLevel(level));
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
    setShowGameOver(false);
    // Reset game state
    setScore(0);
    setLevel(1);
    setStreak(0);
    setTimer(30);
    setSelectedAnswer(null);
    setIsGameActive(true);
    setIsHighScore(false);
    fetchPuzzle();
  };

  const handleGameOverNewGame = () => {
    setShowGameOver(false);
    // Reset game state
    setScore(0);
    setLevel(1);
    setStreak(0);
    setTimer(30);
    setSelectedAnswer(null);
    setIsGameActive(true);
    setIsHighScore(false);
    fetchPuzzle();
  };

  const handleGameOverLeaderboard = () => {
    setShowGameOver(false);
    router.push("/leaderboard");
  };

  const handleGameOverExit = () => {
    setShowGameOver(false);
    router.push("/main-menu");
  };

  const handleMainMenu = async () => {
    setShowBackModal(false);
    await saveGameSession();
    router.push("/main-menu");
  };

  const handleLogoutClick = () => {
    setShowBackModal(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await saveGameSession();
    dispatch(logout());
    router.push("/login");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleQuit = async () => {
    setShowBackModal(false);
    // Save game session before quitting
    await saveGameSession();
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

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1A2B27]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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
              {user?.username.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <span className="text-white font-medium text-sm">{user?.username || 'User'}</span>
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
                  handleLogoutClick();
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
        onLogout={handleLogoutClick}
        onQuit={handleQuit}
      />
    </div>
  );
}

