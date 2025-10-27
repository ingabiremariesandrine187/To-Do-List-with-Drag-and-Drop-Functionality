import React from "react";
import { Task } from "../type";

type Props = {
  task: Task;
  onDelete: () => void;
  onToggleComplete: () => void;
  onDragStart: () => void;
  onDropOn: () => void;
};

export default function TaskItem({ task, onDelete, onToggleComplete, onDragStart, onDropOn }: Props) {
  const [isOver, setIsOver] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  function handleDragStart(e: React.DragEvent) {
    // For some mobile browsers, setData helps enable drag
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
    onDragStart();
  }

  function handleDragEnd() {
    setIsDragging(false);
    setIsOver(false);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault(); // must preventDefault to allow drop
    e.dataTransfer.dropEffect = "move";
    setIsOver(true);
  }

  function handleDragLeave() {
    setIsOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsOver(false);
    onDropOn();
  }

  return (
    <li
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`task flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600
        ${isDragging ? "opacity-70 scale-95" : ""}
        ${isOver ? "ring-2 ring-blue-300 dark:ring-blue-500" : ""}
      `}
    >
      <input type="checkbox" checked={task.completed} onChange={onToggleComplete} className="h-4 w-4" />
      <div className="flex-1 min-w-0">
        <div className={`${task.completed ? "line-through text-slate-400" : ""} font-medium truncate`}>
          {task.text}
        </div>
        <div className="text-xs text-slate-400">{task.completed ? "Completed" : "Pending"}</div>
      </div>

      <button onClick={onDelete} aria-label="Delete task" className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h14a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 6a1 1 0 10-2 0v7a1 1 0 102 0V8zm6 0a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
        </svg>
      </button>
    </li>
  );
}
