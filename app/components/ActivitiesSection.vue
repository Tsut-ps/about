<script setup lang="ts">
const { data: activities } = await useFetch('/api/activities')
const appConfig = useAppConfig()

const filters = ['YouTube', 'ニコニコ動画', '#Shorts', 'ブログ/note', '手記/開発ログ']

// フィルター時のリンクは1番目を優先
const platformMap: Record<string, string[]> = {
  'YouTube': ['youtube'],
  'ニコニコ動画': ['nicovideo'],
  '#Shorts': ['youtube-shorts', 'nicovideo-shorts'],
  'ブログ/note': ['blog', 'note'],
  '手記/開発ログ': ['scrapbox', 'github'],
}

const activeFilter = ref('ニコニコ動画')
const visibleActivityCount = computed(() => activeFilter.value === '#Shorts' ? 4 : 6)

const filteredActivities = computed(() => {
  if (!activities.value) return []

  const filtered = activities.value.filter(item =>
    item.links.some(link => {
      const platforms = platformMap[activeFilter.value] || []
      return platforms.includes(link.platform)
    })
  )

  return filtered.slice(0, visibleActivityCount.value)
})

function setFilter(filter: string) {
  activeFilter.value = filter
}

const platformLink = computed(() => {
  return appConfig.snsLinks.find(snsLink => {
    return snsLink.name === activeFilter.value
  })?.url || undefined
})
</script>

<template>
  <section class="activities">
    <div class="activities-content">

      <!-- フィルターヘッダー -->
      <div class="header-container">
        <h2 class="activities-title">New!</h2>
        <div class="filter-container">
          <button v-for="filter in filters" :key="filter" class="filter-btn"
            :class="{ active: activeFilter === filter }" @click="setFilter(filter)" @mouseenter="setFilter(filter)">
            {{ filter }}
          </button>
        </div>
      </div>

      <!-- アクティビティ -->
      <div class="activity-container-frame">
        <div :key="activeFilter" class="activity-container"
          :class="{ 'activity-container-shorts': activeFilter === '#Shorts' }">
          <div v-for="item in filteredActivities" :key="item.id" target="_blank" class="activity-card">
            <UiActivityCard :item="item" :selected-platform="platformMap[activeFilter]?.[0]" />
          </div>
        </div>
      </div>

      <!-- もっと見る -->
      <div class="more-container">
        <a v-if="platformLink" :href="platformLink" aria-label="もっと見る" target="_blank">
          <Icon name="mdi:chevron-down" :size="24" />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.activities {
  margin: 1rem 1rem 6rem;
}

.activities-content {
  max-width: 1200px;
  margin: 0 auto;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    justify-content: center;
  }
}

.activities-title {
  font-size: 3rem;
  margin: 0 -1rem;
  padding: 0 1rem;
  opacity: 0.9;
  font-weight: 500;
  font-family: 'Caveat', cursive;
}

.filter-container {
  display: flex;
  gap: .25rem;
  flex-wrap: wrap;

  @media (max-width: 800px) {
    justify-content: center;
  }
}

.filter-btn {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1rem;
  padding: .65rem 1.25rem;
  cursor: pointer;
  opacity: 0.5;
  border-radius: 64px;
  transition: opacity 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.filter-btn:hover {
  opacity: 0.8;
  background-color: var(--color-accent);
  transform: translateY(-2px);
}

.filter-btn.active {
  opacity: 1;
  background-color: var(--color-accent);
}

.activity-container-frame {
  @media (min-width: 801px) {
    min-height: 660px;
  }
}

.activity-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  animation: fadeIn 0.3s ease forwards;

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }
}

.activity-container-shorts {
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.activity-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--color-text);
  cursor: pointer;
  transition: transform 0.3s ease;

  @media (min-width: 600px) and (max-width: 800px) {
    &:nth-child(n+5) {
      display: none;
    }
  }

  @media (max-width: 600px) {
    max-width: 380px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.activity-card:hover {
  transform: translateY(-8px);
}

.activity-card:hover .card-thumbnail img {
  transform: scale(1.05);
}

.more-container {
  display: block;
  width: 100%;
  height: 6em;
  opacity: 0.5;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
