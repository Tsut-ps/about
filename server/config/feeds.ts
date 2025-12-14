import type { Feed } from "../types/activity";

export const feeds: Feed[] = [
  {
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCq6EmR4FgaSVvGpqdHvqOLA",
    platform: "youtube",
    name: "YouTube",
  },
  {
    url: "https://www.nicovideo.jp/user/56264499/video?rss=2.0",
    platform: "nicovideo",
    name: "ニコニコ動画",
  },
  {
    url: "https://note.com/tsutps/rss",
    platform: "note",
    name: "note",
  },
  {
    url: "https://matcha14.com/feed/",
    platform: "blog",
    name: "個人ブログ",
  },
  {
    url: "https://scrapbox.io/api/feed/Tsut-ps/",
    platform: "scrapbox",
    name: "Cosense",
  },
];
