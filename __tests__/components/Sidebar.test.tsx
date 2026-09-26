import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sidebar } from "../../components/kanban/Sidebar";
import * as KanbanContext from "../../context/KanbanContext";
import React from "react";
import type { Board } from "../../types/kanban";

describe("Sidebar Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockBoards: Board[] = [
    { name: "Platform Launch", columns: [] },
    { name: "Marketing Plan", columns: [] },
  ];

  it("renders all boards and hide sidebar button when open", () => {
    vi.spyOn(KanbanContext, "useKanban").mockReturnValue({
      boards: mockBoards,
      activeBoardIndex: 0,
      isSidebarOpen: true,
      setActiveBoardIndex: vi.fn(),
      setSidebarOpen: vi.fn(),
      openAddBoard: vi.fn(),
    } as unknown as KanbanContext.KanbanContextType);

    render(<Sidebar />);

    expect(screen.getByText("ALL BOARDS (2)")).toBeInTheDocument();
    expect(screen.getByText("Platform Launch")).toBeInTheDocument();
    expect(screen.getByText("Marketing Plan")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /hide sidebar/i })).toBeInTheDocument();
  });

  it("triggers hide sidebar on click and shows floating open button when closed", async () => {
    const user = userEvent.setup();
    const setSidebarOpenMock = vi.fn();

    vi.spyOn(KanbanContext, "useKanban").mockReturnValue({
      boards: mockBoards,
      activeBoardIndex: 0,
      isSidebarOpen: true,
      setActiveBoardIndex: vi.fn(),
      setSidebarOpen: setSidebarOpenMock,
      openAddBoard: vi.fn(),
    } as unknown as KanbanContext.KanbanContextType);

    const { rerender } = render(<Sidebar />);

    const hideBtn = screen.getByRole("button", { name: /hide sidebar/i });
    await user.click(hideBtn);
    expect(setSidebarOpenMock).toHaveBeenCalledWith(false);

    // Rerender as closed
    vi.spyOn(KanbanContext, "useKanban").mockReturnValue({
      boards: mockBoards,
      activeBoardIndex: 0,
      isSidebarOpen: false,
      setActiveBoardIndex: vi.fn(),
      setSidebarOpen: setSidebarOpenMock,
      openAddBoard: vi.fn(),
    } as unknown as KanbanContext.KanbanContextType);

    rerender(<Sidebar />);
    expect(screen.getByRole("button", { name: "Show Sidebar" })).toBeInTheDocument();
  });
});
