import { useState, useEffect, ReactNode } from "react";

interface ResizablePanelProps {
  width: number;
  height: number;
  onResize: (size: { width: number; height: number }) => void;
  isSelected: boolean;
  onSelect?: () => void;
  children: ReactNode;
  minWidth?: number;
  minHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ResizablePanel({
  width,
  height,
  onResize,
  isSelected,
  onSelect,
  children,
  minWidth = 50,
  minHeight = 50,
  className = "",
  style = {}
}: ResizablePanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ w: 0, h: 0 });

  const handleMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragHandle(handle);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ w: width, h: height });
  };

  const handlePanelClick = (e: React.MouseEvent) => {
    // Only trigger select if clicking the panel itself, not the resize handles
    if (onSelect && !isDragging) {
      onSelect();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragHandle) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      let newW = startSize.w;
      let newH = startSize.h;

      switch (dragHandle) {
        case 'se':
          newW = Math.max(minWidth, startSize.w + deltaX);
          newH = Math.max(minHeight, startSize.h + deltaY);
          break;
        case 'sw':
          newW = Math.max(minWidth, startSize.w - deltaX);
          newH = Math.max(minHeight, startSize.h + deltaY);
          break;
        case 'ne':
          newW = Math.max(minWidth, startSize.w + deltaX);
          newH = Math.max(minHeight, startSize.h - deltaY);
          break;
        case 'nw':
          newW = Math.max(minWidth, startSize.w - deltaX);
          newH = Math.max(minHeight, startSize.h - deltaY);
          break;
        case 'n':
          newH = Math.max(minHeight, startSize.h - deltaY);
          break;
        case 's':
          newH = Math.max(minHeight, startSize.h + deltaY);
          break;
        case 'e':
          newW = Math.max(minWidth, startSize.w + deltaX);
          break;
        case 'w':
          newW = Math.max(minWidth, startSize.w - deltaX);
          break;
      }

      onResize({
        width: Math.round(newW),
        height: Math.round(newH)
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragHandle(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragHandle, startPos, startSize, minWidth, minHeight, onResize]);

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        ...style
      }}
      onClick={handlePanelClick}
    >
      {/* Panel content */}
      {children}

      {/* Resize handles - only show when selected */}
      {isSelected && (
        <>
          {/* Corner Handles */}
          <div
            className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-500 border-2 border-white rounded-sm cursor-nw-resize z-50 hover:scale-125 transition-transform"
            onMouseDown={(e) => handleMouseDown(e, 'nw')}
            onClick={(e) => e.stopPropagation()}
          />
          <div
            className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-500 border-2 border-white rounded-sm cursor-ne-resize z-50 hover:scale-125 transition-transform"
            onMouseDown={(e) => handleMouseDown(e, 'ne')}
            onClick={(e) => e.stopPropagation()}
          />
          <div
            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-500 border-2 border-white rounded-sm cursor-sw-resize z-50 hover:scale-125 transition-transform"
            onMouseDown={(e) => handleMouseDown(e, 'sw')}
            onClick={(e) => e.stopPropagation()}
          />
          <div
            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 border-2 border-white rounded-sm cursor-se-resize z-50 hover:scale-125 transition-transform"
            onMouseDown={(e) => handleMouseDown(e, 'se')}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Edge Handles */}
          <div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 border-2 border-white rounded-sm cursor-n-resize z-50 hover:scale-125 transition-transform"
            onMouseDown={(e) => handleMouseDown(e, 'n')}
            onClick={(e) => e.stopPropagation()}
          />
          <div
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 border-2 border-white rounded-sm cursor-s-resize z-50 hover:scale-125 transition-transform"
            onMouseDown={(e) => handleMouseDown(e, 's')}
            onClick={(e) => e.stopPropagation()}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-blue-500 border-2 border-white rounded-sm cursor-w-resize z-50 hover:scale-125 transition-transform"
            onMouseDown={(e) => handleMouseDown(e, 'w')}
            onClick={(e) => e.stopPropagation()}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-blue-500 border-2 border-white rounded-sm cursor-e-resize z-50 hover:scale-125 transition-transform"
            onMouseDown={(e) => handleMouseDown(e, 'e')}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Selection border */}
          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none rounded-sm" />
          
          {/* Size indicator badge */}
          <div className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none">
            {width} × {height}
          </div>
        </>
      )}
    </div>
  );
}

// Optional: Export a hook for managing resizable state
export function useResizablePanel(initialWidth: number, initialHeight: number) {
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isSelected, setIsSelected] = useState(false);

  const handleResize = (newSize: { width: number; height: number }) => {
    setSize(newSize);
  };

  const handleSelect = () => {
    setIsSelected(true);
  };

  const handleDeselect = () => {
    setIsSelected(false);
  };

  return {
    size,
    isSelected,
    handleResize,
    handleSelect,
    handleDeselect,
    setSize
  };
}