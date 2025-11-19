import { cn } from "@/lib/utils";
import { PanelData } from "@/app/types/panel";
import { ResizableBox, Resizable } from "react-resizable";
export function PanelWrapper({
  panel,
  children,
}: {
  panel: PanelData;
  children: React.ReactNode;
}) {
  return (
    <ResizableBox
      width={200}
      height={150}
      axis="both"
      resizeHandles={["se", "ne", "n", "nw", "w", "sw", ]}
      minConstraints={[100, 80]}
      maxConstraints={[600, 400]}
      className="border border-gray-400 bg-white"
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
    </ResizableBox>
  );
}
