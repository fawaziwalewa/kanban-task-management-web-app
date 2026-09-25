"use client";

import Link from "next/link";
import { Button } from "../components/ui/Button";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { Logo } from "../components/ui/Logo";
import { Icon } from "../components/ui/Icon";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-light-grey dark:bg-very-dark-grey text-black-main dark:text-white flex flex-col justify-between transition-colors duration-200">
      {/* Top Navigation */}
      <header className="w-full px-6 sm:px-12 py-6 flex items-center justify-between border-b border-lines-light dark:border-lines-dark bg-white dark:bg-dark-grey">
        <div className="flex items-center gap-4">
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/dashboard">
            <Button variant="primary-s">Open Board</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/30 text-primary dark:text-primary-hover text-[13px] font-bold">
          <Icon name="board" size={14} />
          <span>Task Management Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-black-main dark:text-white max-w-2xl leading-[1.2]">
          Manage your tasks & workflows seamlessly
        </h1>

        <p className="text-medium-grey text-base sm:text-lg max-w-xl font-medium leading-relaxed">
          Stay organized, track subtasks, and streamline project delivery with an intuitive Kanban workspace designed for maximum focus.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Link href="/dashboard">
            <Button
              variant="primary-l"
              className="px-10 shadow-lg shadow-primary/30 hover:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-[13px] text-medium-grey border-t border-lines-light dark:border-lines-dark">
        <p>Frontend Mentor Challenge • Kanban Task Management</p>
      </footer>
    </div>
  );
}
