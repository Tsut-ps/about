import type { API } from "../types/activity";

export const apis: API[] = [
  {
    url: "https://scrapbox.io/api/pages/Tsut-ps/",
    platform: "scrapbox",
    name: "Cosense",
    excludeItems: ["Tsut-ps"], // ユーザーページを除外
  },
  {
    url: "https://api.github.com/users/Tsut-ps/repos",
    platform: "github",
    name: "GitHub",
    excludeItems: ["Tsut-ps"], // プロフィールリポジトリを除外
  },
];
