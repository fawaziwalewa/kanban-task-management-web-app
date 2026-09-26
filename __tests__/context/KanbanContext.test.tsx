import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { KanbanProvider, useKanban } from "../../context/KanbanContext";
import React from "react";

describe("KanbanContext State & CRUD Operations", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <KanbanProvider>{children}</KanbanProvider>
  );

  it("loads initial board data and matches standard template boards", () => {
    const { result } = renderHook(() => useKanban(), { wrapper });
    expect(result.current.boards.length).toBe(3);
    expect(result.current.activeBoard).not.toBeNull();
    expect(result.current.activeBoard?.name).toBe("Platform Launch");
    expect(result.current.activeBoard?.columns.length).toBe(3);
    expect(result.current.activeBoard?.columns[0].name).toBe("Todo");
    expect(result.current.activeBoard?.columns[1].name).toBe("Doing");
    expect(result.current.activeBoard?.columns[2].name).toBe("Done");
    expect(result.current.activeBoard?.columns[0].tasks.length).toBeGreaterThan(0);
  });

  it("creates a new board and switches to it", () => {
    const { result } = renderHook(() => useKanban(), { wrapper });
    const initialCount = result.current.boards.length;

    act(() => {
      result.current.createBoard("Roadmap Board", ["Backlog", "In Review"]);
    });

    expect(result.current.boards.length).toBe(initialCount + 1);
    expect(result.current.activeBoard?.name).toBe("Roadmap Board");
    expect(result.current.activeBoard?.columns.length).toBe(2);
    expect(result.current.activeBoard?.columns[0].name).toBe("Backlog");
  });

  it("updates an existing board name and column structure safely", () => {
    const { result } = renderHook(() => useKanban(), { wrapper });

    act(() => {
      result.current.createBoard("Test Board", ["Col 1", "Col 2"]);
    });

    act(() => {
      result.current.createTask({
        title: "Test Task",
        description: "Task description",
        status: "Col 1",
        subtasks: ["Sub 1"],
      });
    });

    expect(result.current.activeBoard?.columns[0].tasks.length).toBe(1);

    act(() => {
      result.current.updateBoard("Renamed Board", [
        { name: "Renamed Col 1" },
        { name: "Col 2" },
      ]);
    });

    expect(result.current.activeBoard?.name).toBe("Renamed Board");
    expect(result.current.activeBoard?.columns[0].name).toBe("Renamed Col 1");
    // Tasks should be preserved with updated status
    expect(result.current.activeBoard?.columns[0].tasks.length).toBe(1);
    expect(result.current.activeBoard?.columns[0].tasks[0].status).toBe("Renamed Col 1");
  });

  it("deletes the active board and safely falls back to remaining board", () => {
    const { result } = renderHook(() => useKanban(), { wrapper });

    act(() => {
      result.current.createBoard("Temporary Board", ["Todo"]);
    });

    const countBefore = result.current.boards.length;
    act(() => {
      result.current.deleteBoard();
    });

    expect(result.current.boards.length).toBe(countBefore - 1);
    expect(result.current.boards.some((b) => b.name === "Temporary Board")).toBe(false);
    expect(result.current.activeBoard).not.toBeNull();
  });

  it("creates, updates, and deletes tasks", () => {
    const { result } = renderHook(() => useKanban(), { wrapper });

    act(() => {
      result.current.createBoard("Task Flow Board", ["Todo", "Done"]);
    });

    // Create task
    act(() => {
      result.current.createTask({
        title: "Build Feature X",
        description: "Must be accessible",
        status: "Todo",
        subtasks: ["Design tokens", "Vitest tests"],
      });
    });

    expect(result.current.activeBoard?.columns[0].tasks.length).toBe(1);
    expect(result.current.activeBoard?.columns[0].tasks[0].title).toBe("Build Feature X");
    expect(result.current.activeBoard?.columns[0].tasks[0].subtasks.length).toBe(2);

    // Open task details and update
    act(() => {
      result.current.openTaskDetails(0, 0);
    });
    expect(result.current.selectedTask?.title).toBe("Build Feature X");

    act(() => {
      result.current.updateTask({
        title: "Build Feature X (Updated)",
        description: "Now with 100% test coverage",
        status: "Done",
        subtasks: [
          { title: "Design tokens", isCompleted: true },
          { title: "Vitest tests", isCompleted: true },
        ],
      });
    });

    // Task should be moved to Done column
    expect(result.current.activeBoard?.columns[0].tasks.length).toBe(0);
    expect(result.current.activeBoard?.columns[1].tasks.length).toBe(1);
    expect(result.current.activeBoard?.columns[1].tasks[0].title).toBe("Build Feature X (Updated)");

    // Toggle subtask in new position
    act(() => {
      result.current.openTaskDetails(1, 0);
    });
    act(() => {
      result.current.toggleSubtask(0);
    });
    expect(result.current.activeBoard?.columns[1].tasks[0].subtasks[0].isCompleted).toBe(false);

    // Delete task
    act(() => {
      result.current.deleteTask();
    });
    expect(result.current.activeBoard?.columns[1].tasks.length).toBe(0);
  });

  it("persists boards to localStorage", () => {
    const { result } = renderHook(() => useKanban(), { wrapper });

    act(() => {
      result.current.createBoard("Persisted Board", ["Todo"]);
    });

    const stored = window.localStorage.getItem("kanban_boards_data_v1");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored || "[]");
    expect(parsed.some((b: { name: string }) => b.name === "Persisted Board")).toBe(true);
  });
});
