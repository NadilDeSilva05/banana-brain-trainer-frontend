"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faHome } from "@fortawesome/free-solid-svg-icons";
<<<<<<< Updated upstream
import FloatingBananas from "../../components/FloatingBananas";
import Navigation from "../../components/Navigation";
import { useState } from "react";
=======
import Navigation from "@/components/Navigation";
import MusicToggle from "@/components/MusicToggle";
import { useState, useEffect } from "react";
>>>>>>> Stashed changes
import { useRouter } from "next/navigation";

interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  score: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
<<<<<<< Updated upstream
  const [username] = useState("nadil"); // TODO: Fetch from auth context

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push("/login");
  };

  // Sample leaderboard data - in a real app, this would come from an API
  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, username: "nadil", level: 5, score: 1250 },
    { rank: 2, username: "player2", level: 4, score: 980 },
    { rank: 3, username: "player3", level: 4, score: 850 },
    { rank: 4, username: "player4", level: 3, score: 720 },
    { rank: 5, username: "player5", level: 3, score: 650 },
    { rank: 6, username: "player6", level: 2, score: 540 },
    { rank: 7, username: "player7", level: 2, score: 480 },
    { rank: 8, username: "player8", level: 2, score: 420 },
    { rank: 9, username: "player9", level: 1, score: 350 },
    { rank: 10, username: "player10", level: 1, score: 280 },
  ];
=======
  const dispatch = useAppDispatch();
  const { user, loading: authLoading, isAuthenticated } = useAppSelector((state) => state.auth);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await leaderboardService.getLeaderboard(10);
        
        if (response.success && response.data) {
          // Transform API response to match component expectations
          const transformed = response.data.leaderboard.map((entry, index) => ({
            ...entry,
            rank: index + 1,
            level: Math.floor(entry.highestScore / 250) + 1, // Calculate level from score
            score: entry.highestScore,
          }));
          setLeaderboardData(transformed);
        } else {
          setError(response.error || "Failed to load leaderboard");
        }
      } catch (err) {
        setError("An error occurred while loading the leaderboard");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchLeaderboard();
    }
  }, [isAuthenticated]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  if (authLoading || !user) {
    return (
      <div 
        className="flex h-screen items-center justify-center"
        style={{
          backgroundImage: "url('/assets/images/background-image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-white">Loading...</div>
      </div>
    );
  }
>>>>>>> Stashed changes

  const getTrophyIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return { icon: faTrophy, color: "text-yellow-400" }; // Gold
      case 2:
        return { icon: faTrophy, color: "text-gray-300" }; // Silver
      case 3:
        return { icon: faTrophy, color: "text-orange-600" }; // Bronze
      default:
        return null;
    }
  };

  return (
    <Navigation
      username={username}
      showUserInfo={true}
      onLogout={handleLogoutClick}
      showFooterLinks={true}
      copyrightYear="2023"
      backgroundClassName=""
      className=""
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/images/background-image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MusicToggle position="top-right" />

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center px-4 py-6">
        <div className="w-full max-w-2xl flex flex-col h-full">
          {/* Title */}
          <div className="text-center space-y-2 mb-4 shrink-0 animate-slide-in-down">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Leaderboard</h1>
            <p className="text-white text-sm sm:text-base">See who&apos;s top banana!</p>
          </div>

<<<<<<< Updated upstream
          {/* Scrollable Leaderboard Entries */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-4">
            {leaderboardData.map((entry) => {
=======
          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-300 mb-4">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-white">Loading leaderboard...</div>
            </div>
          ) : (
            /* Scrollable Leaderboard Entries */
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-4">
              {leaderboardData.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No leaderboard data available yet. Be the first to play!
                </div>
              ) : (
                leaderboardData.map((entry, index) => {
>>>>>>> Stashed changes
              const trophy = getTrophyIcon(entry.rank);
              const animationDelay = `${100 + Math.min(index, 5) * 50}ms`;
              return (
                <div
                  key={entry.rank}
                  className="rounded-xl bg-[#223632] px-4 py-4 flex items-center gap-4 border-2 border-[#4CAF50]/20 hover:border-[#4CAF50]/40 transition-all duration-300 shrink-0 transform hover:scale-105 hover:shadow-lg animate-slide-in-left"
                  style={{ animationDelay }}
                >
                  {/* Trophy Icon or Rank */}
                  <div className="shrink-0">
                    {trophy ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1A2B27] animate-bounce">
                        <FontAwesomeIcon
                          icon={trophy.icon}
                          className={`${trophy.color} text-2xl`}
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1A2B27]">
                        <span className="text-gray-400 font-bold text-lg">#{entry.rank}</span>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <p className="text-white font-bold text-lg">{entry.username}</p>
                    <p className="text-gray-300 text-sm">
                      Level <span className="font-semibold">{entry.level}</span>
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">{entry.score}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Back to Home Button */}
          <div className="flex justify-center pt-2 shrink-0 animate-slide-in-up animate-delay-500">
            <Link
              href="/main-menu"
              className="flex items-center gap-3 rounded-xl bg-[#4CAF50] px-8 py-4 text-white font-semibold text-base hover:bg-[#3bc66f] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary/50"
            >
              <FontAwesomeIcon icon={faHome} className="text-lg" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </Navigation>
  );
}

