<script setup lang="ts">
const { item } = defineProps<{
  item: {
    id: string
    title: string
    publishedDate: string
    links: {
      platform?: string
      url: string
    }[]
  }
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
const displayLink = computed(() => item.links[0])
const url = computed(() => displayLink.value?.url)
</script>

<template>
  <ExtLink :to="url" class="timeline-item">
    <span class="timeline-item-circle">
      <Icon class="timeline-item-icon"
        :name="(displayLink?.platform && platformIcons[displayLink.platform]?.name) || 'mdi:link'"
        :size="(displayLink?.platform && platformIcons[displayLink.platform]?.size) || 16" />
    </span>
    <span class="timeline-item-content">
      <time class="timeline-item-date">{{ formatDate(item.publishedDate) }}</time>
      <h3 class="timeline-item-title">{{ item.title }}</h3>
    </span>
  </ExtLink>
</template>

<style scoped>
.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.85rem;
  margin: 0 -0.85rem;
  border-radius: 8px;
  color: var(--color-text);
  transition: all 0.2s ease;
}

.timeline-item:hover,
.timeline-item:focus-visible {
  transform: translateY(-4px);
}

.timeline-item:active {
  transition-duration: 0.06s;
  transform: translateY(-2px);
}

.timeline-item-circle {
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-bg);
  border: 1px solid var(--color-accent);
}

.timeline-item-icon {
  opacity: 0.75;
}

.timeline-item-content {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding-top: 0.1rem;
}

.timeline-item-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timeline-item-date {
  font-size: 0.75rem;
  opacity: 0.5;
}
</style>
