import React, { useState } from "react";

type Props = {
  onAdd: (text: string) => void;
};

export default function AddTodo({ onAdd }: Props) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      onAdd(inputValue);
      setInputValue("");
    }
  };

  return (
   <form onSubmit={handleSubmit} className="mb-6">
  <div className="flex flex-col sm:flex-row gap-2">
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Type your next task..."
      className="flex-1 px-4 py-2 text-sm sm:text-base border border-[#e4c8a2] rounded-lg 
      bg-[#fffaf4] focus:outline-none focus:ring-2 focus:ring-[#b07b50] focus:border-transparent"
    />

    <button
      type="submit"
      className="px-4 sm:px-6 py-2 bg-[#b07b50] hover:bg-[#a06d45] text-white 
      text-sm sm:text-base rounded-lg transition-colors duration-200 
      focus:outline-none focus:ring-2 focus:ring-[#b07b50] focus:ring-opacity-50 
      shadow-md hover:shadow-lg"
    >
      Add Task
    </button>
  </div>
</form>

  );
}
