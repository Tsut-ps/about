import type { Feed } from "../types/activity";

export const feeds: Feed[] = [
  {
    url: "https://note.com/tsutps/rss",
    platform: "note",
    name: "note",
    itemLimit: 2,
  },
  {
    url: "https://matcha14.com/feed/",
    platform: "blog",
    name: "個人ブログ",
    itemLimit: 5,
  },
];
