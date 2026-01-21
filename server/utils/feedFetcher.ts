import { XMLParser } from "fast-xml-parser";
import type { ActivityItem, Feed } from "../types/activity";

/**
 * RSS/Atom フィード取得・解析ユーティリティ
 * 
 * 複数のフィードフォーマットに対応:
 * - Atom形式（YouTube）: <feed><entry> 構造
 * - RSS 2.0形式（ニコニコ動画、note、ブログ、Scrapbox）: <rss><channel><item> 構造
 * 
 * 各プラットフォーム固有の処理:
 * - YouTube: ショート動画を除外、media:thumbnail からサムネイル取得
 * - ニコニコ動画: 高画質版サムネイル（.L）を使用
 * - ブログ: description内の<img>タグからサムネイル抽出
 * 
 * エラーハンドリング: 取得失敗時は空配列を返して処理を継続
 */
const parser = new XMLParser({
  ignoreAttributes: false, // hrefなどの属性を含めて解析
  attributeNamePrefix: "@_", // 属性名の接頭辞
});

/**
 * RSS/Atom フィードを取得して ActivityItem 配列に変換
 * 
 * @param feedConfig - フィード設定（URL、プラットフォーム名、アイテム数制限など）
 * @returns 取得・解析された活動アイテムの配列（エラー時は空配列）
 */
export async function fetchFeed(feedConfig: Feed): Promise<ActivityItem[]> {
  try {
    const response: string = await $fetch(feedConfig.url, {
      responseType: "text",
      timeout: 10000,
    });
    const parsed = parser.parse(response);

    const items: ActivityItem[] = [];

    // YouTube: Atom形式
    if (parsed.feed?.entry) {
      const entries = Array.isArray(parsed.feed.entry)
        ? parsed.feed.entry
        : [parsed.feed.entry];

      for (const entry of entries) {
        const url = entry.link?.["@_href"] || entry.link;

        // ショート動画を除く
        if (url && url.includes("/shorts/")) continue;

        items.push({
          id: entry.id,
          title: entry.title,
          date: new Date(entry.updated || entry.published),
          publishedDate: new Date(entry.published),
          links: [
            {
              platform: feedConfig.platform,
              url,
            },
          ],
          thumbnail: entry["media:group"]?.["media:thumbnail"]?.["@_url"],
        });
      }
    }

    // nicovideo/blog/note/scrapbox: RSS 2.0形式
    else if (parsed.rss?.channel?.item) {
      const entries = Array.isArray(parsed.rss.channel.item)
        ? parsed.rss.channel.item
        : [parsed.rss.channel.item];

      for (const entry of entries) {
        // nicovideo, note
        let thumbnail =
          entry["media:thumbnail"]?.["@_url"] || entry["media:thumbnail"];

        // blog: description内のimgタグから抽出
        if (!thumbnail && feedConfig.platform === "blog" && entry.description) {
          const imgMatch = entry.description.match(/<img[^>]+src="([^"]+)"/);
          if (imgMatch) thumbnail = imgMatch[1];
        }

        // nicovideo: 高画質版サムネイルを取得
        if (
          feedConfig.platform === "nicovideo" &&
          thumbnail &&
          !thumbnail.endsWith(".L")
        ) {
          thumbnail = thumbnail + ".L";
        }

        // blog, note, scrapbox
        const id = entry.guid?.["#text"] || entry.guid || entry.link;

        items.push({
          id,
          title: entry.title,
          date: new Date(entry.pubDate),
          publishedDate: new Date(entry.pubDate),
          links: [
            {
              platform: feedConfig.platform,
              url: entry.link,
            },
          ],
          thumbnail,
        });
      }
    }

    const limitedItems = items.slice(0, feedConfig.itemLimit || items.length);
    console.log(
      `[/api/activities] Fetched ${items.length} -> ${limitedItems.length} items from ${feedConfig.name}`
    );
    return limitedItems;
  } catch (error) {
    console.error(
      `[/api/activities] Failed to fetch ${feedConfig.name}:`,
      error
    );
    return [];
  }
}
