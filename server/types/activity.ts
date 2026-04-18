export interface ActivityItem {
  id: string;
  title: string;
  date: Date;
  publishedDate: Date;
  links: Array<{
    platform: string;
    url: string;
  }>;
  thumbnail?: string;
}

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
}
