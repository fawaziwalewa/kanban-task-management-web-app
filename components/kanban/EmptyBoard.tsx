"use client";

import { useKanban } from "../../context/KanbanContext";
import { Button } from "../ui/Button";

interface EmptyBoardProps {
  type?: "no-columns" | "no-boards";
}

export function EmptyBoard({ type = "no-columns" }: EmptyBoardProps) {
  const { openEditBoard, openAddBoard } = useKanban();

  if (type === "no-boards") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <h2 className="text-lg font-bold text-medium-grey max-w-md">
          You don&apos;t have any boards yet. Create a new board to get started.
        </h2>
        <Button variant="primary-l" onClick={openAddBoard}>
          + Create New Board
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
      <h2 className="text-lg font-bold text-medium-grey max-w-md">
        This board is empty. Create a new column to get started.
      </h2>
      <Button variant="primary-l" onClick={openEditBoard}>
        + Add New Column
      </Button>
    </div>
  );
}
