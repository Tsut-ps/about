import type { ActivityItem } from "../types/activity";

// 使用する型のみ
export interface GitHubRepo {
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

const userName = "Tsut-ps";
const reposToExclude = ["Tsut-ps"];

export async function fetchAPIGitHub(): Promise<ActivityItem[]> {
  try {
    const response: GitHubRepo[] = await $fetch(
      `https://api.github.com/users/${userName}/repos`,
      {
        query: {
          sort: "created",
          direction: "desc",
          per_page: 10,
        },
        timeout: 10000,
      }
    );

    const items: ActivityItem[] = response
      .filter(
        (repo) =>
          !repo.fork && !repo.archived && !reposToExclude.includes(repo.name)
      )
      .map((repo) => ({
        id: `github-${repo.id}`,
        title: repo.name + (repo.description ? ` - ${repo.description}` : ""),
        date: new Date(repo.updated_at),
        publishedDate: new Date(repo.created_at),
        links: [
          {
            platform: "github",
            url: repo.html_url,
          },
        ],
        description: repo.description,
      }));

    console.log(`[/api/activities] Fetched ${items.length} items from GitHub`);
    return items;
  } catch (error) {
    console.error(`[/api/activities] Failed to fetch GitHub`, error);
    return [];
  }
}
