"use client";

import { useKanban } from "../../context/KanbanContext";
import { Modal } from "./Modal";
import { OptionsMenu } from "./OptionsMenu";
import { Checkbox } from "../ui/Checkbox";
import { Dropdown } from "../ui/Dropdown";

export function TaskDetailsModal() {
  const {
    activeBoard,
    selectedTask,
    isTaskDetailsOpen,
    closeTaskDetails,
    openEditTask,
    openDeleteTask,
    toggleSubtask,
    updateTaskStatus,
  } = useKanban();

  if (!selectedTask || !activeBoard) return null;

  const completedSubtasksCount = selectedTask.subtasks.filter(
    (s) => s.isCompleted
  ).length;
  const totalSubtasksCount = selectedTask.subtasks.length;

  const statusOptions = activeBoard.columns.map((col) => ({
    label: col.name,
    value: col.name,
  }));

  const menuItems = [
    {
      label: "Edit Task",
      onClick: openEditTask,
    },
    {
      label: "Delete Task",
      onClick: openDeleteTask,
      isDestructive: true,
    },
  ];

  return (
    <Modal isOpen={isTaskDetailsOpen} onClose={closeTaskDetails}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[18px] leading-5.75 font-bold text-black-main dark:text-white">
            {selectedTask.title}
          </h2>
          <OptionsMenu items={menuItems} ariaLabel="Task options" />
        </div>

        {/* Description */}
        {selectedTask.description && (
          <p className="text-[13px] leading-5.75 font-medium text-medium-grey">
            {selectedTask.description}
          </p>
        )}

        {/* Subtasks */}
        <div>
          <h3 className="text-[12px] font-bold text-medium-grey dark:text-white mb-4">
            Subtasks ({completedSubtasksCount} of {totalSubtasksCount})
          </h3>
          <div className="flex flex-col gap-2">
            {selectedTask.subtasks.map((subtask, sIdx) => (
              <Checkbox
                key={sIdx}
                checked={subtask.isCompleted}
                onChange={() => toggleSubtask(sIdx)}
                label={subtask.title}
              />
            ))}
          </div>
        </div>

        {/* Current Status Dropdown */}
        <div>
          <Dropdown
            label="Current Status"
            options={statusOptions}
            value={selectedTask.status}
            onChange={(newStatus) => updateTaskStatus(newStatus)}
          />
        </div>
      </div>
    </Modal>
  );
}
