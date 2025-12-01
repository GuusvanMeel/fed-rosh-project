import TextPanel from "./TextPanel";
import VideoPanel from "./VideoPanel";
import ImagePanel from "./ImagePanel";
import { CountdownPanel } from "./CountdownPanel";
import ScrollingTextPanel from "./ScrollingTextPanel";
import UrlPanel from "./UrlPanel";
import { PanelStyling, PanelType } from "@/app/types/panel";

type TextPanelProps = { Text: string };
type VideoPanelProps = { source: string };
type ImagePanelProps = { source: string };
type CountdownPanelProps = { targetTime: Date };
type ScrollingTextProps = {
  Text: string;
  fontSize: number;
  scrollDirection: 'left' | 'right';
};
type UrlPanelProps = { Text: string; url: string };

// Union of all possible props
export type AllPanelProps = TextPanelProps | VideoPanelProps | ImagePanelProps | CountdownPanelProps | ScrollingTextProps | UrlPanelProps;

type RegistryEntry<Props extends AllPanelProps> = {
  component: React.ComponentType<Props>;
  mapProps: (
    content: string | string[],
    styling?: PanelStyling
  ) => Props;
};

type PanelRegistry = {
  text: RegistryEntry<TextPanelProps>;
  video: RegistryEntry<VideoPanelProps>;
  image: RegistryEntry<ImagePanelProps>;
  countdown: RegistryEntry<CountdownPanelProps>;
  scrollingText: RegistryEntry<ScrollingTextProps>;
  url: RegistryEntry<UrlPanelProps>;
};

export const panelRegistry: PanelRegistry = {
  text: {
    component: TextPanel,
    mapProps: (content) => ({
      Text: Array.isArray(content) ? content[0] : content
    }),
  },
  video: {
    component: VideoPanel,
    mapProps: (content) => ({
      source: Array.isArray(content) ? content[0] : content
    }),
  },
  image: {
    component: ImagePanel,
    mapProps: (content) => ({
      source: Array.isArray(content) ? content[0] : content
    }),
  },
  countdown: {
    component: CountdownPanel,
    mapProps: (content) => ({
      targetTime: new Date(Array.isArray(content) ? content[0] : content)
    }),
  },
  scrollingText: {
    component: ScrollingTextPanel,
    mapProps: (content, styling) => ({
      Text: content as string,
      fontSize: styling?.fontSize ?? 96,
      scrollDirection: styling?.scrollDirection ?? "right",
    }),
  },
  url: {
    component: UrlPanel,
    mapProps: (content) => ({
      Text: Array.isArray(content) ? content[0] : '',
      url: Array.isArray(content) ? content[1] : ''
    }),
  },
};
export function isPanelType(type: string): type is PanelType {
  return type in panelRegistry;
}