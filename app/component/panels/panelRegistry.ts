import TextPanel from "./TextPanel";
import ImagePanel from "./ImagePanel";
import VideoPanel from "./VideoPanel";
import ScrollingTextPanel from "./ScrollingTextPanel";
import UrlPanel from "./UrlPanel";
import { CountdownPanel } from "./CountdownPanel";
import { PanelStyling } from "@/app/types/panel";

export const panelRegistry = {
  text: {
    component: TextPanel,
    mapProps: (content: string | string[]) => ({ text: typeof content === 'string' ? content : content[0] }),
  },
  image: {
    component: ImagePanel,
    mapProps: (content: string | string[]) => ({ src: typeof content === 'string' ? content : content[0] }),
  },
  video: {
    component: VideoPanel,
    mapProps: (content: string | string[]) => ({ src: typeof content === 'string' ? content : content[0] }),
  },
  scrollingText: {
    component: ScrollingTextPanel,
    mapProps: (content: string | string[], styling?: PanelStyling) => ({
      text: typeof content === 'string' ? content : content[0],
      direction: styling?.scrollDirection || 'left',
      fontSize: styling?.fontSize,
      fontFamily: styling?.fontFamily,
      textColor: styling?.textColor,
    }),
  },
  url: {
    component: UrlPanel,
    mapProps: (content: string | string[]) => {
      if (Array.isArray(content)) {
        return { text: content[0], url: content[1] };
      }
      return { text: content, url: '#' };
    },
  },
  countdown: {
    component: CountdownPanel,
    mapProps: (content: string | string[]) => ({
      targetDate: typeof content === 'string' ? content : content[0],
    }),
  },
};
