import TodoItem from "./TodoItem";
import type { Todo } from "../type";

type Props = {
  todos: Todo[];
  onDelete: (id: string) => void;
};

export default function TodoList({ todos, onDelete }: Props) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 font-medium">
        <p>No tasks yet. Add your first one above!</p>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {todos.map((todo) => {
        const itemWidth = 200;
        const itemHeight = 80;

        const x = Math.min(Math.max(todo.x ?? 0, 0), Math.max(window.innerWidth - itemWidth, 0));
        const y = Math.min(Math.max(todo.y ?? 0, 0), Math.max(window.innerHeight - itemHeight, 0));

        return (
          <div
            key={todo.id}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
            }}
          >
            <TodoItem todo={todo} onDelete={onDelete} />
          </div>
        );
      })}
    </div>
  );
}
