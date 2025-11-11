import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface BackButtonProps {
  href: string;
  className?: string;
}

export default function BackButton({ href, className = "" }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-lg bg-[#223632] px-4 py-2 text-white text-sm font-medium transition-colors hover:bg-[#2a423d] ${className}`}
    >
      <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
      <span>Back</span>
    </Link>
  );
}

