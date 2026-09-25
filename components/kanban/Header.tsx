"use client";

import Link from "next/link";
import { useKanban } from "../../context/KanbanContext";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { OptionsMenu } from "../modals/OptionsMenu";

export function Header() {
  const {
    boards,
    activeBoard,
    isSidebarOpen,
    isMobileNavOpen,
    toggleMobileNav,
    openAddTask,
    openEditBoard,
    openDeleteBoard,
  } = useKanban();

  const hasColumns = Boolean(activeBoard && activeBoard.columns.length > 0);
  const hasBoards = boards.length > 0;

  const boardMenuItems = [
    {
      label: "Edit Board",
      onClick: openEditBoard,
    },
    {
      label: "Delete Board",
      onClick: openDeleteBoard,
      isDestructive: true,
    },
  ];

  return (
    <header className="h-16 sm:h-20 md:h-24 bg-white dark:bg-dark-grey border-b border-lines-light dark:border-lines-dark flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
      {/* Left side */}
      <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0 h-full">
        {/* Desktop Logo container aligned with sidebar grid */}
        <div
          className={`hidden md:flex items-center shrink-0 h-full border-r border-lines-light dark:border-lines-dark -ml-4 sm:-ml-6 pl-4 sm:pl-6 pr-6 transition-all duration-300 ${
            isSidebarOpen ? "w-65 lg:w-75" : "w-auto"
          }`}
        >
          <Link href="/" aria-label="Kanban Home">
            <Logo />
          </Link>
        </div>

        {/* Mobile Logo */}
        <div className="md:hidden flex items-center shrink-0">
          <Link href="/" aria-label="Kanban Home">
            <Logo variant="mobile" />
          </Link>
        </div>

        {/* Mobile Title with dropdown chevron */}
        <div className="md:hidden flex items-center min-w-0">
          <button
            type="button"
            onClick={toggleMobileNav}
            className="flex items-center gap-2 cursor-pointer group text-left max-w-full outline-none"
            aria-expanded={isMobileNavOpen}
            aria-label="Toggle board selector"
          >
            <h1 className="text-lg font-bold text-black-main dark:text-white truncate">
              {activeBoard?.name || "No Boards"}
            </h1>
            <Icon
              name={isMobileNavOpen ? "chevron-up" : "chevron-down"}
              className="transition-transform duration-200 shrink-0"
            />
          </button>
        </div>

        {/* Desktop & Tablet Title */}
        <h1 className="hidden md:block text-xl lg:text-2xl font-bold text-black-main dark:text-white truncate">
          {activeBoard?.name || "No Boards"}
        </h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Single Responsive Add Task Button */}
        <Button
          variant="primary-l"
          disabled={!hasColumns || !hasBoards}
          onClick={openAddTask}
          className="h-8 px-4.5 sm:h-12 sm:px-6 text-[15px] rounded-full shrink-0"
          aria-label="Add New Task"
        >
          <span className="hidden sm:inline">+ Add New Task</span>
          <span className="sm:hidden flex items-center justify-center">
            <Icon name="add-task-mobile" />
          </span>
        </Button>

        {/* Board Options Menu */}
        <OptionsMenu
          items={boardMenuItems}
          disabled={!hasBoards}
          ariaLabel="Board options"
        />
      </div>
    </header>
  );
}
