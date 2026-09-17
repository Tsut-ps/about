export type { ActivityItem } from "../../shared/types/activity";

export interface Feed {
  url: string;
  platform: string;
  name: string;
  itemLimit?: number;
}

export interface API {
  platform: string;
  name: string;
  userName?: string;
  playlistId?: string;
  itemLimit?: number;
  excludeItems?: string[];
  shortPlatform?: string;
  shortName?: string;
  shortItemLimit?: number;
}
