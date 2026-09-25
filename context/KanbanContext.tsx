"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import initialData from "../data.json";
import type { Board, Task, Subtask } from "../types/kanban";

interface SelectedTaskCoord {
  colIndex: number;
  taskIndex: number;
}

interface KanbanContextType {
  boards: Board[];
  activeBoardIndex: number;
  activeBoard: Board | null;
  isSidebarOpen: boolean;

  // Selected task for view/edit
  selectedTaskCoord: SelectedTaskCoord | null;
  selectedTask: Task | null;

  // Modal Open States
  isTaskDetailsOpen: boolean;
  isAddTaskOpen: boolean;
  isEditTaskOpen: boolean;
  isAddBoardOpen: boolean;
  isEditBoardOpen: boolean;
  isDeleteTaskOpen: boolean;
  isDeleteBoardOpen: boolean;
  isMobileNavOpen: boolean;

  // Navigation / Sidebar
  setActiveBoardIndex: (index: number) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Modal Controls
  openTaskDetails: (colIndex: number, taskIndex: number) => void;
  closeTaskDetails: () => void;
  openAddTask: () => void;
  closeAddTask: () => void;
  openEditTask: () => void;
  closeEditTask: () => void;
  openAddBoard: () => void;
  closeAddBoard: () => void;
  openEditBoard: () => void;
  closeEditBoard: () => void;
  openDeleteTask: () => void;
  closeDeleteTask: () => void;
  openDeleteBoard: () => void;
  closeDeleteBoard: () => void;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;

  // CRUD Operations
  createBoard: (name: string, columnNames: string[]) => void;
  updateBoard: (name: string, columnNames: { id?: string; name: string }[]) => void;
  deleteBoard: () => void;
  createTask: (task: {
    title: string;
    description: string;
    status: string;
    subtasks: string[];
  }) => void;
  updateTask: (task: {
    title: string;
    description: string;
    status: string;
    subtasks: { title: string; isCompleted: boolean }[];
  }) => void;
  deleteTask: () => void;
  toggleSubtask: (subtaskIndex: number) => void;
  updateTaskStatus: (newStatus: string) => void;
  addColumn: (columnName: string) => void;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

const STORAGE_KEY = "kanban_boards_data_v1";

export function KanbanProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<Board[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {}
    }
    return initialData.boards;
  });

  const [activeBoardIndex, setActiveBoardIndexState] = useState<number>(0);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Modal states
  const [selectedTaskCoord, setSelectedTaskCoord] = useState<SelectedTaskCoord | null>(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isAddBoardOpen, setIsAddBoardOpen] = useState(false);
  const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
  const [isDeleteBoardOpen, setIsDeleteBoardOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Save to localStorage when boards change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
    } catch {}
  }, [boards]);

  // Ensure activeBoardIndex is valid
  const safeActiveBoardIndex =
    boards.length > 0
      ? Math.min(Math.max(0, activeBoardIndex), boards.length - 1)
      : 0;

  const activeBoard = boards[safeActiveBoardIndex] || null;

  const selectedTask: Task | null =
    activeBoard &&
    selectedTaskCoord &&
    activeBoard.columns[selectedTaskCoord.colIndex]?.tasks[selectedTaskCoord.taskIndex]
      ? activeBoard.columns[selectedTaskCoord.colIndex].tasks[selectedTaskCoord.taskIndex]
      : null;

  const setActiveBoardIndex = (index: number) => {
    setActiveBoardIndexState(index);
    setIsMobileNavOpen(false);
    setSelectedTaskCoord(null);
    setIsTaskDetailsOpen(false);
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Modal togglers
  const openTaskDetails = (colIndex: number, taskIndex: number) => {
    setSelectedTaskCoord({ colIndex, taskIndex });
    setIsTaskDetailsOpen(true);
  };
  const closeTaskDetails = () => {
    setIsTaskDetailsOpen(false);
    setSelectedTaskCoord(null);
  };

  const openAddTask = () => {
    setIsAddTaskOpen(true);
  };
  const closeAddTask = () => setIsAddTaskOpen(false);

  const openEditTask = () => {
    setIsTaskDetailsOpen(false);
    setIsEditTaskOpen(true);
  };
  const closeEditTask = () => setIsEditTaskOpen(false);

  const openAddBoard = () => {
    setIsMobileNavOpen(false);
    setIsAddBoardOpen(true);
  };
  const closeAddBoard = () => setIsAddBoardOpen(false);

  const openEditBoard = () => setIsEditBoardOpen(true);
  const closeEditBoard = () => setIsEditBoardOpen(false);

  const openDeleteTask = () => {
    setIsTaskDetailsOpen(false);
    setIsDeleteTaskOpen(true);
  };
  const closeDeleteTask = () => setIsDeleteTaskOpen(false);

  const openDeleteBoard = () => setIsDeleteBoardOpen(true);
  const closeDeleteBoard = () => setIsDeleteBoardOpen(false);

  const toggleMobileNav = () => setIsMobileNavOpen((prev) => !prev);
  const closeMobileNav = () => setIsMobileNavOpen(false);

  // CRUD Implementations
  const createBoard = (name: string, columnNames: string[]) => {
    const newBoard: Board = {
      name: name.trim(),
      columns: columnNames
        .filter((c) => c.trim().length > 0)
        .map((colName) => ({
          name: colName.trim(),
          tasks: [],
        })),
    };
    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    setActiveBoardIndexState(updatedBoards.length - 1);
    setIsAddBoardOpen(false);
  };

  const updateBoard = (
    name: string,
    columnNames: { id?: string; name: string }[]
  ) => {
    if (!activeBoard) return;

    const existingCols = activeBoard.columns;
    const updatedColumns = columnNames
      .filter((c) => c.name.trim().length > 0)
      .map((c) => {
        const existing = existingCols.find(
          (ex) => ex.name.toLowerCase() === c.name.trim().toLowerCase()
        );
        return {
          name: c.name.trim(),
          tasks: existing ? existing.tasks : [],
        };
      });

    const updatedBoards = boards.map((b, idx) => {
      if (idx !== safeActiveBoardIndex) return b;
      return {
        ...b,
        name: name.trim(),
        columns: updatedColumns,
      };
    });

    setBoards(updatedBoards);
    setIsEditBoardOpen(false);
  };

  const deleteBoard = () => {
    if (boards.length <= 1) {
      setBoards([]);
    } else {
      const updatedBoards = boards.filter((_, idx) => idx !== safeActiveBoardIndex);
      setBoards(updatedBoards);
      setActiveBoardIndexState(Math.max(0, safeActiveBoardIndex - 1));
    }
    setIsDeleteBoardOpen(false);
  };

  const createTask = (newTaskData: {
    title: string;
    description: string;
    status: string;
    subtasks: string[];
  }) => {
    if (!activeBoard) return;

    const subtasks: Subtask[] = newTaskData.subtasks
      .filter((s) => s.trim().length > 0)
      .map((title) => ({
        title: title.trim(),
        isCompleted: false,
      }));

    const task: Task = {
      title: newTaskData.title.trim(),
      description: newTaskData.description.trim(),
      status: newTaskData.status,
      subtasks,
    };

    const targetColIdx = activeBoard.columns.findIndex(
      (c) => c.name === newTaskData.status
    );
    const resolvedColIdx = targetColIdx >= 0 ? targetColIdx : 0;

    const updatedBoards = boards.map((b, bIdx) => {
      if (bIdx !== safeActiveBoardIndex) return b;
      const newCols = b.columns.map((c, cIdx) => {
        if (cIdx !== resolvedColIdx) return c;
        return {
          ...c,
          tasks: [...c.tasks, task],
        };
      });
      return { ...b, columns: newCols };
    });

    setBoards(updatedBoards);
    setIsAddTaskOpen(false);
  };

  const updateTask = (updatedData: {
    title: string;
    description: string;
    status: string;
    subtasks: { title: string; isCompleted: boolean }[];
  }) => {
    if (!activeBoard || !selectedTaskCoord) return;

    const { colIndex: origColIdx, taskIndex: origTaskIdx } = selectedTaskCoord;

    const updatedTaskObj: Task = {
      title: updatedData.title.trim(),
      description: updatedData.description.trim(),
      status: updatedData.status,
      subtasks: updatedData.subtasks.map((s) => ({
        title: s.title.trim(),
        isCompleted: s.isCompleted,
      })),
    };

    const targetColIdx = activeBoard.columns.findIndex(
      (c) => c.name === updatedData.status
    );
    const resolvedColIdx = targetColIdx >= 0 ? targetColIdx : origColIdx;

    const updatedBoards = boards.map((b, bIdx) => {
      if (bIdx !== safeActiveBoardIndex) return b;

      if (origColIdx === resolvedColIdx) {
        // Updated in place
        const newCols = b.columns.map((c, cIdx) => {
          if (cIdx !== origColIdx) return c;
          const newTasks = [...c.tasks];
          newTasks[origTaskIdx] = updatedTaskObj;
          return { ...c, tasks: newTasks };
        });
        return { ...b, columns: newCols };
      } else {
        // Moved to a different column
        const newCols = b.columns.map((c, cIdx) => {
          if (cIdx === origColIdx) {
            return {
              ...c,
              tasks: c.tasks.filter((_, tIdx) => tIdx !== origTaskIdx),
            };
          }
          if (cIdx === resolvedColIdx) {
            return {
              ...c,
              tasks: [...c.tasks, updatedTaskObj],
            };
          }
          return c;
        });
        return { ...b, columns: newCols };
      }
    });

    setBoards(updatedBoards);
    setIsEditTaskOpen(false);
    setSelectedTaskCoord(null);
  };

  const deleteTask = () => {
    if (!activeBoard || !selectedTaskCoord) return;
    const { colIndex, taskIndex } = selectedTaskCoord;

    const updatedBoards = boards.map((b, bIdx) => {
      if (bIdx !== safeActiveBoardIndex) return b;
      const newCols = b.columns.map((c, cIdx) => {
        if (cIdx !== colIndex) return c;
        return {
          ...c,
          tasks: c.tasks.filter((_, tIdx) => tIdx !== taskIndex),
        };
      });
      return { ...b, columns: newCols };
    });

    setBoards(updatedBoards);
    setIsDeleteTaskOpen(false);
    setSelectedTaskCoord(null);
  };

  const toggleSubtask = (subtaskIdx: number) => {
    if (!activeBoard || !selectedTaskCoord) return;
    const { colIndex, taskIndex } = selectedTaskCoord;

    const updatedBoards = boards.map((b, bIdx) => {
      if (bIdx !== safeActiveBoardIndex) return b;
      const newCols = b.columns.map((c, cIdx) => {
        if (cIdx !== colIndex) return c;
        const newTasks = c.tasks.map((t, tIdx) => {
          if (tIdx !== taskIndex) return t;
          const newSubtasks = t.subtasks.map((s, sIdx) => {
            if (sIdx !== subtaskIdx) return s;
            return { ...s, isCompleted: !s.isCompleted };
          });
          return { ...t, subtasks: newSubtasks };
        });
        return { ...c, tasks: newTasks };
      });
      return { ...b, columns: newCols };
    });

    setBoards(updatedBoards);
  };

  const updateTaskStatus = (newStatus: string) => {
    if (!activeBoard || !selectedTaskCoord) return;
    const { colIndex: origColIdx, taskIndex: origTaskIdx } = selectedTaskCoord;
    const currentTask = activeBoard.columns[origColIdx]?.tasks[origTaskIdx];
    if (!currentTask || currentTask.status === newStatus) return;

    const targetColIdx = activeBoard.columns.findIndex(
      (c) => c.name === newStatus
    );
    if (targetColIdx < 0) return;

    const updatedTask: Task = { ...currentTask, status: newStatus };

    const updatedBoards = boards.map((b, bIdx) => {
      if (bIdx !== safeActiveBoardIndex) return b;
      const newCols = b.columns.map((c, cIdx) => {
        if (cIdx === origColIdx) {
          return {
            ...c,
            tasks: c.tasks.filter((_, tIdx) => tIdx !== origTaskIdx),
          };
        }
        if (cIdx === targetColIdx) {
          return {
            ...c,
            tasks: [...c.tasks, updatedTask],
          };
        }
        return c;
      });
      return { ...b, columns: newCols };
    });

    setBoards(updatedBoards);
    // Update selectedTaskCoord to point to new location in target column
    const newTasksCount = activeBoard.columns[targetColIdx].tasks.length;
    setSelectedTaskCoord({ colIndex: targetColIdx, taskIndex: newTasksCount });
  };

  const addColumn = (columnName: string) => {
    if (!activeBoard || !columnName.trim()) return;

    const updatedBoards = boards.map((b, bIdx) => {
      if (bIdx !== safeActiveBoardIndex) return b;
      return {
        ...b,
        columns: [...b.columns, { name: columnName.trim(), tasks: [] }],
      };
    });

    setBoards(updatedBoards);
  };

  return (
    <KanbanContext.Provider
      value={{
        boards,
        activeBoardIndex: safeActiveBoardIndex,
        activeBoard,
        isSidebarOpen,
        selectedTaskCoord,
        selectedTask,
        isTaskDetailsOpen,
        isAddTaskOpen,
        isEditTaskOpen,
        isAddBoardOpen,
        isEditBoardOpen,
        isDeleteTaskOpen,
        isDeleteBoardOpen,
        isMobileNavOpen,
        setActiveBoardIndex,
        toggleSidebar,
        setSidebarOpen,
        openTaskDetails,
        closeTaskDetails,
        openAddTask,
        closeAddTask,
        openEditTask,
        closeEditTask,
        openAddBoard,
        closeAddBoard,
        openEditBoard,
        closeEditBoard,
        openDeleteTask,
        closeDeleteTask,
        openDeleteBoard,
        closeDeleteBoard,
        toggleMobileNav,
        closeMobileNav,
        createBoard,
        updateBoard,
        deleteBoard,
        createTask,
        updateTask,
        deleteTask,
        toggleSubtask,
        updateTaskStatus,
        addColumn,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
}
