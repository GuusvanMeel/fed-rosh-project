import ImagePanel from "./panels/ImagePanel";
import VideoPanel from "./panels/VideoPanel";
import TextPanel from "./panels/TextPanel";
import { PanelProps } from "../types/panel";




export function Panel({ panel, readonly }: { panel: PanelProps; onUpdate?: (b: PanelProps) => void; onEditingChange?: (id: string, isEditing: boolean) => void; readonly?: boolean }) {

  // Carousel rotation is handled in the parent page now

  return (<div className="bg-gray-100 p-2 rounded select-none">
    {/* Content */}

    

    {!Array.isArray(panel.content) ? (
    <>
      {panel.type === "text" ? (
        <TextPanel Text={panel.content} />
      ) : panel.type === "video" ? (
        readonly ? (
          <div className="w-full h-full flex items-center justify-center text-neutral-700 bg-neutral-100 rounded">
            <div className="text-center">
              <div className="text-sm font-semibold">Video block</div>
              <div className="text-xs opacity-70">Preview disabled</div>
            </div>
          </div>
        ) : (
          <VideoPanel source={panel.content} />
        )
      ) : panel.type === "image" ? (
        <ImagePanel source={panel.content} />
      ) : (
        <div className="text-neutral-500 text-sm">Unsupported panel type</div>
      )}
    </>
  ):
  <>
      {panel.type === "countdown" && (
          <TextPanel Text="Not Yet Implemented"></TextPanel>
          // <img
          //   src={panel.content[(panel.currentIndex ?? 0) % Math.max(panel.content.length, 1)]}
          //   alt=""
          //   className="rounded w-full h-full object-cover"
          // />
        )}
      </>
  }
  </div>
  );
}