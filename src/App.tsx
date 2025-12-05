import { useEffect, useState } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import type { Todo } from "./type";

const STORAGE_KEY = "flowtask_todos_v1";

export default function App() {
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
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
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

  // 🔒 Disable page scrolling completely
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div
        style={{
          backgroundColor: "#ffffff",
          height: "100vh", // use fixed height to prevent scroll
          width: "100vw",
          overflow: "hidden", // disable scroll inside container too
        }}
      >
        <div className="max-w-md mx-auto p-6">
          <h1 className="text-3xl font-bold text-center mb-4">FlowTask</h1>
          <AddTodo onAdd={addTodo} />
        </div>

        <TodoList todos={todos} onDelete={deleteTodo} />
      </div>
    </DndContext>
  );
}
