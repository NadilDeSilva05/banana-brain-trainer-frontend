"use client";

import Header from "./Header";
import Footer from "./Footer";

// Export individual components for flexible usage
export { Header, Footer };

// Main Navigation wrapper component (optional - for convenience)
interface NavigationProps {
  // Header props
  username?: string;
  showUserInfo?: boolean;
  onLogout?: () => void;
  
  // Footer props
  showFooterLinks?: boolean;
  copyrightYear?: string;
  
  // Layout props
  children: React.ReactNode;
  className?: string;
  backgroundClassName?: string;
}

export default function Navigation({
  username,
  showUserInfo = true,
  onLogout,
  showFooterLinks = false,
  copyrightYear = "2023",
  children,
  className = "",
  backgroundClassName = "bg-[#1A2B27]",
}: NavigationProps) {
  return (
    <div className={`relative flex h-screen flex-col overflow-hidden ${backgroundClassName} ${className}`}>
      <Header 
        username={username}
        showUserInfo={showUserInfo}
        onLogout={onLogout}
      />
      
      <div className="flex-1">
        {children}
      </div>
      
      <Footer 
        showLinks={showFooterLinks}
        copyrightYear={copyrightYear}
      />
    </div>
  );
}

