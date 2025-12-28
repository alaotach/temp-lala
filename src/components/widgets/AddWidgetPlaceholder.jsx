"use client";

export default function AddWidgetPlaceholder({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full max-w-md h-64 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition flex items-center justify-center group"
    >
      <div className="text-center">
        <div className="text-4xl mb-2 group-hover:scale-110 transition">➕</div>
        <div className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
          Add Widget
        </div>
      </div>
    </button>
  );
}