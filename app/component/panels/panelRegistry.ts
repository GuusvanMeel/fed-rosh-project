import TextPanel from "./TextPanel";
import VideoPanel from "./VideoPanel";
import ImagePanel from "./ImagePanel";
import { CountdownPanel } from "./CountdownPanel";
import ScrollingTextPanel from "./ScrollingTextPanel";
import UrlPanel from "./UrlPanel";
import { BracketWrapper } from "./BracketPanel";
import { rounds } from "./BracketPanel";
import { Round } from "./BracketPanel";


type RegistryEntry = {
  component: React.ComponentType<any>;
  mapProps: (content: any) => Record<string, any>;
};

export const panelRegistry: Record<string, RegistryEntry> = {
  text: {
    component: TextPanel,
    mapProps: (content: string) => ({ Text: content }),
  },
  video: {
    component: VideoPanel,
    mapProps: (content: string) => ({ source: content }),
  },
  image: {
    component: ImagePanel,
    mapProps: (content: string) => ({ source: content }),
  },
  countdown: {
    component: CountdownPanel,
    mapProps: (content: string) => ({ targetTime: new Date(content) }),
  },
  scrollingText: {
    component: ScrollingTextPanel,
    mapProps: (content: string) => ({ Text: content }),
  },
  url: {
    component: UrlPanel,
    mapProps: ([text, url]: [string, string]) => ({ Text: text, url }),
  },
} as const;

