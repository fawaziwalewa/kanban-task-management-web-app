"use client";

import { KanbanProvider } from "../../context/KanbanContext";
import { Header } from "../../components/kanban/Header";
import { Sidebar } from "../../components/kanban/Sidebar";
import { BoardView } from "../../components/kanban/BoardView";
import { TaskDetailsModal } from "../../components/modals/TaskDetailsModal";
import { TaskFormModal } from "../../components/modals/TaskFormModal";
import { BoardFormModal } from "../../components/modals/BoardFormModal";
import { DeleteModal } from "../../components/modals/DeleteModal";
import { MobileNavModal } from "../../components/modals/MobileNavModal";

function DashboardContent() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-light-grey dark:bg-very-dark-grey text-black-main dark:text-white transition-colors duration-200">
      {/* Top Header */}
      <Header />

      {/* Main Workspace Area with Sidebar & Board Content */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <BoardView />
      </div>

      {/* Interactive Modals */}
      <TaskDetailsModal />
      <TaskFormModal mode="add" />
      <TaskFormModal mode="edit" />
      <BoardFormModal mode="add" />
      <BoardFormModal mode="edit" />
      <DeleteModal type="task" />
      <DeleteModal type="board" />
      <MobileNavModal />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <KanbanProvider>
      <DashboardContent />
    </KanbanProvider>
  );
}
