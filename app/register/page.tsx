"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  // Validation helper functions
  const validateUsername = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Username is required";
    }
    if (trimmed.length < 3) {
      return "Username must be at least 3 characters";
    }
    if (trimmed.length > 30) {
      return "Username cannot exceed 30 characters";
    }
    // Allow alphanumeric, underscore, and hyphen
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      return "Username can only contain letters, numbers, underscores, and hyphens";
    }
    return "";
  };

  const validateEmail = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Email is required";
    }
    // Proper email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (value: string): string => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (value.length > 128) {
      return "Password is too long (maximum 128 characters)";
    }
    // Check for at least one letter and one number
    if (!/[a-zA-Z]/.test(value)) {
      return "Password must contain at least one letter";
    }
    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const validateConfirmPassword = (value: string, originalPassword: string): string => {
    if (!value) {
      return "Please confirm your password";
    }
    if (value !== originalPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  // Real-time validation on blur
  const handleUsernameBlur = () => {
    const error = validateUsername(username);
    setErrors((prev) => ({ ...prev, username: error }));
  };

  const handleEmailBlur = () => {
    const error = validateEmail(email);
    setErrors((prev) => ({ ...prev, email: error }));
  };

  const handlePasswordBlur = () => {
    const error = validatePassword(password);
    setErrors((prev) => ({ ...prev, password: error }));
    // Also validate confirm password if it has a value
    if (confirmPassword) {
      const confirmError = validateConfirmPassword(confirmPassword, password);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleConfirmPasswordBlur = () => {
    const error = validateConfirmPassword(confirmPassword, password);
    setErrors((prev) => ({ ...prev, confirmPassword: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim all inputs
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    
    // Reset errors
    setErrors({ username: "", email: "", password: "", confirmPassword: "" });
    
    // Validate all fields
    const usernameError = validateUsername(trimmedUsername);
    const emailError = validateEmail(trimmedEmail);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password);

    const newErrors = {
      username: usernameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    };

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
      // Parse backend error messages
      if (errorMessage.toLowerCase().includes("username")) {
        setErrors((prev) => ({ 
          ...prev, 
          username: errorMessage.includes("already exists") 
            ? "Username is already taken" 
            : errorMessage 
        }));
      } else if (errorMessage.toLowerCase().includes("email")) {
        setErrors((prev) => ({ 
          ...prev, 
          email: errorMessage.includes("already exists") 
            ? "Email is already registered" 
            : errorMessage 
        }));
      } else if (errorMessage.toLowerCase().includes("password")) {
        setErrors((prev) => ({ ...prev, password: errorMessage }));
      } else {
        // Generic error - try to assign to most likely field
        setErrors((prev) => ({ ...prev, username: errorMessage }));
      }
    }
  };

  return (
    <div 
      className="relative flex h-screen flex-col overflow-hidden px-4 py-6"
      style={{
        backgroundImage: "url('/assets/images/background-image.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >

      {/* Back Button */}
      <div className="absolute left-4 top-6 z-20 sm:left-8">
        <BackButton href="/" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {/* Brain Icon */}
          <div className="flex justify-center animate-scale-in-bounce">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary animate-pulse">
              <FontAwesomeIcon icon={faBrain} className="text-white" size="2x" />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="space-y-2 text-center animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Create Account
            </h1>
            <p className="text-sm text-gray-400">
              Join us and start training your brain today!
            </p>
          </div>

          {/* Registration Form */}
          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-sm sm:p-8 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <InputField
                label="Username"
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  // Clear error when user starts typing
                  if (errors.username) {
                    setErrors((prev) => ({ ...prev, username: "" }));
                  }
                }}
                onBlur={handleUsernameBlur}
                placeholder="Choose a username (3-30 characters)"
                autoComplete="username"
                error={errors.username}
                required
              />

              {/* Email Field */}
              <InputField
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Clear error when user starts typing
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                onBlur={handleEmailBlur}
                placeholder="Enter your email address"
                autoComplete="email"
                error={errors.email}
                required
              />

              {/* Password Field */}
              <div className="space-y-2">
                <InputField
                  label="Password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    // Clear error when user starts typing
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }
                    // Re-validate confirm password if it has a value
                    if (confirmPassword) {
                      const confirmError = validateConfirmPassword(confirmPassword, e.target.value);
                      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
                    }
                  }}
                  onBlur={handlePasswordBlur}
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
                {/* Password Requirements Helper Text */}
                <p className="text-xs text-gray-400 px-1">
                  Create a password (min 6 characters, include letters and numbers)
                </p>
              </div>

              {/* Confirm Password Field */}
              <InputField
                label="Confirm Password"
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  // Clear error when user starts typing
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }
                }}
                onBlur={handleConfirmPasswordBlur}
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
