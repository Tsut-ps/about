import { apis } from "../config/apis";
import type { ActivityItem } from "../types/activity";

const githubApi = apis.find((api) => api.platform === "github");

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

export async function fetchAPIGitHub(): Promise<ActivityItem[]> {
  if (!githubApi?.url) {
    console.error(`[/api/activities] GitHub API URL is not defined`);
    return [];
  }
  try {
    const response: GitHubApiResponse[] = await $fetch(githubApi.url, {
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
          !githubApi.excludeItems?.includes(repo.name)
      )
      .map((repo) => ({
        id: `github-${repo.id}`,
        title: repo.name + (repo.description ? ` - ${repo.description}` : ""),
        date: new Date(repo.updated_at),
        publishedDate: new Date(repo.created_at),
        links: [
          {
            platform: githubApi.platform,
            url: repo.html_url,
          },
        ],
      }));

    console.log(`[/api/activities] Fetched ${items.length} items from GitHub`);
    return items;
  } catch (error) {
    console.error(`[/api/activities] Failed to fetch GitHub`, error);
    return [];
  }
}
