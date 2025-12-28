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

        // scrapbox: サムネイルなし (CORS制限のため)

        // nicovideo: 高画質版サムネイルを取得
        if (
          feedConfig.platform === "nicovideo" &&
          thumbnail &&
          !thumbnail.endsWith(".L")
        ) {
          thumbnail = thumbnail + ".L";
        }

        let title = entry.title;

        // scrapbox: タイトルから「 - 」以降を除去
        if (feedConfig.platform === "scrapbox" && title.includes(" - ")) {
          title = title.split(" - ")[0].trim();
        }
        // scrapbox: ユーザーページを除外
        if (feedConfig.platform === "scrapbox" && title === "Tsut-ps") {
          continue;
        }

        // blog, note, scrapbox
        const id = entry.guid?.["#text"] || entry.guid || entry.link;

        items.push({
          id,
          title,
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

    console.log(
      `[/api/activities] Fetched ${items.length} items from ${feedConfig.name}`
    );
    return items;
  } catch (error) {
    console.error(
      `[/api/activities] Failed to fetch ${feedConfig.name}:`,
      error
    );
    return [];
  }
}
