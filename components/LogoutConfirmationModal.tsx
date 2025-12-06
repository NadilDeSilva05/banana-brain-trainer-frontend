"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faTimes } from "@fortawesome/free-solid-svg-icons";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
}: LogoutConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-modal-enter">
      <div className="relative w-full max-w-sm mx-4 rounded-2xl bg-[#223632] shadow-2xl border-2 border-[#4CAF50]/30 animate-modal-content">
        {/* Modal Header */}
        <div className="px-6 py-6 border-b border-[#4CAF50]/30 text-center">
          <div className="flex items-center justify-center mb-3 animate-scale-in-bounce">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1A2B27] border-2 border-[#4CAF50]">
              <FontAwesomeIcon icon={faRightFromBracket} className="text-[#4CAF50] text-2xl" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 animate-slide-in-down">Logout</h2>
          <p className="text-gray-300 text-sm animate-fade-in">Are you sure you want to logout?</p>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 pt-4 space-y-3">
          <button
            onClick={onConfirm}
            className="w-full rounded-xl bg-red-600 px-6 py-4 text-white font-semibold hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg transform hover:scale-105 active:scale-95 animate-slide-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="text-lg" />
            <span>Yes, Logout</span>
          </button>
          
          <button
            onClick={onCancel}
            className="w-full rounded-xl bg-[#1A2B27] px-6 py-4 text-white font-semibold hover:bg-[#2a423d] transition-all duration-300 border-2 border-[#4CAF50]/30 flex items-center justify-center gap-3 transform hover:scale-105 hover:shadow-lg animate-slide-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <FontAwesomeIcon icon={faTimes} className="text-[#4CAF50] text-lg" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
}

