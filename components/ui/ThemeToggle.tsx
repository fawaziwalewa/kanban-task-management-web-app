"use client";

import { useSyncExternalStore, useEffect } from "react";
import Image from "next/image";

interface ThemeToggleProps {
  className?: string;
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === "class") {
        callback();
      }
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return true;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kanban_theme");
      if (saved === "light") {
        document.documentElement.classList.remove("dark");
      } else if (saved === "dark") {
        document.documentElement.classList.add("dark");
      }
    } catch {}
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("kanban_theme", "dark");
      } catch {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("kanban_theme", "light");
      } catch {}
    }
  };

  return (
    <div
      className={`h-12 rounded-md bg-light-grey dark:bg-very-dark-grey flex items-center justify-center gap-6 px-4 select-none ${className}`}
    >
      <Image
        src="/icon-light-theme.svg"
        alt=""
        aria-hidden="true"
        width={18}
        height={18}
        className="w-auto h-auto opacity-80"
      />

      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark mode"
        onClick={toggleTheme}
        className="relative w-10 h-5 rounded-full bg-primary hover:bg-primary-hover p-0.75 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <div
          className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 ${
            isDark ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>

      <Image
        src="/icon-dark-theme.svg"
        alt=""
        aria-hidden="true"
        width={15}
        height={15}
        className="w-auto h-auto opacity-80"
      />
    </div>
  );
}
