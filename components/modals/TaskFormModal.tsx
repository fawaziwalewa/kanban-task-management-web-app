"use client";

import { useState } from "react";
import { useKanban } from "../../context/KanbanContext";
import { Modal } from "./Modal";
import { TextField, TextArea } from "../ui/TextField";
import { Button } from "../ui/Button";
import { Dropdown } from "../ui/Dropdown";
import { Icon } from "../ui/Icon";

interface TaskFormModalProps {
  mode: "add" | "edit";
}

function TaskFormContent({
  mode,
  initialTitle,
  initialDescription,
  initialStatus,
  initialSubtasks,
  statusOptions,
}: {
  mode: "add" | "edit";
  initialTitle: string;
  initialDescription: string;
  initialStatus: string;
  initialSubtasks: { title: string; isCompleted: boolean }[];
  statusOptions: { label: string; value: string }[];
}) {
  const { createTask, updateTask } = useKanban();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [status, setStatus] = useState(initialStatus);
  const [subtasks, setSubtasks] = useState<{ title: string; isCompleted: boolean }[]>(initialSubtasks);
  const [errors, setErrors] = useState<{
    title?: boolean;
    subtasks?: boolean[];
  }>({});

  const handleSubtaskChange = (index: number, val: string) => {
    const updated = [...subtasks];
    updated[index].title = val;
    setSubtasks(updated);

    if (errors.subtasks && errors.subtasks[index] && val.trim()) {
      const updatedErrors = { ...errors };
      if (updatedErrors.subtasks) {
        updatedErrors.subtasks[index] = false;
        setErrors(updatedErrors);
      }
    }
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { title: "", isCompleted: false }]);
  };

  const handleRemoveSubtask = (index: number) => {
    if (subtasks.length > 1) {
      setSubtasks(subtasks.filter((_, idx) => idx !== index));
      if (errors.subtasks) {
        setErrors({
          ...errors,
          subtasks: errors.subtasks.filter((_, idx) => idx !== index),
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const newErrors: { title?: boolean; subtasks?: boolean[] } = {};

    if (!title.trim()) {
      newErrors.title = true;
      hasError = true;
    }

    const subtaskErrors = subtasks.map((s) => !s.title.trim());
    if (subtaskErrors.some(Boolean)) {
      newErrors.subtasks = subtaskErrors;
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    if (mode === "add") {
      createTask({
        title,
        description,
        status: status || statusOptions[0]?.value || "Todo",
        subtasks: subtasks.map((s) => s.title),
      });
    } else {
      updateTask({
        title,
        description,
        status: status || statusOptions[0]?.value || "Todo",
        subtasks,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h2 className="text-[18px] leading-5.75 font-bold text-black-main dark:text-white">
        {mode === "add" ? "Add New Task" : "Edit Task"}
      </h2>

      {/* Title Input */}
      <TextField
        label="Title"
        placeholder="e.g. Take coffee break"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (errors.title && e.target.value.trim()) {
            setErrors({ ...errors, title: false });
          }
        }}
        error={errors.title}
        errorMessage="Can't be empty"
      />

      {/* Description Textarea */}
      <TextArea
        label="Description"
        placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />

      {/* Subtasks dynamic list */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-bold text-medium-grey dark:text-white">
          Subtasks
        </label>
        <div className="flex flex-col gap-3">
          {subtasks.map((subtask, sIdx) => (
            <div key={sIdx} className="flex items-center gap-3">
              <div className="flex-1">
                <TextField
                  placeholder={
                    sIdx === 0
                      ? "e.g. Make coffee"
                      : sIdx === 1
                      ? "e.g. Drink coffee & smile"
                      : "e.g. Have another cup"
                  }
                  value={subtask.title}
                  onChange={(e) => handleSubtaskChange(sIdx, e.target.value)}
                  error={errors.subtasks?.[sIdx]}
                  errorMessage="Can't be empty"
                />
              </div>
              <button
                type="button"
                aria-label="Remove subtask"
                onClick={() => handleRemoveSubtask(sIdx)}
                className="p-2 text-medium-grey hover:text-destructive transition-colors cursor-pointer"
              >
                <Icon name="cross" />
              </button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={handleAddSubtask}
          className="mt-2"
        >
          + Add New Subtask
        </Button>
      </div>

      {/* Status Dropdown */}
      <Dropdown
        label="Status"
        options={statusOptions}
        value={status || statusOptions[0]?.value || ""}
        onChange={(newVal) => setStatus(newVal)}
      />

      {/* Submit button */}
      <Button type="submit" variant="primary-s" fullWidth>
        {mode === "add" ? "Create Task" : "Save Changes"}
      </Button>
    </form>
  );
}

export function TaskFormModal({ mode }: TaskFormModalProps) {
  const {
    activeBoard,
    selectedTask,
    isAddTaskOpen,
    isEditTaskOpen,
    closeAddTask,
    closeEditTask,
  } = useKanban();

  const isOpen = mode === "add" ? isAddTaskOpen : isEditTaskOpen;
  const onClose = mode === "add" ? closeAddTask : closeEditTask;

  if (!isOpen || !activeBoard) return null;

  const statusOptions = activeBoard.columns.map((col) => ({
    label: col.name,
    value: col.name,
  }));

  const initialTitle = mode === "edit" && selectedTask ? selectedTask.title : "";
  const initialDescription = mode === "edit" && selectedTask ? selectedTask.description || "" : "";
  const initialStatus =
    mode === "edit" && selectedTask
      ? selectedTask.status
      : activeBoard.columns[0]?.name || "Todo";
  const initialSubtasks =
    mode === "edit" && selectedTask && selectedTask.subtasks.length > 0
      ? selectedTask.subtasks.map((s) => ({ ...s }))
      : [
          { title: "", isCompleted: false },
          { title: "", isCompleted: false },
        ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <TaskFormContent
        key={`${mode}-${initialTitle}-${initialStatus}`}
        mode={mode}
        initialTitle={initialTitle}
        initialDescription={initialDescription}
        initialStatus={initialStatus}
        initialSubtasks={initialSubtasks}
        statusOptions={statusOptions}
      />
    </Modal>
  );
}
