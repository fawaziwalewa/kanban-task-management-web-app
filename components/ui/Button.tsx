"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary-l" | "primary-s" | "secondary" | "destructive";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary-l",
  fullWidth = false,
  icon,
  className = "",
  disabled = false,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold select-none cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-center";

  const variantStyles: Record<ButtonVariant, string> = {
    "primary-l":
      "h-12 px-6 text-[15px] leading-[19px] rounded-full bg-primary hover:bg-primary-hover text-white active:scale-[0.99]",
    "primary-s":
      "h-10 px-5 text-[13px] leading-[23px] rounded-full bg-primary hover:bg-primary-hover text-white active:scale-[0.99]",
    secondary:
      "h-10 px-5 text-[13px] leading-[23px] rounded-full bg-primary/10 hover:bg-primary/25 text-primary dark:bg-white dark:hover:bg-white/90 dark:text-primary active:scale-[0.99]",
    destructive:
      "h-10 px-5 text-[13px] leading-[23px] rounded-full bg-destructive hover:bg-destructive-hover text-white active:scale-[0.99]",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-flex mr-2">{icon}</span>}
      {children}
    </button>
  );
}
