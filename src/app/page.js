"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import Navbar from "@/components/layout/Navbar";
import AddWidgetModal from "@/components/modals/AddWidgetModal";
import SortableWidget from "@/components/widgets/SortableWidget";
import AddWidgetPlaceholder from "@/components/widgets/AddWidgetPlaceholder";

import {
  addWidget,
  updateWidget,
  removeWidget,
  reorderWidgets,
} from "@/lib/store/slices/widgetSlice";

import CardWidget from "@/components/widgets/CardWidget";
import TableWidget from "@/components/widgets/TableWidget";
import ChartWidget from "@/components/widgets/ChartWidget";

const STORAGE_KEY = "dashboard-widgets";

export default function Home() {
  const dispatch = useDispatch();
  const widgets = useSelector((state) => state.widgets);
  
  const [showModal, setShowModal] = useState(false);
  const [editingWidget, setEditingWidget] = useState(null);
  const [mounted, setMounted] = useState(false);

  /* 🔁 Load from localStorage on mount */
  useEffect(() => {
    setMounted(true);
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const loadedWidgets = JSON.parse(stored);
        dispatch(reorderWidgets(loadedWidgets));
      }
    } catch (error) {
      console.error("Failed to load widgets from localStorage:", error);
    }
  }, [dispatch]);

  /* 💾 Save to localStorage whenever widgets change */
  useEffect(() => {
    if (!mounted) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
    } catch (error) {
      console.error("Failed to save widgets to localStorage:", error);
    }
  }, [widgets, mounted]);

  /* 🧲 Drag & Drop */
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = widgets.findIndex((w) => w.id === active.id);
    const newIndex = widgets.findIndex((w) => w.id === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(widgets, oldIndex, newIndex);
      dispatch(reorderWidgets(reordered));
    }
  }

  /* 🗑 Delete */
  function handleDelete(id) {
    if (confirm("Are you sure you want to delete this widget?")) {
      dispatch(removeWidget(id));
    }
  }

  /* ✏️ Edit - FIXED */
  function handleEdit(widget) {
    console.log('Opening edit for widget:', widget);
    setEditingWidget(widget);
    setShowModal(true);
  }

  /* 💾 Save (create OR update) */
  function handleSave(widget) {
    if (editingWidget) {
      dispatch(updateWidget(widget));
    } else {
      dispatch(addWidget(widget));
    }

    setEditingWidget(null);
    setShowModal(false);
  }

  /* 🎨 Render individual widget - FIXED */
  function renderWidget(widget, dragListeners) {
    const props = {
      widget,
      dragListeners,
      onDelete: () => handleDelete(widget.id),
      onEdit: () => handleEdit(widget), // ✅ FIXED: Now passing function that calls handleEdit
    };

    if (widget.type === "table") return <TableWidget {...props} />;
    if (widget.type === "chart") return <ChartWidget {...props} />;
    return <CardWidget {...props} />;
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <main className="min-h-screen">
        <Navbar onAddWidget={() => {}} />
        <section className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar onAddWidget={() => setShowModal(true)} />

      <section className="p-6">
        {widgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold mb-2 text-slate-700 dark:text-slate-300">
              No widgets yet
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Get started by adding your first widget
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition"
            >
              Add Your First Widget
            </button>
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={widgets.map((w) => w.id)}
              strategy={rectSortingStrategy}
            >
              <div className="flex flex-wrap gap-6">
                {widgets.map((widget) => (
                  <SortableWidget key={widget.id} id={widget.id} widget={widget}>
                    {({ dragListeners }) =>
                      renderWidget(widget, dragListeners)
                    }
                  </SortableWidget>
                ))}

                <AddWidgetPlaceholder onClick={() => setShowModal(true)} />
              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>

      {showModal && (
        <AddWidgetModal
          mode={editingWidget ? "edit" : "create"}
          initialData={editingWidget}
          onClose={() => {
            setShowModal(false);
            setEditingWidget(null);
          }}
          onSave={handleSave}
        />
      )}
    </main>
  );
}