import { getCollection, type CollectionEntry } from "astro:content";

export type NowEntry = CollectionEntry<"now">;

export type NowSnapshot = {
  title: string;
  description: string;
  updatedDate: Date;
  focusItems: { title: string; detail: string }[];
  currentItems: string[];
  nextItems: string[];
  quickLinks: { label: string; href: string }[];
};

let currentNowPromise: Promise<NowEntry | undefined> | undefined;

const byRecent = (left: NowEntry, right: NowEntry) =>
  right.data.updatedDate.getTime() - left.data.updatedDate.getTime();

export const getCurrentNowEntry = async (): Promise<NowEntry | undefined> => {
  currentNowPromise ??= getCollection("now").then((entries) => [...entries].sort(byRecent)[0]);
  return currentNowPromise;
};

export const getCurrentNowSnapshot = async (): Promise<NowSnapshot> => {
  const entry = await getCurrentNowEntry();
  if (!entry) {
    return {
      title: "我现在在做什么",
      description: "这个页面记录最近真正推进的事情。",
      updatedDate: new Date(),
      focusItems: [],
      currentItems: [],
      nextItems: [],
      quickLinks: []
    };
  }

  return {
    title: entry.data.title,
    description: entry.data.description,
    updatedDate: entry.data.updatedDate,
    focusItems: [...entry.data.focusItems],
    currentItems: [...entry.data.currentItems],
    nextItems: [...entry.data.nextItems],
    quickLinks: [...entry.data.quickLinks]
  };
};
