<script setup lang="ts">
const { data: activities } = await useFetch('/api/activities')
const appConfig = useAppConfig()

const filters = ['YouTube', 'ニコニコ動画', 'ブログ/note', '手記/開発ログ']

// フィルター時のリンクは1番目を優先
const platformMap: Record<string, string[]> = {
  'YouTube': ['youtube'],
  'ニコニコ動画': ['nicovideo'],
  'ブログ/note': ['blog', 'note'],
  '手記/開発ログ': ['scrapbox', 'github'],
}

const activeFilter = ref('ニコニコ動画')

const filteredActivities = computed(() => {
  if (!activities.value) return []

  const filtered = activities.value.filter(item =>
    item.links.some(link => {
      const platforms = platformMap[activeFilter.value] || []
      return platforms.includes(link.platform)
    })
  )

  return filtered.slice(0, 3)
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
            :class="{ active: activeFilter === filter }" @click="setFilter(filter)">
            {{ filter }}
          </button>
        </div>
      </div>

      <!-- アクティビティ -->
      <div class="activity-container">
        <div v-for="item in filteredActivities" :key="item.id" target="_blank" class="activity-card">
          <UiActivityCard :item="item" :selected-platform="platformMap[activeFilter]?.[0]" />
        </div>
      </div>

      <!-- もっと見る -->
      <div class="more-container">
        <a v-if="platformLink" :href="platformLink" aria-label="もっと見る">
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
  transition: all 0.2s;
  border-radius: 64px;
}

.filter-btn:hover {
  opacity: 0.8;
  background-color: var(--color-accent);
}

.filter-btn.active {
  opacity: 1;
  background-color: var(--color-accent);
}

.activity-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    justify-items: center;
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
    &:nth-child(3) {
      display: none;
    }
  }

  @media (max-width: 600px) {
    max-width: 380px;
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