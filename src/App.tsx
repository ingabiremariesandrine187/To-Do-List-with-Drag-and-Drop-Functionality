import React from "react";
import Navbar from "./components/Navbar";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import { Task } from "./types";

/**
 * Main responsibilities:
 * - Keep tasks state (array of Task)
 * - Persist tasks to localStorage
 * - Provide functions to add/delete/toggle/reorder tasks
 * - Provide drag-n-drop handlers (using task ids)
 */

// localStorage key
const STORAGE_KEY = "todo_ts_tasks_v1";

export default function App(): JSX.Element {
  // Load initial tasks from localStorage (safe parse)
  const [tasks, setTasks] = React.useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Task[]) : [];
    } catch {
      return [];
    }
  });

  // Keep a ref to currently dragging task id (avoids re-renders)
  const draggingIdRef = React.useRef<string | null>(null);

  // Persist tasks on change
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks to localStorage", e);
    }
  }, [tasks]);

  // Helper to create unique id (use crypto if available)
  const makeId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? (crypto as any).randomUUID()
      : Math.random().toString(36).slice(2, 9);

  // Add task (no blank allowed)
  function addTask(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTasks(prev => [...prev, { id: makeId(), text: trimmed, completed: false }]);
  }

  // Delete by id
  function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  // Toggle completion
  function toggleComplete(id: string) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  // Called when drag starts on a TaskItem
  function onDragStart(id: string) {
    draggingIdRef.current = id;
  }

  // Reorder: move draggedId before targetId (if targetId === null, append to end)
  function reorder(draggedId: string, targetId: string | null) {
    setTasks(prev => {
      const items = [...prev];
      const fromIndex = items.findIndex(i => i.id === draggedId);
      if (fromIndex === -1) return prev;
      const [moved] = items.splice(fromIndex, 1);
      if (targetId == null) {
        // append to end
        items.push(moved);
      } else {
        const toIndex = items.findIndex(i => i.id === targetId);
        const insertIndex = toIndex === -1 ? items.length : toIndex;
        items.splice(insertIndex, 0, moved);
      }
      return items;
    });
  }

  // Called when a TaskItem is dropped onto another item or container
  function onDrop(targetId: string | null) {
    const draggedId = draggingIdRef.current;
    if (!draggedId) return;
    if (draggedId === targetId) {
      draggingIdRef.current = null;
      return;
    }
    reorder(draggedId, targetId);
    draggingIdRef.current = null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        <Navbar />
        <main className="mt-6 bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Professional Interactive To-Do</h2>
          <p className="text-sm text-slate-500 dark:text-slate-300 mb-4">
            Add, reorder, and manage tasks. Drag a task to change its order.
          </p>

          <TaskInput onAdd={addTask} />

          <div className="mt-6">
            <TaskList
              tasks={tasks}
              onDelete={deleteTask}
              onToggleComplete={toggleComplete}
              onDragStart={onDragStart}
              onDrop={onDrop}
            />
          </div>
        </main>

        <footer className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Tip: press and hold to drag on touch devices (support varies by browser).
        </footer>
      </div>
    </div>
  );
}
