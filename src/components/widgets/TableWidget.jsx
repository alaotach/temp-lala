"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api/fetchApi";
import { readPath } from "@/lib/api/validateApi";

export default function TableWidget({ widget, dragListeners, onEdit, onDelete }) {
  const { name, url, apiKey, apiKeyHeader, apiKeyPrefix, interval, arrayPath, tableFields = [] } = widget;
  const ROWS_PER_PAGE = 10;

  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  async function loadData() {
    if (!arrayPath || tableFields.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const json = await fetchApi(url, apiKey, apiKeyHeader, apiKeyPrefix);
      const data = readPath(json, arrayPath);

      if (!Array.isArray(data)) {
        throw new Error("Selected source is not an array");
      }

      setRows(data);
      setPage(0);
      setIsInitialLoad(false);
    } catch (err) {
      setError(err.message || "Failed to load table");
      setRows([]);
      setIsInitialLoad(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    if (!interval) return;
    const id = setInterval(loadData, interval * 1000);
    return () => clearInterval(id);
  }, [url, interval, arrayPath, tableFields.join("|")]);

  const totalPages = Math.ceil(rows.length / ROWS_PER_PAGE);
  const displayRows = rows.slice(
    page * ROWS_PER_PAGE,
    (page + 1) * ROWS_PER_PAGE
  );

  function renderCellValue(value) {
    if (value == null) return "—";
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value);
    }
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return "[Complex Object]";
      }
    }
    return String(value);
  }

  // Skeleton loader
  if (isInitialLoad && rows.length === 0 && !error) {
    return (
      <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="h-72 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div
      {...dragListeners}
      className="relative w-full h-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing flex flex-col"
    >
      {/* Refresh indicator */}
      {loading && !isInitialLoad && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            Updating
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {name}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
            {interval}s
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* EDIT */}
          <button
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={onEdit}
            className="text-slate-400 hover:text-slate-600 p-1 hover:scale-110 transition-transform"
            title="Edit"
          >
            ⚙️
          </button>

          {/* DELETE */}
          <button
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 p-1 hover:scale-110 transition-transform"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {/* Table */}
      {!error && rows.length > 0 && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white dark:bg-slate-900">
                <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                  {tableFields.map((f) => (
                    <th
                      key={f}
                      className="text-left p-2 font-semibold text-slate-700 dark:text-slate-300"
                    >
                      {f}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    {tableFields.map((f) => (
                      <td
                        key={f}
                        className="p-2 text-slate-600 dark:text-slate-400"
                      >
                        {renderCellValue(row?.[f])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex-shrink-0">
              <span>
                Page {page + 1} of {totalPages} • {rows.length} rows
              </span>
              <div className="flex gap-2">
                <button
                  onPointerDownCapture={(e) => e.stopPropagation()}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  ← Prev
                </button>
                <button
                  onPointerDownCapture={(e) => e.stopPropagation()}
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="text-sm text-slate-400 text-center py-4">
          No rows found. Click ⚙️ to reconfigure.
        </div>
      )}
    </div>
  );
}