"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api/fetchApi";
import { readPath } from "@/lib/api/validateApi";

export default function CardWidget({ widget, dragListeners, onDelete, onEdit }) {
  const { name, url, apiKey, apiKeyHeader, apiKeyPrefix, interval, cardFields = [] } = widget;

  const [rawData, setRawData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const json = await fetchApi(url, apiKey, apiKeyHeader, apiKeyPrefix);
      setRawData(json);
      setLastUpdated(new Date());
      setIsInitialLoad(false);
    } catch (err) {
      setError(err?.message || "Failed to refresh data");
      setIsInitialLoad(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    if (!interval || interval <= 0) return;
    const id = setInterval(loadData, interval * 1000);
    return () => clearInterval(id);
  }, [url, interval]);

  function renderValue(value) {
    if (value == null) return "—";
    if (typeof value === "number") return value.toLocaleString();
    if (typeof value === "boolean") return value ? "✓ Yes" : "✗ No";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  }

  if (isInitialLoad && !rawData && !error) {
    return (
      <div className="rounded-xl border p-5 bg-white dark:bg-slate-900 animate-pulse h-40" />
    );
  }

  return (
    <div
      {...dragListeners}
      className="relative w-full h-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing flex flex-col"
    >
      {/* Updating badge */}
      {loading && !isInitialLoad && (
        <div className="absolute top-2 right-2 text-xs bg-emerald-500 text-white px-2 py-1 rounded">
          Updating
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
            className="text-slate-400 hover:text-slate-600 p-1 hover:scale-110 transition"
            title="Edit"
          >
            ⚙️
          </button>

          {/* DELETE */}
          <button
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 p-1 hover:scale-110 transition"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {rawData &&
          cardFields.map((fieldPath) => (
            <div
              key={fieldPath}
              className="flex justify-between gap-4 text-sm border-b pb-2 last:border-0"
            >
              <span className="font-medium truncate">
                {fieldPath.replace(/\./g, " → ")}
              </span>
              <span className="text-right break-all">
                {renderValue(readPath(rawData, fieldPath))}
              </span>
            </div>
          ))}
      </div>

      {lastUpdated && (
        <div className="mt-4 text-xs text-slate-400 text-right">
          Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}