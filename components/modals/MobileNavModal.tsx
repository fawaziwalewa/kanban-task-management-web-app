"use client";

import { useEffect } from "react";
import { useKanban } from "../../context/KanbanContext";
import { Icon } from "../ui/Icon";
import { ThemeToggle } from "../ui/ThemeToggle";

export function MobileNavModal() {
  const {
    boards,
    activeBoardIndex,
    isMobileNavOpen,
    closeMobileNav,
    setActiveBoardIndex,
    openAddBoard,
  } = useKanban();

  useEffect(() => {
    if (!isMobileNavOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMobileNav();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileNavOpen, closeMobileNav]);

  if (!isMobileNavOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Board Navigation"
      className="md:hidden fixed inset-0 top-16 sm:top-20 z-40 bg-black/50 p-6 flex justify-center items-start animate-in fade-in-50 duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeMobileNav();
        }
      }}
    >
      <div className="w-full max-w-75 bg-white dark:bg-dark-grey rounded-lg py-4 shadow-[0px_10px_20px_0px_rgba(54,78,126,0.25)] border border-medium-grey/10 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="px-6">
          <span className="text-[12px] font-bold text-medium-grey tracking-[2.4px]">
            ALL BOARDS ({boards.length})
          </span>
        </div>

        <nav className="pr-4 space-y-1" aria-label="Boards List">
          {boards.map((board, idx) => {
            const isActive = idx === activeBoardIndex;
            return (
              <button
                key={board.id || idx}
                type="button"
                onClick={() => setActiveBoardIndex(idx)}
                aria-current={isActive ? "page" : undefined}
                className={`w-full h-12 pl-6 rounded-r-full flex items-center gap-3 text-[15px] font-bold transition-all cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                  ${isActive
                    ? "bg-primary text-white"
                    : "text-medium-grey hover:bg-primary/10 hover:text-primary dark:hover:bg-white dark:hover:text-primary"
                  }`}
              >
                <Icon
                  name="board"
                  className={isActive ? "brightness-200" : "opacity-70"}
                />
                <span className="truncate">{board.name}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={openAddBoard}
            className="w-full h-12 pl-6 rounded-r-full flex items-center gap-3 text-[15px] font-bold text-primary hover:bg-primary/10 dark:hover:bg-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Icon name="board" className="brightness-125" />
            <span>+ Create New Board</span>
          </button>
        </nav>

        <div className="px-4 pt-2">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
