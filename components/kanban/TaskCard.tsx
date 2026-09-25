"use client";

import { useKanban } from "../../context/KanbanContext";
import type { Task } from "../../types/kanban";

interface TaskCardProps {
  task: Task;
  colIndex: number;
  taskIndex: number;
}

export function TaskCard({ task, colIndex, taskIndex }: TaskCardProps) {
  const { openTaskDetails } = useKanban();

  const completedCount = task.subtasks.filter((s) => s.isCompleted).length;
  const totalCount = task.subtasks.length;

  return (
    <article
      onClick={() => openTaskDetails(colIndex, taskIndex)}
      className="group p-5 rounded-lg bg-white dark:bg-dark-grey shadow-[0px_4px_6px_0px_rgba(54,78,126,0.1)] border border-medium-grey/10 hover:border-primary/40 cursor-pointer transition-all hover:scale-[1.01] select-none text-left"
    >
      <h4 className="text-[15px] leading-5 font-bold text-black-main dark:text-white group-hover:text-primary transition-colors">
        {task.title}
      </h4>
      {totalCount > 0 && (
        <p className="mt-2 text-[12px] font-bold text-medium-grey">
          {completedCount} of {totalCount} subtasks
        </p>
      )}
    </article>
  );
}
