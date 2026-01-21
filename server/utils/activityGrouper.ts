import type { ActivityItem } from "../types/activity";

/**
 * 類似した活動アイテムをグループ化するユーティリティ
 * 
 * 同じコンテンツを複数プラットフォームに投稿した場合（例: YouTubeとニコニコ動画に同じ動画）、
 * タイトルの類似度から同一コンテンツを判定してグループ化する。
 * 
 * グループ化の処理:
 * 1. タイトルの類似度を計算（装飾文字・助詞などを除外して比較）
 * 2. 類似アイテムが見つかった場合、すべてのリンクを統合
 * 3. 最適なサムネイル（優先度: YouTube > ニコニコ > その他）を選択
 * 4. 最も古い公開日（初出日）を採用
 * 
 * @param items - グループ化する活動アイテムの配列
 * @returns グループ化された活動アイテムの配列
 */
export function groupSimilarItems(items: ActivityItem[]): ActivityItem[] {
  const grouped: ActivityItem[] = [];
  const processedIds = new Set<string>();

  for (const item of items) {
    if (processedIds.has(item.id)) continue;

    // 類似タイトルのアイテムを検索
    const similar = items.filter(
      (other) =>
        !processedIds.has(other.id) &&
        other.id !== item.id &&
        isSimilarTitle(item.title, other.title)
    );

    if (similar.length > 0) {
      // グループ化 [[platform, url], [platform, url], ...]
      const links = [...item.links, ...similar.flatMap((s) => s.links)];

      // サムネイル優先順位 [高] 0 >>>> 4 [低]
      const priorityOrder = [
        "youtube",
        "nicovideo",
        "blog",
        "note",
        "scrapbox",
      ];
      let bestThumbnail = item.thumbnail;
      let bestPriority =
        priorityOrder.indexOf(item.links[0]?.platform) ?? priorityOrder.length; // 存在しない場合は最低優先度

      // 公開日は最も古いものを採用
      let oldestPublishedDate = item.publishedDate;
      // 更新日は最も新しいものを採用
      let newestDate = item.date;

      for (const similarItem of similar) {
        if (similarItem.thumbnail) {
          const priority =
            priorityOrder.indexOf(similarItem.links[0]?.platform) ??
            priorityOrder.length;
          if (priority < bestPriority) {
            bestThumbnail = similarItem.thumbnail;
            bestPriority = priority;
          }
        }
        // より古い日付があれば更新
        if (similarItem.publishedDate < oldestPublishedDate) {
          oldestPublishedDate = similarItem.publishedDate;
        }
        // より新しい日付があれば更新
        if (similarItem.date > newestDate) {
          newestDate = similarItem.date;
        }
      }

      grouped.push({
        ...item,
        links,
        thumbnail: bestThumbnail,
        date: newestDate,
        publishedDate: oldestPublishedDate,
      });

      // 現在のアイテムと類似アイテムを処理済みに追加
      processedIds.add(item.id);
      similar.forEach((s) => processedIds.add(s.id));
    } else {
      grouped.push(item);
      processedIds.add(item.id);
    }
  }

  return grouped;
}

/**
 * 2つのタイトルが類似しているかを判定する
 * 
 * 判定アルゴリズム:
 * 1. タイトルを正規化（装飾文字、助詞、記号などを除去してコア情報を抽出）
 * 2. 完全一致なら true
 * 3. 片方がもう片方を含み、短い方が長い方の60%以上なら true
 * 
 * 除外される要素:
 * - 括弧とその中身【】[]()
 * - よくある動詞表現（歌ってみた、カバーしてみた など）
 * - 助詞（に、で、を、が、は）
 * - 記号（!？。、など）
 * - スペース
 * 
 * @param title1 - 比較するタイトル1
 * @param title2 - 比較するタイトル2
 * @returns 類似している場合 true
 */
function isSimilarTitle(title1: string, title2: string): boolean {
  // タイトルの正規化（コア情報の抽出）
  const extractCore = (str: string) => {
    return (
      str
        .toLowerCase()
        .trim()
        // 全角英数字を半角に
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
          String.fromCharCode(s.charCodeAt(0) - 0xfee0)
        )
        // 括弧とその中身を削除（装飾情報）
        .replace(/【[^】]*】/g, "")
        .replace(/\[[^\]]*\]/g, "")
        .replace(/\([^)]*\)/g, "")
        .replace(/「[^」]*」/g, (match) => {
          // 「」内が曲名などの可能性があるので残す（「」は削除）
          return match.slice(1, -1);
        })
        // よくある動詞表現を除く
        .replace(/(を)?歌ってもらった/g, "")
        .replace(/(を)?歌わせてみた/g, "")
        .replace(/(を)?歌ってみた/g, "")
        .replace(/カバー(してみた)?/g, "")
        .replace(/cover(ed)?(\s+by)?/gi, "")
        // 助詞を除く（に、で、を、が、は）
        .replace(/[にでをがは]/g, "")
        // 記号を除く
        .replace(/[！!？?。、，,・]/g, "")
        // スペースを除く
        .replace(/\s+/g, "")
        .trim()
    );
  };

  const core1 = extractCore(title1);
  const core2 = extractCore(title2);

  // 完全一致
  if (core1 === core2) return true;

  // どちらかが空になった場合は比較不可
  if (!core1 || !core2) return false;

  // どちらかがもう一方を含む（60%以上の長さ）
  const shorter = core1.length < core2.length ? core1 : core2;
  const longer = core1.length >= core2.length ? core1 : core2;
  if (longer.includes(shorter) && shorter.length / longer.length > 0.6) {
    return true;
  }

  return false;
}
