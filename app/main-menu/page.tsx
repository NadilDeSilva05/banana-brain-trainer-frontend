"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChartBar,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import Navigation from "@/components/Navigation";
import MusicToggle from "@/components/MusicToggle";
import LogoutConfirmationModal from "@/components/LogoutConfirmationModal";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useState } from "react";

export default function MainMenuPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  if (loading || !user) {
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

  const menuItems: Array<{
    id: string;
    icon: typeof faPlus;
    title: string;
    description: string;
    href: string;
    isLink: boolean;
    onClick?: () => void;
  }> = [
    {
      id: "new-game",
      icon: faPlus,
      title: "New Game",
      description: "Start a fresh brain training session.",
      href: "/game/new",
      isLink: true,
    },
    {
      id: "leaderboard",
      icon: faChartBar,
      title: "Leaderboard",
      description: "See how you rank against other players.",
      href: "/leaderboard",
      isLink: true,
    },
    {
      id: "logout",
      icon: faRightFromBracket,
      title: "Logout",
      description: "Sign out of your account.",
      href: "#",
      isLink: false,
      onClick: handleLogoutClick,
    },
  ];

  return (
    <Navigation
      username={user.username}
      showUserInfo={true}
      onLogout={handleLogoutClick}
      showFooterLinks={false}
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
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-6">
          {/* Title */}
          <div className="text-center animate-slide-in-down">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Main Menu</h1>
          </div>

          {/* Welcome Message */}
          <div className="text-center space-y-1 animate-slide-in-up animate-delay-200">
            <p className="text-lg text-white">
              Welcome back,
            </p>
            <p className="text-xl font-bold text-white animate-pulse">
              {user.username}!
            </p>
          </div>

          {/* Menu Options */}
          <div className="space-y-3">
            {menuItems.map((item, index) => {
              const animationDelay = `${300 + index * 100}ms`;
              const content = (
                <div className="flex items-center gap-4">
                  {/* Icon Circle */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1A2B27] border-2 border-[#4CAF50] transition-all duration-300 group-hover:scale-110 group-hover:animate-glow">
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="text-[#4CAF50] text-xl transition-transform duration-300 group-hover:rotate-12"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-300">{item.description}</p>
                  </div>
                </div>
              );

              if (item.isLink) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="group block rounded-xl bg-[#223632] p-5 transition-all duration-300 hover:bg-[#2a423d] hover:shadow-lg cursor-pointer transform hover:scale-105 hover:-translate-y-1 animate-slide-in-left"
                    style={{ animationDelay }}
                  >
                    {content}
                  </Link>
                );
              } else {
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className="group w-full text-left block rounded-xl bg-[#223632] p-5 transition-all duration-300 hover:bg-[#2a423d] hover:shadow-lg cursor-pointer transform hover:scale-105 hover:-translate-y-1 active:scale-95 animate-slide-in-left"
                    style={{ animationDelay }}
                  >
                    {content}
                  </button>
                );
              }
            })}
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

