<script setup lang="ts">
const { item, preferShort } = defineProps<{
  item: {
    id: string
    title: string
    publishedDate: string
    links: {
      platform?: string
      url: string
      thumbnail?: string
    }[]
  }
  // ショートセクションに表示する場合、横動画版が優先リンクに来ていてもショート版を代表として使う
  preferShort?: boolean
  // 日記セクションなど、プラットフォームアイコンの表示が不要な場合に指定する
  hidePlatformIcons?: boolean
}>()

function formatDate(date: Date | string) {
  const d = new Date(date)
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Tokyo'
  })
}

// リンクは優先順位順に並んでいるため、先頭を代表リンクとして使う
const displayLink = computed(() => {
  if (preferShort) {
    return item.links.find(link => link.platform?.endsWith('-shorts')) ?? item.links[0]
  }
  return item.links[0]
})
const url = computed(() => displayLink.value?.url)
// 代表リンクにサムネイルが無い場合は、グループ内の他のリンクから探す
const thumbnail = computed(() => displayLink.value?.thumbnail ?? item.links.find(link => link.thumbnail)?.thumbnail)
// 実際に表示するリンクがショートなら、サムネイルも縦長で表示する
const isShort = computed(() => displayLink.value?.platform?.endsWith('-shorts') ?? false)
</script>

<template>
  <div class="card-thumbnail" :class="{ 'card-thumbnail-shorts': isShort }">
    <!-- タイトルと同じURLへの重複導線なので、クリックは可能なままTabキー選択の対象から外す -->
    <ExtLink :to="url" tabindex="-1">
      <img v-if="thumbnail" :src="thumbnail" :alt="item.title" :width="isShort ? 360 : 480"
        :height="isShort ? 640 : 360">
      <div v-else class="thumbnail-fallback">
        <Icon
          :name="(displayLink?.platform && platformIcons[displayLink.platform]?.name) || 'mdi:file-document-outline'"
          :size="(displayLink?.platform && platformIcons[displayLink.platform]?.size || 24) * 2.4" />
      </div>
    </ExtLink>
  </div>
  <div class="card-info">
    <ExtLink :to="url">
      <h3 class="card-title">{{ item.title }}</h3>
    </ExtLink>
    <div class="card-meta">
      <time class="card-date">{{ formatDate(item.publishedDate) }}</time>
      <div v-if="!hidePlatformIcons" class="card-platforms">
        <template v-for="(link, index) in item.links" :key="index">
          <ExtLink :to="link.url" class="platform-link">
            <Icon :name="(link.platform && platformIcons[link.platform]?.name) || 'mdi:link'"
              :size="(link.platform && platformIcons[link.platform]?.size) || 16" />
          </ExtLink>
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
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
}

.card-thumbnail-shorts {
  aspect-ratio: 9 / 16;
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
  overflow: hidden;
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
  gap: 1rem;

  img {
    border-radius: 50%;
    opacity: 0.75;
    object-fit: cover;
  }
}

.platform-link {
  margin: -0.5rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  color: var(--color-text);
  opacity: 0.5;
  transition: opacity 0.2s ease;

  &:hover,
  &:focus-visible {
    opacity: 0.85;
  }
}
</style>
