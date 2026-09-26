import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskFormModal } from "../../components/modals/TaskFormModal";
import * as KanbanContext from "../../context/KanbanContext";
import React from "react";
import type { Board } from "../../types/kanban";

describe("TaskFormModal Component and Validation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockBoard: Board = {
    name: "Platform Launch",
    columns: [
      { name: "Todo", tasks: [] },
      { name: "Doing", tasks: [] },
    ],
  };

  it("renders Add New Task form inputs when open in add mode", () => {
    vi.spyOn(KanbanContext, "useKanban").mockReturnValue({
      activeBoard: mockBoard,
      selectedTask: null,
      isAddTaskOpen: true,
      isEditTaskOpen: false,
      closeAddTask: vi.fn(),
      closeEditTask: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
    } as unknown as KanbanContext.KanbanContextType);

    render(<TaskFormModal mode="add" />);

    expect(screen.getByRole("heading", { name: "Add New Task" })).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Task" })).toBeInTheDocument();
  });

  it("shows error validation when submitting empty task title", async () => {
    const user = userEvent.setup();
    const createTaskMock = vi.fn();

    vi.spyOn(KanbanContext, "useKanban").mockReturnValue({
      activeBoard: mockBoard,
      selectedTask: null,
      isAddTaskOpen: true,
      isEditTaskOpen: false,
      closeAddTask: vi.fn(),
      closeEditTask: vi.fn(),
      createTask: createTaskMock,
      updateTask: vi.fn(),
    } as unknown as KanbanContext.KanbanContextType);

    render(<TaskFormModal mode="add" />);

    const submitBtn = screen.getByRole("button", { name: "Create Task" });
    await user.click(submitBtn);

    expect(createTaskMock).not.toHaveBeenCalled();
    const errorAlerts = screen.getAllByRole("alert");
    expect(errorAlerts.length).toBeGreaterThan(0);
    expect(errorAlerts[0]).toHaveTextContent("Can't be empty");
  });
});
