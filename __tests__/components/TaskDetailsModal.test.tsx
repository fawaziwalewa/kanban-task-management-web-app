import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskDetailsModal } from "../../components/modals/TaskDetailsModal";
import * as KanbanContext from "../../context/KanbanContext";
import React from "react";
import type { Task, Board } from "../../types/kanban";

describe("TaskDetailsModal Accessibility and Interaction", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockBoard: Board = {
    name: "Platform Launch",
    columns: [
      {
        name: "Todo",
        tasks: [
          {
            title: "Build UI",
            description: "Detailed description here",
            status: "Todo",
            subtasks: [
              { title: "Subtask 1", isCompleted: true },
              { title: "Subtask 2", isCompleted: false },
            ],
          },
        ],
      },
      {
        name: "Doing",
        tasks: [],
      },
    ],
  };

  const mockSelectedTask: Task = mockBoard.columns[0].tasks[0];

  it("renders task details, description, subtask checkboxes, and status dropdown", () => {
    vi.spyOn(KanbanContext, "useKanban").mockReturnValue({
      activeBoard: mockBoard,
      selectedTask: mockSelectedTask,
      isTaskDetailsOpen: true,
      closeTaskDetails: vi.fn(),
      toggleSubtask: vi.fn(),
      updateTaskStatus: vi.fn(),
      openEditTask: vi.fn(),
      openDeleteTask: vi.fn(),
    } as unknown as KanbanContext.KanbanContextType);

    render(<TaskDetailsModal />);

    expect(screen.getByText("Build UI")).toBeInTheDocument();
    expect(screen.getByText("Detailed description here")).toBeInTheDocument();
    expect(screen.getByText("Subtasks (1 of 2)")).toBeInTheDocument();
    expect(screen.getByText("Subtask 1")).toBeInTheDocument();
    expect(screen.getByText("Subtask 2")).toBeInTheDocument();
  });

  it("calls toggleSubtask when a subtask checkbox is clicked", async () => {
    const user = userEvent.setup();
    const toggleSubtaskMock = vi.fn();

    vi.spyOn(KanbanContext, "useKanban").mockReturnValue({
      activeBoard: mockBoard,
      selectedTask: mockSelectedTask,
      isTaskDetailsOpen: true,
      closeTaskDetails: vi.fn(),
      toggleSubtask: toggleSubtaskMock,
      updateTaskStatus: vi.fn(),
      openEditTask: vi.fn(),
      openDeleteTask: vi.fn(),
    } as unknown as KanbanContext.KanbanContextType);

    render(<TaskDetailsModal />);

    const checkbox = screen.getByLabelText("Subtask 2");
    expect(checkbox).toBeInTheDocument();
    await user.click(checkbox);
    expect(toggleSubtaskMock).toHaveBeenCalledWith(1);
  });
});
