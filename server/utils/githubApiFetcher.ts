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

interface GitHubReadmeResponse {
  content: string;
  encoding: string;
}

/**
 * READMEのコンテンツから最初の画像URLを抽出する
 */
function extractFirstImageFromReadme(
  readmeContent: string,
  repoFullName: string
): string | undefined {
  // Markdown形式の画像: ![alt](url) or ![alt](url "title")
  const markdownImageRegex = /!\[[^\]]*\]\(([^\s)]+)(?:\s+["'][^"']*["'])?\)/;
  // HTML形式の画像: <img src="url">
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/i;

  const markdownMatch = readmeContent.match(markdownImageRegex);
  const htmlMatch = readmeContent.match(htmlImageRegex);

  // 最初に見つかった画像を返す（位置が早い方を優先）
  let imageUrl: string | undefined;
  if (markdownMatch && htmlMatch) {
    const markdownIndex = readmeContent.indexOf(markdownMatch[0]);
    const htmlIndex = readmeContent.indexOf(htmlMatch[0]);
    imageUrl = markdownIndex < htmlIndex ? markdownMatch[1] : htmlMatch[1];
  } else if (markdownMatch) {
    imageUrl = markdownMatch[1];
  } else if (htmlMatch) {
    imageUrl = htmlMatch[1];
  }

  if (!imageUrl) return undefined;

  // 相対パスの場合はGitHub raw URLに変換
  if (!imageUrl.startsWith("http")) {
    // 先頭の ./ を削除
    const cleanPath = imageUrl.replace(/^\.\//, "");
    imageUrl = `https://raw.githubusercontent.com/${repoFullName}/HEAD/${cleanPath}`;
  }

  return imageUrl;
}

/**
 * リポジトリのREADMEから最初の画像URLを取得する
 */
async function fetchReadmeThumbnail(
  owner: string,
  repoName: string
): Promise<string | undefined> {
  try {
    const readmeUrl = `https://api.github.com/repos/${owner}/${repoName}/readme`;
    const response: GitHubReadmeResponse = await $fetch(readmeUrl, {
      timeout: 5000,
    });

    if (response.encoding === "base64" && response.content) {
      const decodedContent = Buffer.from(response.content, "base64").toString(
        "utf-8"
      );
      return extractFirstImageFromReadme(
        decodedContent,
        `${owner}/${repoName}`
      );
    }
  } catch (error) {
    // READMEが存在しない場合やエラーの場合は静かに失敗
    console.debug(
      `[/api/activities] Failed to fetch README for ${owner}/${repoName}`,
      error
    );
  }
  return undefined;
}

export async function fetchApiGitHub(): Promise<ActivityItem[]> {
  if (!config?.userName) {
    throw new Error("[/api/activities] GitHub username is not defined");
  }

  const userName = config.userName;

  try {
    const response: GitHubApiResponse[] = await $fetch(apiUrl, {
      query: {
        sort: "created",
        direction: "desc",
        per_page: 10,
      },
      timeout: 10000,
    });

    const filteredRepos = response.filter(
      (repo) =>
        !repo.fork &&
        !repo.archived &&
        !config.excludeItems?.includes(repo.name)
    );

    // 各リポジトリのREADMEからサムネイルを並列で取得
    const items: ActivityItem[] = await Promise.all(
      filteredRepos.map(async (repo) => {
        const thumbnail = await fetchReadmeThumbnail(userName, repo.name);
        return {
          id: `github-${repo.id}`,
          title: repo.name + (repo.description ? ` - ${repo.description}` : ""),
          date: new Date(repo.updated_at),
          publishedDate: new Date(repo.created_at),
          links: [
            {
              platform: config.platform,
              url: repo.html_url,
              ...(thumbnail && { thumbnail }), // サムネイルが存在する場合のみ追加
            },
          ],
        };
      })
    );

    const limitedItems = items.slice(0, config.itemLimit || items.length);
    console.log(
      `[/api/activities] Fetched ${items.length} -> ${limitedItems.length} items from GitHub`
    );
    return limitedItems;
  } catch (error) {
    throw new Error(`[/api/activities] Failed to fetch GitHub: ${error}`);
  }
}
