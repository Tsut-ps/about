import type { API } from "../types/activity";

export const apis: API[] = [
  {
    playlistId: "UULFq6EmR4FgaSVvGpqdHvqOLA",
    platform: "youtube",
    name: "YouTube",
    itemLimit: 24,
  },
  {
    playlistId: "UUSHq6EmR4FgaSVvGpqdHvqOLA",
    platform: "youtube-shorts",
    name: "YouTube Shorts",
    itemLimit: 24,
  },
  {
    userName: "Tsut-ps",
    platform: "scrapbox",
    name: "Cosense",
    itemLimit: 3,
    excludeItems: ["Tsut-ps"], // ユーザーページを除外
  },
  {
    userName: "Tsut-ps",
    platform: "github",
    name: "GitHub",
    itemLimit: 3,
    excludeItems: ["Tsut-ps", "about"], // プロフィールリポジトリを除外
  },
  {
    userName: "Tsut_ps",
    platform: "twitter",
    name: "X",
  },
  {
    userName: "56264499",
    platform: "nicovideo",
    name: "ニコニコ動画",
    itemLimit: 24,
    shortPlatform: "nicovideo-shorts",
    shortName: "ニコニコショート",
    shortItemLimit: 24,
  },
];
