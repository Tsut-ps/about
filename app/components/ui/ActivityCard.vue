<script setup lang="ts">
const { item, selectedPlatform } = defineProps<{
  item: {
    id: string
    title: string
    thumbnail?: string
    publishedDate: string
    links: {
      platform?: string
      url: string
    }[]
  },
  selectedPlatform: string | undefined
}>()

function formatDate(date: Date | string) {
  const d = new Date(date)
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const url = computed(() => item.links.find(link => link.platform === selectedPlatform)?.url || item.links[0]?.url)

interface PlatformIcon {
  name: string
  src?: string
  size: number
}

const platformIcons: Record<string, PlatformIcon> = {
  youtube: { name: 'mdi:youtube', size: 24 },
  nicovideo: { name: 'simple-icons:niconico', size: 20 },
  blog: { name: 'mdi:web', size: 22 },
  note: { name: 'simple-icons:note', size: 18 },
  scrapbox: { name: 'custom:cosense', size: 20 }
}
</script>

<template>
  <div class="card-thumbnail">
    <a :href="url" target="_blank">
      <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title" width="480" height="360">
      <div v-else class="thumbnail-fallback">
        <Icon
          :name="(item.links[0]?.platform && platformIcons[item.links[0].platform]?.name) || 'mdi:file-document-outline'"
          size="48" />
      </div>
    </a>
  </div>
  <div class="card-info">
    <a :href="url" target="_blank">
      <h3 class="card-title">{{ item.title }}</h3>
    </a>
    <div class="card-meta">
      <time class="card-date">{{ formatDate(item.publishedDate) }}</time>
      <div class="card-platforms">
        <template v-for="(link, index) in item.links" :key="index">
          <a :href="link.url" target="_blank" class="platform-link">
            <Icon :name="(link.platform && platformIcons[link.platform]?.name) || 'mdi:link'"
              :size="(link.platform && platformIcons[link.platform]?.size) || 16" />
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-thumbnail {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: var(--color-accent);
  position: relative;
  border-radius: 8px;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.3);
}

.card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.thumbnail-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(32, 33, 40, 0.8), rgba(27, 32, 44, 0.8));
  opacity: 0.6;
}

.card-info {
  padding: 1rem 0;
  flex: 1 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.card-date {
  font-size: 0.8rem;
  opacity: 0.5;
}

.card-platforms {
  display: flex;
  gap: 0.5rem;
  align-items: center;

  span {
    opacity: 0.5;
  }

  img {
    border-radius: 50%;
    opacity: 0.75;
    object-fit: cover;
  }
}

.platform-link {
  color: var(--color-text);
}
</style>