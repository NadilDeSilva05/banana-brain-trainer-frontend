"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

interface HeaderProps {
  username?: string;
  showUserInfo?: boolean;
  onLogout?: () => void;
}

export default function Header({ 
  username = "", 
  showUserInfo = true,
  onLogout 
}: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      router.push("/login");
    }
  };

  return (
    <header className="relative z-10 flex w-full items-center justify-between px-4 sm:px-8 mt-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#4CAF50]">
          <FontAwesomeIcon icon={faBrain} className="text-[#4CAF50] text-xl" />
        </div>
        <span className="text-xl font-semibold text-white">Banana Brain</span>
      </Link>

      {/* User Info and Logout */}
      {showUserInfo && username && (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4CAF50]">
            <span className="text-white font-bold text-lg">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-white font-medium">{username}</span>
          <button
            onClick={handleLogout}
            className="text-white transition-colors hover:text-[#4CAF50] cursor-pointer"
            aria-label="Logout"
          >
            <FontAwesomeIcon icon={faArrowRight} className="text-lg" />
          </button>
        </div>
      )}
    </header>
  );
}

