import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  children: ReactNode;
  icon?: ReactNode;
}

export default function Button({
  variant = "primary",
  fullWidth = false,
  children,
  icon,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2";
  
  const variantStyles = {
    primary: "bg-primary text-black hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/50",
    secondary: "bg-white/5 text-white border-2 border-white/10 backdrop-blur-sm hover:border-white/20 hover:bg-white/10",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-black",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} px-6 py-3 text-sm sm:px-8 sm:text-base ${className}`}
      {...props}
    >
      {children}
      {icon && <span>{icon}</span>}
    </button>
  );
}

