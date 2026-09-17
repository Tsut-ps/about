export interface ActivityLink {
  platform: string;
  url: string;
  thumbnail?: string;
}

export interface ActivityItem<TDate = Date> {
  id: string;
  title: string;
  date: TDate;
  publishedDate: TDate;
  links: ActivityLink[];
}

export type ActivityResponseItem = ActivityItem<string>;
