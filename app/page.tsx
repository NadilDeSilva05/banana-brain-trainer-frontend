"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
<<<<<<< Updated upstream
import FloatingBananas from "../components/FloatingBananas";
import Button from "../components/Button";
=======
import Button from "@/components/Button";
import MusicToggle from "@/components/MusicToggle";
>>>>>>> Stashed changes

export default function Home() {
  return (
    <div 
      className="relative flex h-screen flex-col items-center justify-between overflow-hidden px-4 py-6 sm:px-8 md:px-16"
      style={{
        backgroundImage: "url('/assets/images/background-image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >

      {/* Global Music Toggle */}
      <MusicToggle position="top-right" />

      {/* Header with Logo/Icon */}
      <header className="relative z-10 w-full max-w-6xl pt-2 animate-slide-in-down">
        <div className="flex items-center justify-center">
          <FontAwesomeIcon 
            icon={faBrain} 
            className="text-primary animate-pulse" 
            size="3x"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex w-full max-w-6xl flex-1 flex-col items-center justify-center space-y-4">
        {/* Title Section */}
        <div className="space-y-1 text-center sm:space-y-2 animate-slide-in-up animate-delay-200">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            Banana Brain Trainer Game
          </h1>
          <p className="text-base font-medium text-white sm:text-lg">
            Sharpen Your Mind, Go Bananas!
          </p>
          <p className="mx-auto max-w-2xl text-xs text-gray-400 sm:text-sm">
            Challenge your memory, logic, and focus with our exciting brain game.
          </p>
        </div>

        {/* Hero Section with Image and CTA */}
        <div className="flex w-full flex-col items-center justify-center gap-6 md:flex-row md:items-center md:gap-8 lg:gap-12">
          {/* Hero Image Section - Left */}
          <div className="relative w-full max-w-md md:w-1/2 animate-slide-in-left animate-delay-300">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-black/40 to-black/60 p-4 shadow-2xl backdrop-blur-sm sm:p-6 animate-card-lift">
              <div className="absolute inset-0 bg-linear-to-t from-primary/10 to-transparent"></div>
              <div className="relative flex items-center justify-center">
                <div className="relative h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72">
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/20 to-transparent blur-3xl animate-pulse"></div>
                  <Image
                    src="/assets/images/welcome-screen/WelcomeImage.png"
                    alt="Brain on Banana - Welcome to Brain Trainer"
                    fill
                    className="object-contain drop-shadow-2xl animate-scale-in"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section - Right */}
          <div className="flex w-full max-w-sm flex-col space-y-4 md:w-1/2 animate-slide-in-right animate-delay-400">
            {/* Instructions Text */}
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-lg font-semibold text-white sm:text-xl">
                Get Started Today!
              </h2>
              <p className="text-xs text-gray-400 sm:text-sm">
                Create your free account to start training your brain with our interactive game. Already have an account? Log in to continue your progress.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex w-full flex-col gap-2.5">
              <Link href="/register">
                <Button 
                  variant="primary" 
                  fullWidth
                  icon={
                    <svg 
                      className="h-4 w-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  }
                >
                  Register Now
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" fullWidth>
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

        {/* Footer */}
        <footer className="relative z-10 w-full max-w-6xl space-y-3 pb-4 animate-fade-in animate-delay-500">
        {/* <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 sm:gap-8 sm:text-sm">
          <Link 
            href="/about" 
            className="transition-colors hover:text-primary"
          >
            About Us
          </Link>
          <Link 
            href="/contact" 
            className="transition-colors hover:text-primary"
          >
            Contact
          </Link>
          <Link 
            href="/privacy" 
            className="transition-colors hover:text-primary"
          >
            Privacy Policy
          </Link>
        </div> */}
        <div className="text-center text-xs text-gray-500 sm:text-sm">
          © 2025 Banana Brain Trainer Game
        </div>
      </footer>
    </div>
  );
}
