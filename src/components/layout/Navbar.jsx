"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, setTheme } from "@/lib/store/slices/themeSlice";
import { useEffect, useState } from "react";

import {
  exportDashboardConfig,
  importDashboardConfig,
} from "@/lib/utils/dashboardConfig";
import { replaceDashboard } from "@/lib/store/slices/widgetSlice";

export default function Navbar({ onAddWidget }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const widgets = useSelector((state) => state.widgets);

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const widgetCount = widgets.length;

  // Export handler
  function handleExport() {
    exportDashboardConfig({ widgets, theme });
    setMenuOpen(false);
  }

  // Import handler
  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const dashboard = await importDashboardConfig(file);
      dispatch(replaceDashboard({ widgets: dashboard.widgets }));
      setMenuOpen(false);
    } catch (err) {
      alert(err.message);
    }
  }

  // Theme init
  useEffect(() => {
    setMounted(true);

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && storedTheme !== theme) {
      dispatch(setTheme(storedTheme));
    }

    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Theme sync
  useEffect(() => {
    if (!mounted) return;

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme, mounted]);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left - Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
            <div className="text-xl sm:text-2xl flex-shrink-0">📊</div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white truncate">
                Finance Dashboard
              </h1>
              {mounted && widgetCount > 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  {widgetCount} {widgetCount === 1 ? "widget" : "widgets"} live
                </p>
              )}
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
            {/* Widget count badge - Mobile only */}
            {mounted && widgetCount > 0 && (
              <div className="flex sm:hidden items-center justify-center w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg relative">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {widgetCount}
                </span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </div>
            )}

            {/* Theme toggle - Always visible */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-lg sm:text-xl"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              suppressHydrationWarning
              aria-label="Toggle theme"
            >
              {mounted ? (theme === "dark" ? "🌞" : "🌙") : "🌙"}
            </button>

            {/* Desktop actions (Export/Import) */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={handleExport}
                className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300"
              >
                Export
              </button>

              <label className="cursor-pointer px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300">
                Import
                <input
                  type="file"
                  accept="application/json"
                  hidden
                  onChange={handleImport}
                />
              </label>
            </div>

            {/* Add Widget button - Moved BEFORE hamburger menu */}
            <button
              onClick={onAddWidget}
              className="px-2.5 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 active:bg-emerald-700 transition flex items-center gap-1 sm:gap-1.5 md:gap-2 text-sm sm:text-base"
            >
              <span className="text-base sm:text-lg">+</span>
              <span className="hidden xs:inline">Add</span>
              <span className="hidden sm:inline">Widget</span>
            </button>

            {/* Mobile menu button - Moved to the END (Far Right) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
            <button
              onClick={handleExport}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300 text-left"
            >
              📤 Export Dashboard
            </button>

            <label className="cursor-pointer w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300 text-left">
              📥 Import Dashboard
              <input
                type="file"
                accept="application/json"
                hidden
                onChange={handleImport}
              />
            </label>
          </div>
        )}
      </div>
    </nav>
  );
}