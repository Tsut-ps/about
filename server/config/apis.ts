import type { API } from "../types/activity";

export const apis: API[] = [
  {
    userName: "Tsut-ps",
    platform: "scrapbox",
    name: "Cosense",
    itemLimit: 2,
    excludeItems: ["Tsut-ps"], // ユーザーページを除外
  },
  {
    userName: "Tsut-ps",
    platform: "github",
    name: "GitHub",
    itemLimit: 2,
    excludeItems: ["Tsut-ps", "about"], // プロフィールリポジトリを除外
  },
  {
    userName: "Tsut_ps",
    platform: "twitter",
    name: "X",
  },
];
