import { cn } from "@/lib/utils";
import { PanelData } from "@/app/types/panel";

export function PanelWrapper({
  panel,
  children,
}: {
  panel: PanelData;
  children: React.ReactNode;
}) {
  return (
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
  );
}
