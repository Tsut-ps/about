import { apis } from "../config/apis";
import type { ActivityItem } from "../types/activity";

// 旧RSSでの取得終了に伴い、公式スナップショット検索APIでも代替不可と確認 (userIdで叩けず)
// HTMLでのスクレイピングは高負荷なので避け、低負荷な形で非公開APIのnvapiを利用する (サイト1回のアクセス分の負荷)
// 方針: 3日に1回程度で負荷をかけず、識別可能なUser-Agentで連絡先を記載する形
// 詳細: https://dic.nicovideo.jp/a/ニコニコ動画api
const config = apis.find((api) => api.platform === "nicovideo");
const apiUrl = `https://nvapi.nicovideo.jp/v3/users/${config?.userName}/videos`;

interface NiconicoVideoItem {
  essential: {
    id: string;
    title: string;
    registeredAt: string;
    contentType: string;
    thumbnail: {
      url?: string;
      largeUrl?: string;
      shortUrl?: string; // ニコニコショート用の縦長(9:16)サムネイル
    };
  };
}

interface NiconicoUserVideosResponse {
  data: {
    items: NiconicoVideoItem[];
  };
}

// 通常動画とニコニコショートは別カテゴリのため、
// selectContentTypeを指定してそれぞれ個別に取得する必要がある(同一クエリでは混在しない)
async function fetchNiconicoVideos(
  selectContentType: "long" | "short",
): Promise<NiconicoVideoItem[]> {
  const response: NiconicoUserVideosResponse = await $fetch(apiUrl, {
    query: {
      selectContentType,
      sortKey: "registeredAt",
      sortOrder: "desc",
      pageSize: 100,
      page: 1,
    },
    headers: {
      // ニコニコ動画のPC閲覧時と同じ定数を指定
      "X-Frontend-Id": "6",
      "X-Frontend-Version": "0",
      // アクセス取得元の連絡先を記載
      "User-Agent": "Tsut-ps (+https://github.com/Tsut-ps/about)",
    },
    timeout: 10000,
  });
  return response.data.items;
}

function toActivityItem(
  { essential }: NiconicoVideoItem,
  platform: string,
): ActivityItem {
  return {
    id: `niconico-${essential.id}`,
    title: essential.title,
    date: new Date(essential.registeredAt),
    publishedDate: new Date(essential.registeredAt),
    links: [
      {
        platform,
        url: `https://www.nicovideo.jp/watch/${essential.id}`,
        thumbnail:
          essential.contentType === "short"
            ? essential.thumbnail.shortUrl || essential.thumbnail.largeUrl
            : essential.thumbnail.largeUrl || essential.thumbnail.url,
      },
    ],
  };
}

export async function fetchApiNiconico(): Promise<ActivityItem[]> {
  if (!config?.userName || !config.shortPlatform) {
    throw new Error("[/api/activities] Niconico config is not defined");
  }
  const { platform, shortPlatform } = config;

  try {
    const [longVideos, shortVideos] = await Promise.all([
      fetchNiconicoVideos("long"),
      fetchNiconicoVideos("short"),
    ]);

    const items = longVideos.map((video) => toActivityItem(video, platform));
    const shortItems = shortVideos.map((video) =>
      toActivityItem(video, shortPlatform),
    );

    const limitedItems = items.slice(0, config.itemLimit || items.length);
    const limitedShortItems = shortItems.slice(
      0,
      config.shortItemLimit || shortItems.length,
    );

    console.log(
      `[/api/activities] Fetched ${items.length} -> ${limitedItems.length} items from ${config.name}`,
    );
    console.log(
      `[/api/activities] Fetched ${shortItems.length} -> ${limitedShortItems.length} items from ${config.shortName ?? config.shortPlatform}`,
    );

    return [...limitedItems, ...limitedShortItems];
  } catch (error) {
    throw new Error(
      `[/api/activities] Failed to fetch ${config.name}: ${error}`,
    );
  }
}
