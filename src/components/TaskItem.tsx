import React from "react";
import { useDraggable } from "@dnd-kit/core";
import type { Todo } from "../type";

type Props = {
  todo: Todo;
  onDelete: (id: string) => void;
};

export default function TodoItem({ todo, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: todo.id,
    data: { todo },
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 1000 : undefined,
    position: "relative",
    left: todo.x ?? 0,
    top: todo.y ?? 0,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center p-3 sm:p-4 bg-[#fdf5ef] border border-[#e7cbb2] rounded-xl 
      shadow-md transition-all duration-200 hover:shadow-xl hover:border-[#c19a6b] 
      select-none w-72`}
    >
      <span className="text-sm sm:text-base text-[#4a3728] flex-1 break-words px-2">
        {todo.text}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(todo.id);
        }}
        className="px-3 py-1 text-sm bg-[#c47b5c] text-white rounded-lg hover:bg-[#a56245] 
        transition-colors duration-200 focus:outline-none focus:ring-2 
        focus:ring-[#c47b5c] focus:ring-opacity-50 whitespace-nowrap shadow-sm"
        aria-label={`Delete task: ${todo.text}`}
      >
        Delete
      </button>
    </div>
  );
}
