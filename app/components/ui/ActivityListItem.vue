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
    day: '2-digit'
  })
}

// リンクは優先順位順に並んでいるため、先頭を代表リンクとして使う
const displayLink = computed(() => item.links[0])
const url = computed(() => displayLink.value?.url)
</script>

<template>
  <a :href="url" target="_blank" class="list-item">
    <span class="list-item-circle">
      <Icon
        class="list-item-icon"
        :name="(displayLink?.platform && platformIcons[displayLink.platform]?.name) || 'mdi:link'"
        :size="(displayLink?.platform && platformIcons[displayLink.platform]?.size) || 16" />
    </span>
    <span class="list-item-content">
      <time class="list-item-date">{{ formatDate(item.publishedDate) }}</time>
      <h3 class="list-item-title">{{ item.title }}</h3>
    </span>
  </a>
</template>

<style scoped>
.list-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem;
  margin: 0 -0.75rem;
  border-radius: 8px;
  color: var(--color-text);
  transition: all 0.2s ease;
}

.list-item:hover {
  transform: translateY(-4px);
}

.list-item:active {
  transition-duration: 0.06s;
  transform: translateY(-2px);
}

.list-item-circle {
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

.list-item-icon {
  opacity: 0.75;
}

.list-item-content {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding-top: 0.3rem;
}

.list-item-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item-date {
  font-size: 0.75rem;
  opacity: 0.5;
}
</style>
