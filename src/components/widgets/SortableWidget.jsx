"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ResizableWidget from "./ResizableWidget";
import { useDispatch } from "react-redux";
import { updateWidget } from "@/lib/store/slices/widgetSlice";
import useMediaQuery from "@/lib/hooks/useMediaQuery";

export default function SortableWidget({ id, widget, children }) {
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleResize = (newDimensions) => {
    if (isSmallScreen) return;

    dispatch(
      updateWidget({
        ...widget,
        width: newDimensions.width,
        height: newDimensions.height,
      })
    );
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ResizableWidget
        initialWidth={isSmallScreen ? null : widget.width}
        initialHeight={isSmallScreen ? null : widget.height}
        disableResize={isSmallScreen}
        onResize={handleResize}
      >
        {children({ dragListeners: listeners })}
      </ResizableWidget>
    </div>
  );
}
