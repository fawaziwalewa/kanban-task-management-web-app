"use client";

import { useKanban } from "../../context/KanbanContext";
import { Modal } from "./Modal";
import { Button } from "../ui/Button";

interface DeleteModalProps {
  type: "board" | "task";
}

export function DeleteModal({ type }: DeleteModalProps) {
  const {
    activeBoard,
    selectedTask,
    isDeleteBoardOpen,
    isDeleteTaskOpen,
    closeDeleteBoard,
    closeDeleteTask,
    deleteBoard,
    deleteTask,
  } = useKanban();

  const isOpen = type === "board" ? isDeleteBoardOpen : isDeleteTaskOpen;
  const onClose = type === "board" ? closeDeleteBoard : closeDeleteTask;

  const handleDelete = () => {
    if (type === "board") {
      deleteBoard();
    } else {
      deleteTask();
    }
  };

  const title = type === "board" ? "Delete this board?" : "Delete this task?";
  const description =
    type === "board"
      ? `Are you sure you want to delete the '${activeBoard?.name || "current"}' board? This action will remove all columns and tasks and cannot be reversed.`
      : `Are you sure you want to delete the '${selectedTask?.title || "selected"}' task and its subtasks? This action cannot be reversed.`;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <h2 className="text-[18px] leading-5.75 font-bold text-destructive">
          {title}
        </h2>

        <p className="text-[13px] leading-5.75 font-medium text-medium-grey">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="button"
            variant="destructive"
            fullWidth
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
