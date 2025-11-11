import Link from "next/link";

interface FooterProps {
  showLinks?: boolean;
  copyrightYear?: string;
}

export default function Footer({ 
  showLinks = false,
  copyrightYear = "2023" 
}: FooterProps) {
  return (
    <footer className="relative z-10 py-6 text-center">
      {/* {showLinks && (
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 mb-3">
          <Link
            href="/about"
            className="transition-colors hover:text-[#4CAF50]"
          >
            About Us
          </Link>
          <span className="text-gray-600">•</span>
          <Link
            href="/contact"
            className="transition-colors hover:text-[#4CAF50]"
          >
            Contact
          </Link>
          <span className="text-gray-600">•</span>
          <Link
            href="/privacy"
            className="transition-colors hover:text-[#4CAF50]"
          >
            Privacy Policy
          </Link>
        </div>
      )} */}
      <div className="text-xs text-gray-500">
        © {copyrightYear} Banana Brain Trainer Game
      </div>
    </footer>
  );
}

