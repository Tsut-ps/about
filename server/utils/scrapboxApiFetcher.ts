import { apis } from "../config/apis";
import type { ActivityItem } from "../types/activity";

const config = apis.find((api) => api.platform === "scrapbox");
const apiUrl = `https://scrapbox.io/api/pages/${config?.userName}/`;

// 使用する型のみ
interface ScrapboxPage {
  id: string;
  title: string;
  image?: string;
  pin: 0 | number; // 0ならピン留めされていない
  created: number; // Unix timestamp (秒)
  updated: number; // Unix timestamp (秒)
}

interface ScrapboxApiResponse {
  projectName: string;
  skip: number;
  limit: number;
  count: number;
  pages: ScrapboxPage[];
}

// " " を "_" に変換する
function replaceSpacesWithUnderscores(str: string): string {
  return str.replace(/ /g, "_");
}

export async function fetchApiScrapbox(): Promise<ActivityItem[]> {
  if (!config?.userName) {
    console.error(`[/api/activities] Scrapbox username is not defined`);
    return [];
  }
  try {
    const response: ScrapboxApiResponse = await $fetch(apiUrl, {
      query: {
        limit: 20,
        sort: "created",
      },
      timeout: 10000,
    });

    const projectName = response.projectName;

    const items: ActivityItem[] = response.pages
      .filter(
        (page) => !config.excludeItems?.includes(page.title) && page.pin === 0
      )
      .map((page) => ({
        id: `scrapbox-${page.id}`,
        title: page.title,
        date: new Date(page.updated * 1000), // 更新日
        publishedDate: new Date(page.created * 1000), // 作成日
        links: [
          {
            platform: config.platform,
            url: `https://scrapbox.io/${projectName}/${encodeURIComponent(
              replaceSpacesWithUnderscores(page.title)
            )}`,
          },
        ],
      }));

    const limitedItems = items.slice(0, config.itemLimit || items.length);
    console.log(
      `[/api/activities] Fetched ${items.length} -> ${limitedItems.length} items from Scrapbox`
    );
    return limitedItems;
  } catch (error) {
    console.error("[/api/activities] Failed to fetch Scrapbox", error);
    return [];
  }
}
