import { XMLParser } from "fast-xml-parser";
import type { ActivityItem, Feed } from "../types/activity";

const parser = new XMLParser({
  ignoreAttributes: false, // hrefなどの属性を含めて解析
  attributeNamePrefix: "@_", // 属性名の接頭辞
});

export async function fetchFeed(feedConfig: Feed): Promise<ActivityItem[]> {
  try {
    const response: string = await $fetch(feedConfig.url, {
      responseType: "text",
      timeout: 10000,
    });
    const parsed = parser.parse(response);

    const items: ActivityItem[] = [];

    // nicovideo/blog/note/scrapbox: RSS 2.0形式
    if (parsed.rss?.channel?.item) {
      const entries = Array.isArray(parsed.rss.channel.item)
        ? parsed.rss.channel.item
        : [parsed.rss.channel.item];

      for (const entry of entries) {
        // ニコニコ: /watch/ss... から始まるショート動画を除く
        if (
          feedConfig.platform === "nicovideo" &&
          typeof entry.link === "string" &&
          entry.link.includes("/watch/ss")
        ) {
          continue;
        }

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
