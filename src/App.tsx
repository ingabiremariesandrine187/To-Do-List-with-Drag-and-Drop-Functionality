


// import React, { type JSX } from "react";
// import Navbar from "./components/Navbar";
// import TaskInput from "./components/TaskInput";
// import TaskList from "./components/TaskList";
// import type { Task } from "./type";

// const STORAGE_KEY = "todo_ts_tasks_v1";

// export default function App(): JSX.Element {
//   const [tasks, setTasks] = React.useState<Task[]>(() => {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       return raw ? (JSON.parse(raw) as Task[]) : [];
//     } catch {
//       return [];
//     }
//   });

//   const draggingIdRef = React.useRef<string | null>(null);

//   React.useEffect(() => {
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
//     } catch (e) {
//       console.error("Failed to save tasks", e);
//     }
//   }, [tasks]);

//   const makeId = () =>
//     typeof crypto !== "undefined" && "randomUUID" in crypto
//       ? (crypto as  Crypto).randomUUID()
//       : Math.random().toString(36).slice(2, 9);

//   function addTask(text: string) {
//     const trimmed = text.trim();
//     if (!trimmed) return;
//     setTasks(prev => [...prev, { id: makeId(), text: trimmed, completed: false }]);
//   }

//   function deleteTask(id: string) {
//     setTasks(prev => prev.filter(t => t.id !== id));
//   }

//   function toggleComplete(id: string) {
//     setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
//   }

//   function onDragStart(id: string) {
//     draggingIdRef.current = id;
//   }

//   function reorder(draggedId: string, targetId: string | null) {
//     setTasks(prev => {
//       const items = [...prev];
//       const fromIndex = items.findIndex(i => i.id === draggedId);
//       if (fromIndex === -1) return prev;
//       const [moved] = items.splice(fromIndex, 1);
//       if (targetId == null) {
//         items.push(moved);
//       } else {
//         const toIndex = items.findIndex(i => i.id === targetId);
//         const insertIndex = toIndex === -1 ? items.length : toIndex;
//         items.splice(insertIndex, 0, moved);
//       }
//       return items;
//     });
//   }

//   function onDrop(targetId: string | null) {
//     const draggedId = draggingIdRef.current;
//     if (!draggedId) return;
//     if (draggedId === targetId) {
//       draggingIdRef.current = null;
//       return;
//     }
//     reorder(draggedId, targetId);
//     draggingIdRef.current = null;
//   }

//   function clearAll() {
//     if (!confirm("Clear all tasks?")) return;
//     setTasks([]);
//   }

//   return (
//     <div className="min-h-screen p-6">
//       <div className="max-w-3xl mx-auto">
//         <Navbar />
//         <main className="mt-6 bg-white dark:bg-slate-800 shadow rounded-lg p-6">
//           <h2 className="text-xl font-semibold mb-2">Professional Interactive To-Do</h2>
//           <p className="text-sm text-slate-500 dark:text-slate-300 mb-4">
//             Add, reorder, and manage tasks. Drag a task to change its order.
//           </p>

//           <TaskInput onAdd={addTask} />

//           <div className="mt-6">
//             <TaskList
//               tasks={tasks}
//               onDelete={deleteTask}
//               onToggleComplete={toggleComplete}
//               onDragStart={onDragStart}
//               onDrop={onDrop}
//             />
//           </div>

//           <div className="mt-4 flex justify-between items-center">
//             <div className="text-sm text-slate-500">Total tasks: {tasks.length}</div>
//             <div>
//               <button
//                 onClick={clearAll}
//                 className="px-3 py-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100"
//               >
//                 Clear All
//               </button>
//             </div>
//           </div>
//         </main>

//         <footer className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
//           Tip: press and hold to drag on touch devices (support varies by browser).
//         </footer>
//       </div>
//     </div>
//   );
// }






import React, { useEffect, useState } from "react";
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import type { Todo } from "./type";

const STORAGE_KEY = "flowtask_todos_v1";

export default function App(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Todo[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error("Failed to save todos", e);
    }
  }, [todos]);

  const addTodo = (text: string) => {
    if (!text.trim()) return;
    const verticalOffset = todos.length * 60; // stacked spacing
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      x: 20,
      y: verticalOffset,
    };
    setTodos((t) => [...t, newTodo]);
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (!delta) return;
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === String(active.id)) {
          const newX = Math.min(
            Math.max((todo.x ?? 0) + delta.x, 0),
            Math.max(window.innerWidth - 200, 0)
          );
          const newY = Math.min(
            Math.max((todo.y ?? 0) + delta.y, 0),
            Math.max(window.innerHeight - 80, 0)
          );
          return { ...todo, x: newX, y: newY };
        }
        return todo;
      })
    );
  };

  // keep todos inside viewport when window resizes
  useEffect(() => {
    const handleResize = () => {
      setTodos((prev) =>
        prev.map((todo) => ({
          ...todo,
          x: Math.min(todo.x ?? 0, Math.max(window.innerWidth - 200, 0)),
          y: Math.min(todo.y ?? 0, Math.max(window.innerHeight - 80, 0)),
        }))
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
        <div className="max-w-md mx-auto p-6">
          <h1 className="text-3xl font-bold text-center mb-4">FlowTask</h1>
          <AddTodo onAdd={addTodo} />
        </div>

        <TodoList todos={todos} onDelete={deleteTodo} />
      </div>
    </DndContext>
  );
}
