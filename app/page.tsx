import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <div className="relative flex h-screen flex-col items-center justify-between bg-linear-to-b from-[#0f1f1a] to-[#1a3a2e] px-4 py-6 sm:px-8 md:px-16">
      {/* Header with Logo/Icon */}
      <header className="w-full max-w-6xl pt-2">
        <div className="flex items-center justify-center">
        <FontAwesomeIcon icon={faBrain} className="text-primary " size="3x"/>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex w-full max-w-6xl flex-1 flex-col items-center justify-center space-y-4">
        {/* Title Section */}
        <div className="space-y-1 text-center sm:space-y-2">
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
          <div className="relative w-full max-w-md md:w-1/2">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-black/40 to-black/60 p-4 shadow-2xl backdrop-blur-sm sm:p-6">
              <div className="absolute inset-0 bg-linear-to-t from-primary/10 to-transparent"></div>
              <div className="relative flex items-center justify-center">
                <div className="relative h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72">
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/20 to-transparent blur-3xl"></div>
                  <Image
                    src="/assets/images/welcome-screen/WelcomeImage.png"
                    alt="Brain on Banana - Welcome to Brain Trainer"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section - Right */}
          <div className="flex w-full max-w-sm flex-col space-y-4 md:w-1/2">
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
              <Link 
                href="/register"
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/50 sm:px-8 sm:py-3 sm:text-base"
              >
                <span>Register Now</span>
                <svg 
                  className="h-4 w-4 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="/login"
                className="flex items-center justify-center gap-2 rounded-full border-2 border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 sm:px-8 sm:py-3 sm:text-base"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl space-y-3 pb-4">
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
