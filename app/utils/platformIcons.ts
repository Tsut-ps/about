export interface PlatformIcon {
  name: string
  size: number
}

export const platformIcons: Record<string, PlatformIcon> = {
  youtube: { name: 'mdi:youtube', size: 24 },
  'youtube-shorts': { name: 'mdi:youtube', size: 24 },
  nicovideo: { name: 'simple-icons:niconico', size: 20 },
  'nicovideo-shorts': { name: 'simple-icons:niconico', size: 20 },
  blog: { name: 'mdi:web', size: 22 },
  note: { name: 'simple-icons:note', size: 16 },
  scrapbox: { name: 'custom:cosense', size: 20 },
  github: { name: 'mdi:github', size: 23 }
}
