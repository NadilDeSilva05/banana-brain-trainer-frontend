"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FloatingBananas from "@/components/FloatingBananas";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import BackButton from "@/components/BackButton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, clearError } from "@/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/main-menu");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    const result = await dispatch(loginUser({ email, password }));
    
    if (loginUser.fulfilled.match(result)) {
      router.push("/main-menu");
    }
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-linear-to-b from-[#0f1f1a] to-[#1a3a2e] px-4 py-6">
      <FloatingBananas />

      {/* Back Button */}
      <div className="absolute left-4 top-6 z-20 sm:left-8">
        <BackButton href="/" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {/* Brain Icon */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <FontAwesomeIcon icon={faBrain} className="text-white" size="2x" />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Welcome Back!
            </h1>
            <p className="text-sm text-gray-400">
              Login to continue your brain training journey
            </p>
          </div>

          {/* Login Form */}
          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <InputField
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />

              {/* Password Field */}
              <InputField
                label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="new-password"
                required
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 transition-colors hover:text-primary focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <FontAwesomeIcon 
                      icon={showPassword ? faEyeSlash : faEye} 
                      className="h-5 w-5"
                    />
                  </button>
                }
              />

              {/* Login Button */}
              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </div>

          {/* Additional Links */}
          <div className="space-y-3 text-center text-sm">
            <Link
              href="/forgot-password"
              className="block text-gray-400 transition-colors hover:text-primary"
            >
              Forgot Password?
            </Link>
            <div className="text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary transition-colors hover:text-primary-hover"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center">
        <div className="text-xs text-gray-500 sm:text-sm">
          © 2025 Banana Brain Trainer Game
        </div>
      </footer>
    </div>
  );
}

