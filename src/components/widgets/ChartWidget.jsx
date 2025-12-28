"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api/fetchApi";
import { readPath } from "@/lib/api/validateApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Debug mode - set to false in production
const DEBUG = process.env.NODE_ENV === "development";

function debugLog(...args) {
  if (DEBUG) console.log(...args);
}

function debugError(...args) {
  if (DEBUG) console.error(...args);
}

export default function ChartWidget({ widget, dragListeners, onEdit, onDelete }) {
  const { name, url, apiKey, apiKeyHeader, apiKeyPrefix, interval, seriesPath, yField } = widget;

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  async function loadData() {
    if (!seriesPath || !yField) {
      setError("Chart not configured. Click ⚙️ to set up.");
      setIsInitialLoad(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const json = await fetchApi(url, apiKey, apiKeyHeader, apiKeyPrefix);

      debugLog("=== CHART LOAD DEBUG ===");
      debugLog("Widget config:", { seriesPath, yField });
      debugLog("API Response:", json);

      const series = readPath(json, seriesPath);

      if (!series) {
        const errorMsg =
          json.Information || json.Error || json.error || json.message;
        if (errorMsg) {
          throw new Error(`API Error: ${errorMsg}`);
        }
        throw new Error(`Path "${seriesPath}" not found in API response.`);
      }

      let formatted = [];

      // Object with date keys
      if (typeof series === "object" && !Array.isArray(series)) {
        const entries = Object.entries(series);

        const [_, firstValues] = entries[0] || [];
        if (!firstValues || !(yField in firstValues)) {
          throw new Error(`Field "${yField}" not found in series data.`);
        }

        formatted = entries
          .map(([date, values]) => {
            const raw = values?.[yField];
            const num =
              typeof raw === "string" ? parseFloat(raw) : Number(raw);
            if (!Number.isFinite(num)) return null;
            return { date, value: num };
          })
          .filter(Boolean)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      // Array format
      else if (Array.isArray(series)) {
        const firstItem = series[0];
        const dateField =
          firstItem.date ||
          firstItem.time ||
          firstItem.timestamp ||
          Object.keys(firstItem)[0];

        if (!(yField in firstItem)) {
          throw new Error(`Field "${yField}" not found in array items.`);
        }

        formatted = series
          .map((item) => {
            const raw = item[yField];
            const num =
              typeof raw === "string" ? parseFloat(raw) : Number(raw);
            if (!item[dateField] || !Number.isFinite(num)) return null;
            return {
              date: String(item[dateField]),
              value: num,
            };
          })
          .filter(Boolean);
      } else {
        throw new Error("Series data must be an object or array.");
      }

      if (formatted.length === 0) {
        throw new Error("No valid data points found.");
      }

      setData(formatted);
      setIsInitialLoad(false);
    } catch (err) {
      debugError("❌ Chart error:", err.message);
      setError(err.message || "Failed to load chart");
      setData([]);
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
  }, [url, interval, seriesPath, yField]);

  // Skeleton
  if (isInitialLoad && data.length === 0 && !error) {
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
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded">
          <div className="font-semibold mb-2">⚠️ Chart Error</div>
          <div className="text-xs whitespace-pre-wrap font-mono mb-3">
            {error}
          </div>
          <button
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={onEdit}
            className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Fix Configuration
          </button>
        </div>
      )}

      {/* Chart */}
      {!error && data.length > 0 && (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={70}
                stroke="#64748b"
              />
              <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}