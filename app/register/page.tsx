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
import { registerUser, clearError } from "@/store/slices/authSlice";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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
    
    // Trim all inputs
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    
    // Reset errors
    setErrors({ username: "", email: "", password: "", confirmPassword: "" });
    
    // Validation
    const newErrors = { username: "", email: "", password: "", confirmPassword: "" };

    if (trimmedUsername.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    const hasError = Object.values(newErrors).some((error) => error !== "");

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Update state with trimmed values
    setUsername(trimmedUsername);
    setEmail(trimmedEmail);

    const result = await dispatch(registerUser({ 
      username: trimmedUsername, 
      email: trimmedEmail, 
      password 
    }));
    
    if (registerUser.fulfilled.match(result)) {
      router.push("/main-menu");
    } else if (registerUser.rejected.match(result)) {
      const errorMessage = result.payload as string;
      setErrors({ 
        username: errorMessage.includes("username") ? errorMessage : "",
        email: errorMessage.includes("email") ? errorMessage : "",
        password: errorMessage.includes("password") ? errorMessage : "",
        confirmPassword: "",
      });
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
              Create Account
            </h1>
            <p className="text-sm text-gray-400">
              Join us and start training your brain today!
            </p>
          </div>

          {/* Registration Form */}
          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <InputField
                label="Username"
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                autoComplete="off"
                error={errors.username}
                required
              />

              {/* Email Field */}
              <InputField
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                error={errors.email}
                required
              />

              {/* Password Field */}
              <InputField
                label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
                error={errors.password}
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

              {/* Confirm Password Field */}
              <InputField
                label="Confirm Password"
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                error={errors.confirmPassword}
                required
                icon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 transition-colors hover:text-primary focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    <FontAwesomeIcon 
                      icon={showConfirmPassword ? faEyeSlash : faEye} 
                      className="h-5 w-5"
                    />
                  </button>
                }
              />

              {/* Create Account Button */}
              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </div>

          {/* Additional Links */}
          <div className="text-center text-sm">
            <div className="text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary transition-colors hover:text-primary-hover"
              >
                Login
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
