import { cn } from "@/lib/utils";
import { PanelData } from "@/app/types/panel";
import { useDraggable } from "@dnd-kit/core";
import {CSS} from '@dnd-kit/utilities';

export function PanelWrapper({
  panel,
  children,
}: {
  panel: PanelData;
  children: React.ReactNode;
 
}) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: panel.i,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };
 
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
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
