"use client";

import { useKanban } from "../../context/KanbanContext";
import { Icon } from "../ui/Icon";
import { ThemeToggle } from "../ui/ThemeToggle";

export function Sidebar() {
  const {
    boards,
    activeBoardIndex,
    isSidebarOpen,
    setActiveBoardIndex,
    setSidebarOpen,
    openAddBoard,
  } = useKanban();

  return (
    <>
      {/* Main Sidebar */}
      <aside
        className={`hidden md:flex shrink-0 bg-white dark:bg-dark-grey border-r border-lines-light dark:border-lines-dark flex-col justify-between transition-all duration-300 z-10 select-none
          ${isSidebarOpen
            ? "w-65 lg:w-75"
            : "w-0 -translate-x-full overflow-hidden border-none"
          }`}
      >
        {/* Boards List */}
        <div className="pt-6 pr-6 space-y-4">
          <div className="px-6 lg:px-8">
            <span className="text-[12px] font-bold text-medium-grey tracking-[2.4px]">
              ALL BOARDS ({boards.length})
            </span>
          </div>

          <nav className="space-y-1">
            {boards.map((board, idx) => {
              const isActive = idx === activeBoardIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveBoardIndex(idx)}
                  className={`w-full h-12 pl-6 lg:pl-8 rounded-r-full flex items-center gap-4 text-[15px] font-bold transition-all cursor-pointer text-left
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
              className="w-full h-12 pl-6 lg:pl-8 rounded-r-full flex items-center gap-4 text-[15px] font-bold text-primary hover:bg-primary/10 dark:hover:bg-white transition-all cursor-pointer"
            >
              <Icon name="board" className="brightness-125" />
              <span>+ Create New Board</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Controls */}
        <div className="p-4 lg:p-6 space-y-4 pr-6">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="w-full h-12 rounded-r-full flex items-center gap-4 text-[15px] font-bold text-medium-grey hover:text-primary dark:hover:text-white transition-colors cursor-pointer pl-2"
          >
            <Icon name="hide-sidebar" />
            <span>Hide Sidebar</span>
          </button>
        </div>
      </aside>

      {/* Floating Show Sidebar Button */}
      {!isSidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Show Sidebar"
          className="hidden md:flex absolute bottom-8 left-0 z-30 h-12 w-14 bg-primary hover:bg-primary-hover rounded-r-full items-center justify-center cursor-pointer transition-colors shadow-lg"
        >
          <Icon name="show-sidebar" />
        </button>
      )}
    </>
  );
}
