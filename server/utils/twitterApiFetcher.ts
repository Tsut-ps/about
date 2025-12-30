import { apis } from "../config/apis";
import type { ActivityItem } from "../types/activity";

const config = apis.find((api) => api.platform === "twitter");
const apiUrl = `https://api.twitter.com/2`;

interface TwitterMedia {
  url?: string;
  type: "video" | "animated_gif" | "photo";
  media_key: string;
  preview_image_url?: string;
  variants?: Array<{
    bit_rate?: number;
    content_type: string;
    url: string;
  }>;
}

interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  attachments?: {
    media_keys: string[];
  };
}

interface TwitterResponse {
  data: TwitterTweet[];
  includes?: {
    media?: TwitterMedia[];
  };
  meta: {
    result_count: number;
    newest_id?: string;
    oldest_id?: string;
    next_token?: string;
  };
}

export async function fetchApiTwitter(): Promise<ActivityItem[]> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!config?.userName) {
    console.error("[/api/activities] Twitter username is not defined");
    return [];
  }
  if (!bearerToken) {
    console.error("[/api/activities] TWITTER_BEARER_TOKEN is not set");
    return [];
  }

  try {
    const userResponse = await $fetch<{
      data: { id: string };
    }>(`${apiUrl}/users/by/username/${config.userName}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      timeout: 10000,
    });

    const userId = userResponse.data.id;

    const response: TwitterResponse = await $fetch(
      `${apiUrl}/users/${userId}/tweets`,
      {
        query: {
          max_results: 100,
          "tweet.fields": "created_at,public_metrics,attachments",
          "media.fields": "media_key,type,url,preview_image_url,variants",
          expansions: "attachments.media_keys",
          exclude: "retweets,replies", // RTと返信を除外
        },
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        timeout: 10000,
      }
    );

    if (!response.data || response.data.length === 0) {
      console.log("[/api/activities] No tweets found from Twitter");
      return [];
    }

    const mediaMap = new Map<string, TwitterMedia>();
    if (response.includes?.media) {
      for (const media of response.includes.media) {
        mediaMap.set(media.media_key, media);
      }
    }

    // 動画ありエンゲージメントありでフィルタ
    const items: ActivityItem[] = response.data
      .filter((tweet) => {
        // エンゲージメントがある
        if (tweet.public_metrics.like_count < 3) return false;

        // メディアが添付されている
        if (!tweet.attachments?.media_keys) return false;

        // 動画またはアニメGIFが含まれている
        const hasVideo = tweet.attachments.media_keys.some((key) => {
          const media = mediaMap.get(key);
          return media?.type === "video" || media?.type === "animated_gif";
        });
        return hasVideo;
      })
      .map((tweet) => {
        let thumbnail: string | undefined;

        if (tweet.attachments?.media_keys) {
          for (const key of tweet.attachments.media_keys) {
            const media = mediaMap.get(key);
            if (media?.type === "video" || media?.type === "animated_gif") {
              thumbnail = media.preview_image_url;
              break; // 最初の動画メディアのサムネイルを使用
            }
          }
        }

        return {
          id: `twitter-${tweet.id}`,
          title:
            tweet.text.length > 50
              ? tweet.text.substring(0, 50) + "..."
              : tweet.text,
          date: new Date(tweet.created_at),
          publishedDate: new Date(tweet.created_at),
          links: [
            {
              platform: "twitter",
              url: `https://twitter.com/${config.userName}/status/${tweet.id}`,
            },
          ],
          thumbnail,
        };
      });

    const limitedItems = items.slice(0, config.itemLimit || items.length);
    console.log(
      `[/api/activities] Fetched ${items.length} -> ${limitedItems.length} items from X`
    );
    return limitedItems;
  } catch (error) {
    console.error("[/api/activities] Failed to fetch X", error);
    return [];
  }
}
