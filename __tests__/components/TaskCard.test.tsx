import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskCard } from "../../components/kanban/TaskCard";
import { KanbanProvider } from "../../context/KanbanContext";
import * as KanbanContext from "../../context/KanbanContext";
import React from "react";
import type { Task } from "../../types/kanban";

describe("TaskCard Component Accessibility and Interaction", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockTask: Task = {
    title: "Build UI Components",
    description: "Design system tokens",
    status: "Todo",
    subtasks: [
      { title: "Button", isCompleted: true },
      { title: "Modal", isCompleted: false },
    ],
  };

  it("renders task title, subtask count, and accessible label", () => {
    render(
      <KanbanProvider>
        <TaskCard task={mockTask} colIndex={0} taskIndex={0} />
      </KanbanProvider>
    );

    expect(screen.getByText("Build UI Components")).toBeInTheDocument();
    expect(screen.getByText("1 of 2 subtasks")).toBeInTheDocument();

    const button = screen.getByRole("button", {
      name: "Build UI Components, 1 of 2 subtasks completed",
    });
    expect(button).toBeInTheDocument();
  });

  it("triggers openTaskDetails on click", async () => {
    const user = userEvent.setup();
    const openTaskDetailsMock = vi.fn();

    vi.spyOn(KanbanContext, "useKanban").mockReturnValue({
      openTaskDetails: openTaskDetailsMock,
    } as unknown as KanbanContext.KanbanContextType);

    render(<TaskCard task={mockTask} colIndex={1} taskIndex={2} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(openTaskDetailsMock).toHaveBeenCalledWith(1, 2);
  });
});
