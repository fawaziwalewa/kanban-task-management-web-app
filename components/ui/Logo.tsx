"use client";

import Image from "next/image";

interface LogoProps {
  variant?: "auto" | "dark" | "light" | "mobile";
  className?: string;
}

export function Logo({ variant = "auto", className = "" }: LogoProps) {
  if (variant === "mobile") {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <Image
          src="/logo-mobile.svg"
          alt="Kanban Logo"
          width={24}
          height={25}
          style={{ width: "auto", height: "auto" }}
          priority
        />
      </div>
    );
  }

  if (variant === "light") {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <Image
          src="/logo-light.svg"
          alt="Kanban Logo"
          width={152}
          height={25}
          style={{ width: "auto", height: "auto" }}
          priority
        />
      </div>
    );
  }

  if (variant === "dark") {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <Image
          src="/logo-dark.svg"
          alt="Kanban Logo"
          width={152}
          height={25}
          style={{ width: "auto", height: "auto" }}
          priority
        />
      </div>
    );
  }

  // Auto variant: renders dark logo in light mode and light logo in dark mode
  return (
    <div className={`inline-flex items-center ${className}`}>
      {/* Desktop Light Theme Logo */}
      <Image
        src="/logo-dark.svg"
        alt="Kanban Logo"
        width={152}
        height={25}
        style={{ width: "auto", height: "auto" }}
        className="block dark:hidden"
        priority
      />
      {/* Desktop Dark Theme Logo */}
      <Image
        src="/logo-light.svg"
        alt="Kanban Logo"
        width={152}
        height={25}
        style={{ width: "auto", height: "auto" }}
        className="hidden dark:block"
        priority
      />
    </div>
  );
}
