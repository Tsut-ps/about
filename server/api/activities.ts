import type { ActivityItem } from "../types/activity";
import { feeds } from "../config/feeds";
import { fetchFeed } from "../utils/feedFetcher";
import { fetchApiGitHub } from "../utils/githubApiFetcher";
import { fetchApiScrapbox } from "../utils/scrapboxApiFetcher";
import { groupSimilarItems } from "../utils/activityGrouper";

/**
 * アクティビティ一覧取得 API
 * 
 * 複数のプラットフォーム（YouTube、ニコニコ動画、note、ブログ、Scrapbox、GitHub）から
 * 最新の活動を取得し、重複をグループ化して返す。
 * 
 * 処理フロー:
 * 1. すべてのフィード/APIを並行取得（Promise.allSettled で一部失敗しても続行）
 * 2. 取得成功したアイテムを統合
 * 3. タイトルの類似度から重複をグループ化
 * 4. 公開日でソート（新しい順）
 * 
 * キャッシュ: nuxt.config.ts で 1時間（3600秒）のSWRキャッシュが設定されている
 * 
 * @returns グループ化・ソート済みの活動アイテム配列
 */
export default defineEventHandler(async () => {
  // フィードとAPIを並行取得
  const results = await Promise.allSettled([
    ...feeds.map((feed) => fetchFeed(feed)),
    fetchApiGitHub(),
    fetchApiScrapbox(),
  ]);

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
