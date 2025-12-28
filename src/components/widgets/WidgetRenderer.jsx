"use client";
import CardWidget from "./CardWidget";
import TableWidget from "./TableWidget";
import ChartWidget from "./ChartWidget";

export default function WidgetRenderer({ widget, dragListeners, onEdit, onDelete }) {
  const props = { widget, dragListeners, onEdit, onDelete };
  
  if (widget.type === "table") return <TableWidget {...props} />;
  if (widget.type === "chart") return <ChartWidget {...props} />;
  return <CardWidget {...props} />;
}