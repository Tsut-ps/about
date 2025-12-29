<script setup lang="ts">
const { data: activities } = await useFetch('/api/activities')

const filters = ['YouTube', 'ニコニコ動画', 'ブログ', 'Cosense/note']

// フィルター時のリンクは1番目を優先
const platformMap: Record<string, string[]> = {
  'YouTube': ['youtube'],
  'ニコニコ動画': ['nicovideo'],
  'ブログ': ['blog'],
  'Cosense/note': ['note', 'scrapbox']
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
  width: fit-content;
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

.activity-grid {
  max-height: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }
}

.activity-card {
  max-width: 380px;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--color-text);
  cursor: pointer;
  transition: transform 0.3s ease;

  @media (min-width: 641px) and (max-width: 1024px) {
    &:nth-child(3) {
      display: none;
    }
  }
}

.activity-card:hover {
  transform: translateY(-8px);
}

.activity-card:hover .card-thumbnail img {
  transform: scale(1.05);
}
</style>