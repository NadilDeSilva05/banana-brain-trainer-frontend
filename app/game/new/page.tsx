"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faTrophy,
  faBolt,
  faClock,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import BackButton from "@/components/BackButton";
import GameModal from "@/components/GameModal";
import GameOverModal from "@/components/GameOverModal";
import LogoutConfirmationModal from "@/components/LogoutConfirmationModal";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { gameService } from "@/services/gameService";
import { leaderboardService } from "@/services/leaderboardService";

interface Puzzle {
  solution: number;
  image?: string;
}

export default function NewGamePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading: authLoading, isAuthenticated } = useAppSelector((state) => state.auth);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [questionsInLevel, setQuestionsInLevel] = useState(5); // Start with 5 questions per level
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
    setSelectedAnswer(null);
    
    try {
      const response = await gameService.getPuzzle(true); // Get base64 image
      if (response.success && response.data) {
        const puzzle: Puzzle = {
          solution: response.data.solution,
          image: response.data.image,
        };
        setCurrentPuzzle(puzzle);
        const answerOptions = generateAnswers(puzzle.solution);
        setAnswers(answerOptions);
      } else {
        console.error('Failed to fetch puzzle:', response.error);
        // Fallback to random puzzle if API fails
        const randomSolution = Math.floor(Math.random() * 20) + 1;
        const puzzle: Puzzle = { solution: randomSolution };
        setCurrentPuzzle(puzzle);
        const answerOptions = generateAnswers(puzzle.solution);
        setAnswers(answerOptions);
      }
    } catch (err) {
      console.error('Error fetching puzzle:', err);
      // Fallback to random puzzle on error
      const randomSolution = Math.floor(Math.random() * 20) + 1;
      const puzzle: Puzzle = { solution: randomSolution };
      setCurrentPuzzle(puzzle);
      const answerOptions = generateAnswers(puzzle.solution);
      setAnswers(answerOptions);
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Check if current score is a high score
  const checkHighScore = useCallback(async (finalScore: number) => {
    if (!user) return false;
    
    try {
      const response = await leaderboardService.getUserPosition(user.id, 'mixed');
      if (response.success && response.data) {
        return finalScore > response.data.score;
      }
    } catch (error) {
      console.error('Error checking high score:', error);
    }
    return false;
  }, [user]);

  // Handle game over
  const handleGameOver = useCallback(async () => {
    if (!isGameActive || showGameOver) return;
    
    setIsGameActive(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Save game session
    await saveGameSession();

    // Check for high score
    const highScore = await checkHighScore(score);
    setIsHighScore(highScore);

    setShowGameOver(true);
  }, [isGameActive, showGameOver, score, saveGameSession, checkHighScore]);

  // Fetch puzzle on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchPuzzle();
      // Initialize timer and questions for level 1
      setTimer(getTimerForLevel(1));
      setQuestionsInLevel(getQuestionsForLevel(1));
    }
  }, [isAuthenticated, fetchPuzzle]);

  // Timer countdown
  useEffect(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Only run timer if game is active, timer > 0, not loading, not game over, AND back modal is not open
    if (isGameActive && timer > 0 && !loading && !showGameOver && !showBackModal) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timer, loading, isGameActive, showGameOver, showBackModal, handleGameOver]);

  // Update timer and questions when level changes
  useEffect(() => {
    if (isGameActive && !showGameOver) {
      const newTimer = getTimerForLevel(level);
      setTimer(newTimer);
      const newQuestions = getQuestionsForLevel(level);
      setQuestionsInLevel(newQuestions);
      setQuestionsAnswered(0); // Reset questions answered for new level
    }
  }, [level, isGameActive, showGameOver]);

  const handleAnswerSelect = (value: number) => {
    if (!isGameActive || showGameOver || showBackModal) return;
    setSelectedAnswer(value);
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null || !currentPuzzle || !isGameActive || showGameOver || showBackModal) return;
    
    const isCorrect = selectedAnswer === currentPuzzle.solution;
    
    if (isCorrect) {
      // Animate score update
      setScoreAnimation(true);
      setTimeout(() => setScoreAnimation(false), 500);
      
      setScore(prev => prev + 10);
      const newStreak = streak + 1;
      setStreak(newStreak);
      const newQuestionsAnswered = questionsAnswered + 1;
      setQuestionsAnswered(newQuestionsAnswered);
      
      // Level up when questions in level are completed
      let newLevel = level;
      if (newQuestionsAnswered >= questionsInLevel) {
        // Animate level up
        setLevelAnimation(true);
        setTimeout(() => setLevelAnimation(false), 800);
        newLevel = level + 1;
        setLevel(newLevel);
      }
      
      // Load new puzzle after short delay
      setTimeout(() => {
        if (isGameActive && !showGameOver) {
          fetchPuzzle();
          // Use newLevel to get the correct timer for the current/new level
          const newTimer = getTimerForLevel(newLevel);
          setTimer(newTimer);
        }
      }, 500);
    } else {
      // Wrong answer - game over
      handleGameOver();
    }
    
    // Reset answer
    setSelectedAnswer(null);
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
    setQuestionsAnswered(0);
    setQuestionsInLevel(5);
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
    setQuestionsAnswered(0);
    setQuestionsInLevel(5);
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
      <div 
        className="flex h-screen items-center justify-center"
        style={{
          backgroundImage: "url('/assets/images/background-image.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div 
      className="relative flex h-screen flex-col overflow-hidden"
      style={{
        backgroundImage: "url('/assets/images/background-image.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >

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
      <div className="relative z-10 flex justify-center gap-4 px-4 flex-wrap animate-slide-in-down">
        {/* Level */}
        <div className={`flex flex-col items-center rounded-xl bg-[#223632] px-6 py-3 min-w-[100px] transition-all duration-300 hover:scale-105 hover:shadow-lg ${levelAnimation ? 'animate-level-up' : ''}`}>
          <FontAwesomeIcon icon={faBrain} className="text-[#4CAF50] text-xl mb-1" />
          <span className="text-white text-xs mb-1">Level:</span>
          <span className={`text-white text-lg font-bold ${levelAnimation ? 'animate-level-up' : ''}`}>{level}</span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center rounded-xl bg-[#223632] px-6 py-3 min-w-[100px] transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <FontAwesomeIcon icon={faTrophy} className="text-yellow-400 text-xl mb-1 animate-pulse" />
          <span className="text-white text-xs mb-1">Score:</span>
          <span className={`text-white text-lg font-bold ${scoreAnimation ? 'animate-score-pop' : ''}`}>{score}</span>
        </div>

        {/* Streak */}
        <div className="flex flex-col items-center rounded-xl bg-[#223632] px-6 py-3 min-w-[100px] transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <FontAwesomeIcon icon={faBolt} className="text-yellow-400 text-xl mb-1" />
          <span className="text-white text-xs mb-1">Streak:</span>
          <span className="text-white text-lg font-bold">{streak}</span>
        </div>

        {/* Timer */}
        <div className={`flex flex-col items-center rounded-xl bg-[#223632] px-6 py-3 min-w-[100px] transition-all duration-300 hover:scale-105 hover:shadow-lg ${timer <= 10 ? 'animate-pulse animate-glow' : ''}`}>
          <FontAwesomeIcon icon={faClock} className="text-blue-400 text-xl mb-1" />
          <span className="text-white text-lg font-bold">{timer}</span>
          <span className="text-white text-xs">s</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 ">
        <div className="w-full max-w-2xl space-y-5">
          {/* Question */}
          <div className="text-center animate-slide-in-down">
            <p className="text-white text-sm sm:text-base">
              Look at the image and figure out what number is hided by bananas!
            </p>
          </div>
          <div className="flex justify-center mt-8">
            {loading ? (
              <div className="w-full max-w-md h-64 rounded-xl bg-[#223632] border-2 border-dashed border-[#4CAF50]/30 flex items-center justify-center animate-pulse">
                <p className="text-gray-400 text-sm">Loading puzzle...</p>
              </div>
            ) : currentPuzzle?.image ? (
              <div className="w-full max-w-md rounded-xl bg-[#223632] border-2 border-[#4CAF50]/30 overflow-hidden animate-scale-in">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    currentPuzzle.image.startsWith('data:')
                      ? currentPuzzle.image
                      : `data:image/png;base64,${currentPuzzle.image}`
                  }
                  alt="Banana puzzle"
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            ) : (
              <div className="w-full max-w-md h-64 rounded-xl bg-[#223632] border-2 border-dashed border-[#4CAF50]/30 flex items-center justify-center">
                <p className="text-gray-400 text-sm">No puzzle available</p>
              </div>
            )}
          </div>
          {/* Answer Options */}
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {answers.map((value, index) => (
              <button
                key={value}
                type="button"
                onClick={() => handleAnswerSelect(value)}
                disabled={showBackModal}
                className={`w-20 h-20 rounded-xl font-bold text-xl transition-all duration-300 transform animate-scale-in ${
                  showBackModal
                    ? "bg-[#223632] text-gray-500 border-2 border-[#4CAF50]/10 cursor-not-allowed opacity-50"
                    : selectedAnswer === value
                    ? "bg-[#4CAF50] text-white border-2 border-[#4CAF50] scale-110 shadow-lg animate-glow hover:scale-110 active:scale-95"
                    : "bg-[#223632] text-white border-2 border-[#4CAF50]/30 hover:border-[#4CAF50] hover:bg-[#2a423d] hover:shadow-lg hover:scale-110 active:scale-95"
                }`}
                style={{ animationDelay: `${100 + index * 50}ms` }}
              >
                {value}
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-4 animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null || showBackModal}
              className={`rounded-lg px-8 py-3 text-white font-semibold text-base transition-all duration-300 transform ${
                showBackModal || selectedAnswer === null
                  ? "bg-[#223632] border-2 border-[#4CAF50]/30 text-gray-400 cursor-not-allowed opacity-50"
                  : "bg-[#4CAF50] hover:bg-[#3bc66f] cursor-pointer hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary/50"
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
      />

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={showGameOver}
        score={score}
        level={level}
        isHighScore={isHighScore}
        onNewGame={handleGameOverNewGame}
        onLeaderboard={handleGameOverLeaderboard}
        onExit={handleGameOverExit}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </div>
  );
}

