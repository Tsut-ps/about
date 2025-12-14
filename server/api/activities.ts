import type { ActivityItem } from "../types/activity";
import { feeds } from "../config/feeds";
import { fetchFeed } from "../utils/feedFetcher";
import { groupSimilarItems } from "../utils/activityGrouper";

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

  // 同一コンテンツのグループ化（タイトルが類似している場合）
  const grouped = groupSimilarItems(activityItems);

  // 公開日でソート（新しい順）
  grouped.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());

  return grouped;
});
