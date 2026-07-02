import { apis } from "../config/apis";
import type { ActivityItem, API } from "../types/activity";

const configs = apis.filter((api) => api.platform.startsWith("youtube"));
const apiUrl = "https://www.googleapis.com/youtube/v3";

interface YouTubeThumbnail {
  url: string;
  width?: number;
  height?: number;
}

interface YouTubePlaylistSnippet {
  title: string;
  publishedAt: string;
  resourceId: {
    videoId?: string;
  };
  thumbnails: {
    maxres?: YouTubeThumbnail;
    standard?: YouTubeThumbnail;
    high?: YouTubeThumbnail;
    medium?: YouTubeThumbnail;
    default?: YouTubeThumbnail;
  };
}

interface YouTubePlaylistItem {
  id: string;
  snippet: YouTubePlaylistSnippet;
}

interface YouTubePlaylistItemsResponse {
  items?: YouTubePlaylistItem[];
}

type YouTubeThumbnailSet = YouTubePlaylistSnippet["thumbnails"];

const pickThumbnail = (thumbnails: YouTubeThumbnailSet): string | undefined => {
  return (
    thumbnails?.maxres?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url
  );
};

async function fetchYouTubePlaylist(config: API, apiKey: string): Promise<ActivityItem[]> {
  if (!config?.playlistId) {
    throw new Error(`[/api/activities] ${config.name} playlistId is not defined`);
  }

  try {
    const playlistResponse = await $fetch<YouTubePlaylistItemsResponse>(
      `${apiUrl}/playlistItems`,
      {
        query: {
          part: "snippet",
          playlistId: config.playlistId,
          maxResults: config.itemLimit ?? 24,
          key: apiKey,
        },
        timeout: 10000,
      },
    );

    if (!playlistResponse.items || playlistResponse.items.length === 0) {
      console.log(`[/api/activities] No videos found from ${config.name}`);
      return [];
    }

    const items: ActivityItem[] = playlistResponse.items
      .filter((item): item is YouTubePlaylistItem & {
          snippet: { resourceId: { videoId: string } };
        } => Boolean(item.snippet.resourceId.videoId),
      )
      .map((item) => {
        const videoId = item.snippet.resourceId.videoId;
        const publishedAt = item.snippet?.publishedAt;

        return {
          id: `yt:video:${videoId}`,
          title: item.snippet.title,
          date: new Date(publishedAt),
          publishedDate: new Date(publishedAt),
          links: [
            {
              platform: config.platform,
              url: `https://www.youtube.com/watch?v=${videoId}`,
              thumbnail: pickThumbnail(item.snippet.thumbnails),
            },
          ],
        };
      });

    const limitedItems = items.slice(0, config.itemLimit || items.length);
    console.log(
      `[/api/activities] Fetched ${items.length} -> ${limitedItems.length} items from ${config.name}`,
    );
    return limitedItems;
  } catch (error) {
    throw new Error(`[/api/activities] Failed to fetch ${config.name}: ${error}`);
  }
}

export async function fetchApiYouTube(): Promise<ActivityItem[]> {
  const apiKey = useRuntimeConfig().youtubeApiKey;

  if (!apiKey) {
    throw new Error("[/api/activities] YOUTUBE_API_KEY is not set");
  }

  const results = await Promise.all(configs.map((config) => fetchYouTubePlaylist(config, apiKey)));
  return results.flat();
}
