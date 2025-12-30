import { apis } from "../config/apis";
import type { ActivityItem } from "../types/activity";

const config = apis.find((api) => api.platform === "github");
const apiUrl = `https://api.github.com/users/${config?.userName}/repos`;

// 使用する型のみ
export interface GitHubApiResponse {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  homepage: string | null;
  archived: boolean;
}

export async function fetchApiGitHub(): Promise<ActivityItem[]> {
  if (!config?.userName) {
    console.error(`[/api/activities] GitHub username is not defined`);
    return [];
  }
  try {
    const response: GitHubApiResponse[] = await $fetch(apiUrl, {
      query: {
        sort: "created",
        direction: "desc",
        per_page: 10,
      },
      timeout: 10000,
    });

    const items: ActivityItem[] = response
      .filter(
        (repo) =>
          !repo.fork &&
          !repo.archived &&
          !config.excludeItems?.includes(repo.name)
      )
      .map((repo) => ({
        id: `github-${repo.id}`,
        title: repo.name + (repo.description ? ` - ${repo.description}` : ""),
        date: new Date(repo.updated_at),
        publishedDate: new Date(repo.created_at),
        links: [
          {
            platform: config.platform,
            url: repo.html_url,
          },
        ],
      }));

    const limitedItems = items.slice(0, config.itemLimit || items.length);
    console.log(
      `[/api/activities] Fetched ${items.length} -> ${limitedItems.length} items from GitHub`
    );
    return limitedItems;
  } catch (error) {
    console.error("[/api/activities] Failed to fetch GitHub", error);
    return [];
  }
}
