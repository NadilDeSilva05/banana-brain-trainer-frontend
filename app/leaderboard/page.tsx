"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faHome } from "@fortawesome/free-solid-svg-icons";
import FloatingBananas from "../../components/FloatingBananas";
import Navigation from "../../components/Navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  score: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
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
      onLogout={handleLogout}
      showFooterLinks={true}
      copyrightYear="2023"
      backgroundClassName="bg-[#1A2B27]"
    >
      <FloatingBananas />

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center px-4 py-6">
        <div className="w-full max-w-2xl flex flex-col h-full">
          {/* Title */}
          <div className="text-center space-y-2 mb-4 shrink-0">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Leaderboard</h1>
            <p className="text-white text-sm sm:text-base">See who&apos;s top banana!</p>
          </div>

          {/* Scrollable Leaderboard Entries */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-4">
            {leaderboardData.map((entry) => {
              const trophy = getTrophyIcon(entry.rank);
              return (
                <div
                  key={entry.rank}
                  className="rounded-xl bg-[#223632] px-4 py-4 flex items-center gap-4 border-2 border-[#4CAF50]/20 hover:border-[#4CAF50]/40 transition-colors shrink-0"
                >
                  {/* Trophy Icon or Rank */}
                  <div className="shrink-0">
                    {trophy ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1A2B27]">
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
          <div className="flex justify-center pt-2 shrink-0">
            <Link
              href="/main-menu"
              className="flex items-center gap-3 rounded-xl bg-[#4CAF50] px-8 py-4 text-white font-semibold text-base hover:bg-[#3bc66f] transition-colors"
            >
              <FontAwesomeIcon icon={faHome} className="text-lg" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </main>
    </Navigation>
  );
}

