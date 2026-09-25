"use client";

import { useState } from "react";
import { useKanban } from "../../context/KanbanContext";
import { Modal } from "./Modal";
import { TextField } from "../ui/TextField";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

interface BoardFormModalProps {
  mode: "add" | "edit";
}

function BoardFormContent({
  mode,
  initialName,
  initialColumns,
}: {
  mode: "add" | "edit";
  initialName: string;
  initialColumns: { id?: string; name: string }[];
}) {
  const { createBoard, updateBoard } = useKanban();

  const [name, setName] = useState(initialName);
  const [columns, setColumns] = useState<{ id?: string; name: string }[]>(initialColumns);
  const [errors, setErrors] = useState<{
    name?: boolean;
    columns?: boolean[];
  }>({});

  const handleColumnChange = (index: number, val: string) => {
    const updated = [...columns];
    updated[index].name = val;
    setColumns(updated);

    if (errors.columns && errors.columns[index] && val.trim()) {
      const updatedErrors = { ...errors };
      if (updatedErrors.columns) {
        updatedErrors.columns[index] = false;
        setErrors(updatedErrors);
      }
    }
  };

  const handleAddColumn = () => {
    setColumns([...columns, { name: "" }]);
  };

  const handleRemoveColumn = (index: number) => {
    if (columns.length > 1) {
      setColumns(columns.filter((_, idx) => idx !== index));
      if (errors.columns) {
        setErrors({
          ...errors,
          columns: errors.columns.filter((_, idx) => idx !== index),
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const newErrors: { name?: boolean; columns?: boolean[] } = {};

    if (!name.trim()) {
      newErrors.name = true;
      hasError = true;
    }

    const columnErrors = columns.map((c) => !c.name.trim());
    if (columnErrors.some(Boolean)) {
      newErrors.columns = columnErrors;
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    if (mode === "add") {
      createBoard(
        name,
        columns.map((c) => c.name)
      );
    } else {
      updateBoard(name, columns);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h2 className="text-[18px] leading-5.75 font-bold text-black-main dark:text-white">
        {mode === "add" ? "Add New Board" : "Edit Board"}
      </h2>

      {/* Board Name */}
      <TextField
        label="Board Name"
        placeholder="e.g. Web Design"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name && e.target.value.trim()) {
            setErrors({ ...errors, name: false });
          }
        }}
        error={errors.name}
        errorMessage="Can't be empty"
      />

      {/* Board Columns list */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-bold text-medium-grey dark:text-white">
          Board Columns
        </label>
        <div className="flex flex-col gap-3">
          {columns.map((column, cIdx) => (
            <div key={cIdx} className="flex items-center gap-3">
              <div className="flex-1">
                <TextField
                  placeholder={
                    cIdx === 0
                      ? "e.g. Todo"
                      : cIdx === 1
                      ? "e.g. Doing"
                      : "e.g. Done"
                  }
                  value={column.name}
                  onChange={(e) => handleColumnChange(cIdx, e.target.value)}
                  error={errors.columns?.[cIdx]}
                  errorMessage="Can't be empty"
                />
              </div>
              <button
                type="button"
                aria-label="Remove column"
                onClick={() => handleRemoveColumn(cIdx)}
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
          onClick={handleAddColumn}
          className="mt-2"
        >
          + Add New Column
        </Button>
      </div>

      {/* Submit button */}
      <Button type="submit" variant="primary-s" fullWidth>
        {mode === "add" ? "Create New Board" : "Save Changes"}
      </Button>
    </form>
  );
}

export function BoardFormModal({ mode }: BoardFormModalProps) {
  const {
    activeBoard,
    isAddBoardOpen,
    isEditBoardOpen,
    closeAddBoard,
    closeEditBoard,
  } = useKanban();

  const isOpen = mode === "add" ? isAddBoardOpen : isEditBoardOpen;
  const onClose = mode === "add" ? closeAddBoard : closeEditBoard;

  if (!isOpen) return null;

  const initialName = mode === "edit" && activeBoard ? activeBoard.name : "";
  const initialColumns =
    mode === "edit" && activeBoard && activeBoard.columns.length > 0
      ? activeBoard.columns.map((c) => ({ name: c.name }))
      : [{ name: "Todo" }, { name: "Doing" }];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <BoardFormContent
        key={`${mode}-${initialName}`}
        mode={mode}
        initialName={initialName}
        initialColumns={initialColumns}
      />
    </Modal>
  );
}
