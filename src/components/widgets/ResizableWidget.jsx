"use client";
import { useState, useRef, useCallback, useEffect } from "react";

export default function ResizableWidget({
  children,
  initialWidth = null,
  initialHeight = null,
  minWidth = 250,
  minHeight = 150,
  onResize,
  disableResize = false,
}) {
  // Set better default dimensions for charts
  const defaultWidth = 450;
  const defaultHeight = 300;

  const [dimensions, setDimensions] = useState({
    width: initialWidth || (disableResize ? null : defaultWidth),
    height: initialHeight || (disableResize ? null : defaultHeight),
  });

  const [isResizing, setIsResizing] = useState(false);
  const widgetRef = useRef(null);
  const resizeRef = useRef({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    direction: "",
  });

  // Reset size on small screens
  useEffect(() => {
    if (disableResize) {
      setDimensions({ width: null, height: null });
    } else if (!initialWidth && !initialHeight) {
      // Ensure default dimensions are set for desktop
      setDimensions({ width: defaultWidth, height: defaultHeight });
    }
  }, [disableResize, initialWidth, initialHeight]);

  const handleMouseDown = useCallback(
    (e, direction) => {
      if (disableResize) return;

      e.preventDefault();
      e.stopPropagation();

      setIsResizing(true);

      const rect = widgetRef.current?.getBoundingClientRect();
      const currentWidth = dimensions.width || rect?.width || defaultWidth;
      const currentHeight = dimensions.height || rect?.height || defaultHeight;

      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: currentWidth,
        startHeight: currentHeight,
        direction,
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [dimensions, disableResize]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!resizeRef.current.direction) return;

      const { startX, startY, startWidth, startHeight, direction } =
        resizeRef.current;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes("right"))
        newWidth = Math.max(minWidth, startWidth + deltaX);
      if (direction.includes("left"))
        newWidth = Math.max(minWidth, startWidth - deltaX);
      if (direction.includes("bottom"))
        newHeight = Math.max(minHeight, startHeight + deltaY);
      if (direction.includes("top"))
        newHeight = Math.max(minHeight, startHeight - deltaY);

      const newDimensions = { width: newWidth, height: newHeight };
      setDimensions(newDimensions);
      onResize?.(newDimensions);
    },
    [minWidth, minHeight, onResize]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    resizeRef.current.direction = "";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const resizeHandles = [
    { direction: "top-left", cursor: "nw-resize", className: "top-0 left-0" },
    { direction: "top-right", cursor: "ne-resize", className: "top-0 right-0" },
    { direction: "bottom-left", cursor: "sw-resize", className: "bottom-0 left-0" },
    { direction: "bottom-right", cursor: "se-resize", className: "bottom-0 right-0" },
    { direction: "top", cursor: "n-resize", className: "top-0 left-2 right-2" },
    { direction: "bottom", cursor: "s-resize", className: "bottom-0 left-2 right-2" },
    { direction: "left", cursor: "w-resize", className: "left-0 top-2 bottom-2" },
    { direction: "right", cursor: "e-resize", className: "right-0 top-2 bottom-2" },
  ];

  return (
    <div
      ref={widgetRef}
      className="relative w-full"
      style={{
        width: disableResize ? "100%" : dimensions.width || undefined,
        height: disableResize ? "auto" : dimensions.height || undefined,
        userSelect: isResizing ? "none" : "auto",
      }}
    >
      {children}

      {!disableResize &&
        resizeHandles.map(({ direction, cursor, className }) => (
          <div
            key={direction}
            className={`absolute ${className} z-10 opacity-0 hover:opacity-100`}
            style={{
              cursor,
              width:
                direction.includes("left") || direction.includes("right")
                  ? "8px"
                  : undefined,
              height:
                direction.includes("top") || direction.includes("bottom")
                  ? "8px"
                  : undefined,
            }}
            onMouseDown={(e) => handleMouseDown(e, direction)}
          />
        ))}

      {isResizing && !disableResize && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded z-20">
          {Math.round(dimensions.width)} × {Math.round(dimensions.height)}
        </div>
      )}
    </div>
  );
}