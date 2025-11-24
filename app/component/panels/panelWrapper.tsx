import { cn } from "@/lib/utils";
import { PanelData } from "@/app/types/panel";
import { useDraggable } from "@dnd-kit/core";
import {CSS} from '@dnd-kit/utilities';

export function PanelWrapper({
  panel,
  children,
  onDragStart
}: {
  panel: PanelData;
  children: React.ReactNode;
  onDragStart?: (panel: PanelData) => void;
 
}) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: panel.i,
    data: {
      type: 'panel',
      panel: panel
    }
  });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDragStart = () => {
    console.log('Panel drag started:', panel.i);
    if (onDragStart) onDragStart(panel);
  };
 
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes} 
      onDragStart={handleDragStart}
      className="cursor-grab active:cursor-grabbing"
    >
    <div 
      className={cn(
        "w-full h-full overflow-hidden",
       "transition-all  hover:outline-3 hover:outline-blue-400 hover:outline-offset-[-3px]"
      )}
      style={{
        backgroundColor: panel.styling.backgroundColor ?? "white",
        borderRadius: panel.styling.borderRadius ?? 8,
        padding: panel.styling.padding ?? 8,
        color: panel.styling.textColor ?? "white",
        fontSize: panel.styling.fontSize ?? 14,
        fontFamily: panel.styling.fontFamily ?? "sans-serif",
        textAlign: panel.styling.contentAlign ?? "left",
      }}
    >
      {children}
    </div>
    </div>
  );
}
