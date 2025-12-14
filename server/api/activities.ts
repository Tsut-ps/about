import type { ActivityItem } from "../types/activity";
import { feeds } from "../config/feeds";
import { fetchFeed } from "../utils/feedFetcher";

export default defineEventHandler(async () => {
  // フィードを並行取得
  const results = await Promise.allSettled(
    feeds.map((feed) => fetchFeed(feed))
  );

  // 成功したものだけを取得
  const activityItems: ActivityItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      activityItems.push(...result.value);
    }
  }

  return activityItems;
});
