import { InputHTMLAttributes, ReactNode } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  icon?: ReactNode;
}

export default function InputField({
  label,
  id,
  error,
  icon,
  className = "",
  ...props
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-300"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-gray-500 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            icon ? "pr-12" : ""
          } ${error ? "border-red-500" : ""} ${className}`}
          {...props}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}

