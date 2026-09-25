"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  preventBackdropClose?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  className = "",
  preventBackdropClose = false,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 overflow-y-auto"
      onClick={(e) => {
        if (!preventBackdropClose && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className={`w-full max-w-120 bg-white dark:bg-dark-grey rounded-md p-6 sm:p-8 shadow-xl relative overflow-visible my-auto ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
