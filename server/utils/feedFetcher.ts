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
    const shortItems: ActivityItem[] = [];

    // nicovideo/blog/note/scrapbox: RSS 2.0形式
    if (parsed.rss?.channel?.item) {
      const entries = Array.isArray(parsed.rss.channel.item)
        ? parsed.rss.channel.item
        : [parsed.rss.channel.item];

      for (const entry of entries) {
        const isNicovideo = feedConfig.platform.startsWith("nicovideo");
        const isShort = typeof entry.link === "string" && entry.link.includes("/watch/ss");
        const platform = isNicovideo && isShort
          ? feedConfig.shortPlatform
          : feedConfig.platform;

        if (!platform) continue;


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
          isNicovideo &&
          thumbnail &&
          !thumbnail.endsWith(".L")
        ) {
          thumbnail = thumbnail + ".L";
        }

        // blog, note, scrapbox
        const id = entry.guid?.["#text"] || entry.guid || entry.link;

        const item = {
          id,
          title: entry.title,
          date: new Date(entry.pubDate),
          publishedDate: new Date(entry.pubDate),
          links: [
            {
              platform,
              url: entry.link,
            },
          ],
          thumbnail,
        };

        if (platform === feedConfig.shortPlatform) {
          shortItems.push(item);
        } else {
          items.push(item);
        }
      }
    }

    const limitedItems = items.slice(0, feedConfig.itemLimit || items.length);
    const limitedShortItems = shortItems.slice(0, feedConfig.shortItemLimit || shortItems.length);

    console.log(
      `[/api/activities] Fetched ${items.length} -> ${limitedItems.length} items from ${feedConfig.name}`
    );
    if (feedConfig.shortPlatform) {
      console.log(
        `[/api/activities] Fetched ${shortItems.length} -> ${limitedShortItems.length} items from ${feedConfig.shortName ?? feedConfig.shortPlatform}`
      );
    }

    return [...limitedItems, ...limitedShortItems];
  } catch (error) {
    throw new Error(`[/api/activities] Failed to fetch ${feedConfig.name}: ${error}`);
  }
}
