<script setup lang="ts">
const { data: activities } = await useFetch('/api/activities')

const filters = ['すべて', 'YouTube', 'ニコニコ動画', 'ブログ', 'Cosense(Scrapbox)']

// フィルター時のリンクは1番目を優先
const platformMap: Record<string, string[]> = {
  'すべて': ['youtube', 'nicovideo', 'blog', 'note', 'scrapbox'],
  'YouTube': ['youtube'],
  'ニコニコ動画': ['nicovideo'],
  'ブログ': ['blog', 'note'],
  'Cosense(Scrapbox)': ['scrapbox']
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
      <div class="activity-grid">
        <div v-for="item in filteredActivities" :key="item.id" target="_blank" class="activity-card">
          <UiActivityCard :item="item" :selected-platform="platformMap[activeFilter]?.[0]" />
        </div>
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

  @media (max-width: 800px) {
    justify-content: center
  }
}

.activities-title {
  font-size: 3rem;
  margin: 0;
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

.activity-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.activity-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--color-text);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-8px);
}

.activity-card:hover .card-thumbnail img {
  transform: scale(1.05);
}
</style>