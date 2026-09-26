"use client";

import type { Column as ColumnType } from "../../types/kanban";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  column: ColumnType;
  colIndex: number;
}

const COLUMN_DOT_COLORS = [
  "#49C4E5", // Cyan
  "#8471F2", // Purple
  "#67E2AE", // Green
  "#FF9898", // Coral
  "#E5A449", // Orange
  "#E549A3", // Pink
];

export function Column({ column, colIndex }: ColumnProps) {
  const dotColor =
    column.color || COLUMN_DOT_COLORS[colIndex % COLUMN_DOT_COLORS.length];

  return (
    <div className="w-70 shrink-0 flex flex-col gap-5">
      {/* Column Header */}
      <div className="flex items-center gap-3">
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: dotColor }}
        />
        <h3 className="text-[12px] font-bold text-medium-grey tracking-[2.4px] uppercase truncate">
          {column.name} ({column.tasks.length})
        </h3>
      </div>

      {/* Column Tasks List */}
      <div className="flex flex-col gap-5 min-h-25">
        {column.tasks.map((task, tIdx) => (
          <TaskCard
            key={task.id || `${task.title}-${tIdx}`}
            task={task}
            colIndex={colIndex}
            taskIndex={tIdx}
          />
        ))}
      </div>
    </div>
  );
}
