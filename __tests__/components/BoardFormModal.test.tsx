import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BoardFormModal } from "../../components/modals/BoardFormModal";
import * as KanbanContext from "../../context/KanbanContext";
import React from "react";
import type { Board } from "../../types/kanban";

describe("BoardFormModal Component and Validation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockBoard: Board = {
    name: "Platform Launch",
    columns: [{ name: "Todo", tasks: [] }],
  };

  it("renders Add New Board form inputs when open in add mode", () => {
    vi.spyOn(KanbanContext, "useKanban").mockReturnValue({
      activeBoard: mockBoard,
      isAddBoardOpen: true,
      isEditBoardOpen: false,
      closeAddBoard: vi.fn(),
      closeEditBoard: vi.fn(),
      createBoard: vi.fn(),
      updateBoard: vi.fn(),
    } as unknown as KanbanContext.KanbanContextType);

    render(<BoardFormModal mode="add" />);

    expect(screen.getByRole("heading", { name: "Add New Board" })).toBeInTheDocument();
    expect(screen.getByLabelText("Board Name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create New Board" })).toBeInTheDocument();
  });

  it("shows error validations when submitting empty board name and empty columns", async () => {
    const user = userEvent.setup();
    const createBoardMock = vi.fn();

    vi.spyOn(KanbanContext, "useKanban").mockReturnValue({
      activeBoard: mockBoard,
      isAddBoardOpen: true,
      isEditBoardOpen: false,
      closeAddBoard: vi.fn(),
      closeEditBoard: vi.fn(),
      createBoard: createBoardMock,
      updateBoard: vi.fn(),
    } as unknown as KanbanContext.KanbanContextType);

    render(<BoardFormModal mode="add" />);

    const nameInput = screen.getByLabelText("Board Name");
    await user.clear(nameInput);

    const submitBtn = screen.getByRole("button", { name: "Create New Board" });
    await user.click(submitBtn);

    expect(createBoardMock).not.toHaveBeenCalled();
    const errorAlerts = screen.getAllByRole("alert");
    expect(errorAlerts.length).toBeGreaterThan(0);
    expect(errorAlerts[0]).toHaveTextContent("Can't be empty");
  });
});
