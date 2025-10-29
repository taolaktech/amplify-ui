// DragScrollContainer.js
import React, { useRef, useState } from "react";

export default function DragScrollContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<any | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: any) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current?.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e: any) => {
    if (!isDragging) return;
    e.preventDefault();
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
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        scrollBehavior: "smooth",
      }}
      className="no-scrollbar"
    >
      {children}
    </div>
  );
}
