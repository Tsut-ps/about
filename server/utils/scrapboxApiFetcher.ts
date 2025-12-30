import { apis } from "../config/apis";
import type { ActivityItem } from "../types/activity";

const scrapboxApi = apis.find((api) => api.platform === "scrapbox");

// 使用する型のみ
interface ScrapboxPage {
  id: string;
  title: string;
  image?: string;
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

export async function fetchScrapbox(): Promise<ActivityItem[]> {
  if (!scrapboxApi?.url) {
    console.error(`[/api/activities] Scrapbox API URL is not defined`);
    return [];
  }
  try {
    const response: ScrapboxApiResponse = await $fetch(scrapboxApi.url, {
      query: {
        limit: 50,
        sort: "created",
      },
      timeout: 10000,
    });

    const projectName = response.projectName;

    const items: ActivityItem[] = response.pages
      .filter((page) => !scrapboxApi.excludeItems?.includes(page.title))
      .map((page) => ({
        id: `scrapbox-${page.id}`,
        title: page.title,
        date: new Date(page.updated * 1000), // 更新日
        publishedDate: new Date(page.created * 1000), // 作成日
        links: [
          {
            platform: scrapboxApi.platform,
            url: `https://scrapbox.io/${projectName}/${encodeURIComponent(
              replaceSpacesWithUnderscores(page.title)
            )}`,
          },
        ],
      }));

    console.log(
      `[/api/activities] Fetched ${items.length} items from Scrapbox`
    );
    return items;
  } catch (error) {
    console.error(`[/api/activities] Failed to fetch Scrapbox`, error);
    return [];
  }
}
