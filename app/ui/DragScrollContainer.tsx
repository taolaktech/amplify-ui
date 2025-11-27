// DragScrollContainer.js
import React, { useRef, useState } from "react";
import useUIStore from "../lib/stores/uiStore";

export default function DragScrollContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isPreviewMaximized) return;
    setIsDragging(true);
    if (!containerRef.current) return;
    setStartX(e.pageX - containerRef.current?.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };
  const isPreviewMaximized = useUIStore((state) => state.isPreviewMaximized);

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDragging || isPreviewMaximized) return;
    if (!containerRef.current) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1; // scroll speed multiplier
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      style={{
        display: "flex",
        overflowX: "auto",
        overflowY: "hidden",
        cursor: isPreviewMaximized ? "auto" : isDragging ? "grabbing" : "grab",
        userSelect: isPreviewMaximized ? "auto" : "none",
        scrollBehavior: "smooth",
      }}
      className="no-scrollbar"
    >
      {children}
    </div>
  );
}
