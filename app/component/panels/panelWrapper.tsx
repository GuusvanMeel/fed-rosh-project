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
      )}
      style={{
        backgroundColor: panel.backgroundColor,
        borderRadius: panel.borderRadius ?? 8,
        padding: panel.padding ?? 8,
        color: panel.textColor ?? "white",
        fontSize: panel.fontSize ?? 14,
        fontFamily: panel.fontFamily ?? "sans-serif",
        textAlign: panel.contentAlign ?? "left",
      }}
    >
      {children}
    </div>
  );
}
