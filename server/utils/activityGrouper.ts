import type { ActivityItem } from "../types/activity";

// サムネイル/代表リンク優先順位 [高] 0 >>>> 7 [低]
// 横動画がある場合はショートより横動画を優先する
const platformPriorityOrder = [
  "youtube",
  "nicovideo",
  "youtube-shorts",
  "nicovideo-shorts",
  "blog",
  "note",
  "scrapbox",
  "github",
];

const getPlatformPriority = (platform?: string) => {
  const priority = platformPriorityOrder.indexOf(platform ?? "");
  return priority === -1 ? platformPriorityOrder.length : priority; // 存在しない場合は最低優先度
};

// 複数リンクを持つアイテムでも、最も優先度の高いリンクで比較する
const getItemPriority = (item: ActivityItem) => {
  return Math.min(...item.links.map((link) => getPlatformPriority(link.platform)));
};

export function groupSimilarItems(items: ActivityItem[]): ActivityItem[] {
  const grouped: ActivityItem[] = [];
  const processedIds = new Set<string>();

  for (const item of items) {
    if (processedIds.has(item.id)) continue;

    // itemを基準に、未処理のotherを1件ずつ比較して類似候補を集める
    const similar = items.filter(
      (other) =>
        !processedIds.has(other.id) &&
        other.id !== item.id &&
        isSimilarTitle(item.title, other.title),
    );

    if (similar.length > 0) {
      // 類似候補がある場合は1件の活動としてまとめる
      const groupedItems = [item, ...similar];

      // 同じコンテンツに横動画とショートがある場合は、横動画を代表にする (小さい値が優先)
      const primaryItem = groupedItems.reduce((best, current) =>
        getItemPriority(current) < getItemPriority(best) ? current : best,
      );

      // リンクも優先順位で並べて、表示時のデフォルトリンクを代表側に寄せる
      const links = groupedItems
        .flatMap((groupedItem) => groupedItem.links)
        .sort((a, b) => getPlatformPriority(a.platform) - getPlatformPriority(b.platform));

      // 基本は代表アイテムのサムネイルを使う。無い場合は後続の類似アイテムから拾う
      let bestThumbnail = primaryItem.thumbnail;
      let bestPriority = getItemPriority(primaryItem);

      // 公開日は最も古いものを採用
      let oldestPublishedDate = item.publishedDate;
      // 更新日は最も新しいものを採用
      let newestDate = item.date;

      for (const similarItem of similar) {
        if (similarItem.thumbnail) {
          const priority = getItemPriority(similarItem);
          if (!bestThumbnail || priority < bestPriority) {
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

      // タイトルやIDは代表アイテムを使い、リンク・サムネイル・日付は統合結果で上書きする
      grouped.push({
        ...primaryItem,
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

// 表記ゆれを吸収し、同じコンテンツとしてまとめられるタイトルか判定する
function isSimilarTitle(title1: string, title2: string): boolean {
  // タイトルの正規化（コア情報の抽出）
  const extractCore = (str: string) => {
    return (
      str
        .toLowerCase()
        .trim()
        // 全角英数字を半角に
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
          String.fromCharCode(s.charCodeAt(0) - 0xfee0),
        )
        // 括弧とその中身を削除（装飾情報）
        .replace(/【[^】]*】/g, "")
        .replace(/\[[^\]]*\]/g, "")
        .replace(/\([^)]*\)/g, "")
        .replace(/「[^」]*」/g, (match) => {
          // 「」内が曲名などの可能性があるので残す（「」は削除）
          return match.slice(1, -1);
        })
        .replace(/｢[^｣]*｣/g, (match) => {
          // ｢｣内が曲名などの可能性があるので残す（｢｣は削除）
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
        .replace(/[！!？?。、，,・#＃]/g, "")
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

  // タイトルが短すぎる場合は誤判定が増えるため、ngram比較は行わない
  const minCoreLength = Math.min(
    Array.from(core1).length,
    Array.from(core2).length,
  );
  if (minCoreLength < 2) return false;

  // 語順が入れ替わったタイトルでも拾えるよう、隣接文字列の一致率を見る
  // タイトルが短い場合は2-gram、長い場合は3-gramで比較
  const ngramSize = minCoreLength < 10 ? 2 : 3;
  const threshold = ngramSize === 2 ? 0.9 : 0.8;
  return calculateNgramSimilarity(core1, core2, ngramSize) >= threshold;
}

// タイトルの類似度を計算するn-gram
function calculateNgramSimilarity(
  str1: string,
  str2: string,
  ngramSize: number,
): number {
  const ngrams1 = getNgramCounts(str1, ngramSize);
  const ngrams2 = getNgramCounts(str2, ngramSize);
  const total =
    [...ngrams1.values()].reduce((sum, count) => sum + count, 0) +
    [...ngrams2.values()].reduce((sum, count) => sum + count, 0);

  if (total === 0) return 0;

  let intersection = 0;
  for (const [ngram, count] of ngrams1) {
    intersection += Math.min(count, ngrams2.get(ngram) ?? 0);
  }

  return (2 * intersection) / total;
}

function getNgramCounts(str: string, ngramSize: number): Map<string, number> {
  const chars = Array.from(str);
  const ngrams = new Map<string, number>();

  // 文字単位のn-gramを数える
  for (let index = 0; index <= chars.length - ngramSize; index++) {
    const ngram = chars.slice(index, index + ngramSize).join("");
    ngrams.set(ngram, (ngrams.get(ngram) ?? 0) + 1);
  }

  return ngrams;
}
