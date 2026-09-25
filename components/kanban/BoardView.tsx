"use client";

import { useKanban } from "../../context/KanbanContext";
import { Column } from "./Column";
import { EmptyBoard } from "./EmptyBoard";

export function BoardView() {
  const { boards, activeBoard, openEditBoard } = useKanban();

  if (boards.length === 0) {
    return <EmptyBoard type="no-boards" />;
  }

  if (!activeBoard || activeBoard.columns.length === 0) {
    return <EmptyBoard type="no-columns" />;
  }

  return (
    <main className="flex-1 overflow-x-auto overflow-y-auto p-6 flex gap-6 items-start">
      {activeBoard.columns.map((column, colIdx) => (
        <Column key={colIdx} column={column} colIndex={colIdx} />
      ))}

      {/* + New Column CTA card */}
      <button
        type="button"
        onClick={openEditBoard}
        className="w-70 shrink-0 min-h-125 mt-9 rounded-lg border-2 border-dashed border-medium-grey/25 hover:border-primary bg-gradient-to-b from-lines-light/30 to-lines-light/10 dark:from-dark-grey/40 dark:to-dark-grey/10 flex items-center justify-center cursor-pointer transition-all group select-none"
      >
        <span className="text-xl font-bold text-medium-grey group-hover:text-primary transition-colors">
          + New Column
        </span>
      </button>
    </main>
  );
}
