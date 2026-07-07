export type TimelineItem = {
  meta: string;
  title: string;
  content: string;
};

export function createTimelineItem(): TimelineItem {
  return {
    meta: "",
    title: "",
    content: "",
  };
}

export function addTimelineItem(items: TimelineItem[]) {
  return [...items, createTimelineItem()];
}

export function updateTimelineItem(items: TimelineItem[], index: number, nextItem: TimelineItem) {
  if (index < 0 || index >= items.length) {
    return items;
  }

  return items.map((item, currentIndex) => (currentIndex === index ? nextItem : item));
}

export function removeTimelineItem(items: TimelineItem[], index: number) {
  if (index < 0 || index >= items.length) {
    return items;
  }

  return items.filter((_, currentIndex) => currentIndex !== index);
}
