import type { Feed } from "../types/activity";

export const feeds: Feed[] = [
  {
    url: "https://www.nicovideo.jp/user/56264499/video?rss=2.0",
    platform: "nicovideo",
    name: "ニコニコ動画",
    itemLimit: 24,
  },
  {
    url: "https://note.com/tsutps/rss",
    platform: "note",
    name: "note",
    itemLimit: 1,
  },
  {
    url: "https://matcha14.com/feed/",
    platform: "blog",
    name: "個人ブログ",
    itemLimit: 5,
  },
];
