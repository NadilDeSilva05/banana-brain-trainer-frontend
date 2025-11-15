"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPlus,
  faChartBar,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import FloatingBananas from "@/components/FloatingBananas";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useEffect } from "react";

export default function MainMenuPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-linear-to-b from-[#0f1f1a] to-[#1a3a2e]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const menuItems = [
    {
      id: "continue",
      icon: faPlay,
      title: "Continue",
      description: "Pick up where you left off.",
      href: "/game",
    },
    {
      id: "new-game",
      icon: faPlus,
      title: "New Game",
      description: "Start a fresh brain training session.",
      href: "/game/new",
    },
    {
      id: "leaderboard",
      icon: faChartBar,
      title: "Leaderboard",
      description: "See how you rank against other players.",
      href: "/leaderboard",
    },
    {
      id: "settings",
      icon: faGear,
      title: "Settings",
      description: "Adjust game settings and preferences.",
      href: "/settings",
    },
  ];

  return (
    <Navigation
      username={user.username}
      showUserInfo={true}
      onLogout={handleLogout}
      showFooterLinks={false}
      copyrightYear="2023"
    >
      <FloatingBananas />

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Main Menu</h1>
          </div>

          {/* Welcome Message */}
          <div className="text-center space-y-1">
            <p className="text-lg text-white">
              Welcome back,
            </p>
            <p className="text-xl font-bold text-white">
              {user.username}!
            </p>
          </div>

          {/* Menu Options */}
          <div className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block rounded-xl bg-[#223632] p-5 transition-all hover:bg-[#2a423d] hover:shadow-lg cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Icon Circle */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1A2B27] border-2 border-[#4CAF50]">
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="text-[#4CAF50] text-xl"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-300">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </Navigation>
  );
}

