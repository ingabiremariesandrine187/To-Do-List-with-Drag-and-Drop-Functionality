// src/components/Navbar.tsx

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 shadow-md">
      <div>
        <h1 className="text-2xl font-bold">To-Do Drag & Drop</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          React + TypeScript + Tailwind CSS
        </p>
      </div>

      <div className="text-sm text-slate-500 dark:text-slate-300">
        <span>Due: Tuesday  5am</span>
      </div>
    </header>   
  );
}
