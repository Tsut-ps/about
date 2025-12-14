<script setup lang="ts">
const { data: activities, pending, error } = await useFetch('/api/activities')

const filters = ['すべて', 'YouTube', 'ニコニコ動画', 'ブログ', 'Cosense（Scrapbox）']

const platformMap: Record<string, string[]> = {
  'すべて': ['youtube', 'nicovideo', 'blog', 'note', 'scrapbox'],
  'YouTube': ['youtube'],
  'ニコニコ動画': ['nicovideo'],
  'ブログ': ['blog', 'note'],
  'Cosense（Scrapbox）': ['scrapbox']
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

function formatDate(date: Date | string) {
  const d = new Date(date)
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const platformIcons: Record<string, { name: string; size: number }> = {
  youtube: { name: 'mdi:youtube', size: 24 },
  nicovideo: { name: 'simple-icons:niconico', size: 20 },
  blog: { name: 'custom:kknkr', size: 22 },
  note: { name: 'simple-icons:note', size: 18 },
  scrapbox: { name: 'ic:baseline-edit-note', size: 26 }
}
</script>

<template>
  <div class="container">
    <section class="profile">
      <div class="profile-content">
        <!-- プロフィール画像 -->
        <div class="avatar-wrapper">
          <NuxtImg src="/kknkr.png" alt="狐紺くろのプロフィール画像" class="avatar" width="100" height="100" format="webp" />
        </div>

        <!-- 名前 -->
        <h1 class="name">狐紺くろ</h1>

        <!-- サブタイトル -->
        <p class="subtitle">ここん</p>

        <!-- 自己紹介 -->
        <p class="bio">
          <span>音声合成キャラに歌ってもらったり、</span><span>解説記事を作ったり、</span><span>プログラムを書いたりしています。</span>
        </p>

        <!-- SNSリンク -->
        <div class="social-links">
          <a href="https://www.youtube.com/@kokonkr" target="_blank" class="social-link" title="YouTube">
            <Icon name="mdi:youtube" size="34" />
          </a>
          <a href="https://www.nicovideo.jp/user/56264499" target="_blank" class="social-link" title="ニコニコ動画">
            <Icon name="simple-icons:niconico" size="26" />
          </a>
          <a href="https://twitter.com/Tsut_ps" target="_blank" class="social-link" title="Twitter">
            <Icon name="mdi:twitter" size="32" />
          </a>
          <a href="https://misskey.io/@Tsut_ps" target="_blank" class="social-link" title="Misskey">
            <Icon name="simple-icons:misskey" size="30" />
          </a>
        </div>
      </div>
    </section>

    <section class="activities">
      <div class="activities-content">
        <div class="header-container">
          <h2 class="activities-title">New!</h2>
          <div class="filter-container">
            <button v-for="filter in filters" :key="filter" class="filter-btn"
              :class="{ active: activeFilter === filter }" @click="setFilter(filter)">
              {{ filter }}
            </button>
          </div>
        </div>

        <!-- ローディング・エラー表示 -->
        <div v-if="pending" class="loading">読み込み中...</div>
        <div v-else-if="error" class="error">エラーが発生しました</div>

        <!-- アクティビティグリッド -->
        <div v-else class="activity-grid">
          <a v-for="item in filteredActivities" :key="item.id" :href="item.links[0]?.url" target="_blank"
            class="activity-card">
            <div class="card-thumbnail">
              <NuxtImg v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title" width="480" height="360"
                format="webp" />
              <div v-else class="thumbnail-fallback">
                <Icon
                  :name="(item.links[0]?.platform && platformIcons[item.links[0].platform]?.name) || 'mdi:file-document-outline'"
                  size="48" />
              </div>
            </div>
            <div class="card-info">
              <h3 class="card-title">{{ item.title }}</h3>
              <div class="card-meta">
                <time class="card-date">{{ formatDate(item.publishedDate) }}</time>
                <div class="card-platforms">
                  <template v-for="(link, index) in item.links" :key="index">
                    <template v-if="link.platform && platformIcons[link.platform]?.name === 'custom:kknkr'">
                      <NuxtImg src="/kknkr.png" alt="ブログ" :width="platformIcons[link.platform]?.size"
                        :height="platformIcons[link.platform]?.size" />
                    </template>
                    <template v-else>
                      <Icon :name="(link.platform && platformIcons[link.platform]?.name) || 'mdi:link'"
                        :size="(link.platform && platformIcons[link.platform]?.size) || 16" />
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.profile {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 6rem 2rem 3rem;
}

.profile-content {
  text-align: center;
  max-width: 600px;
}

.avatar-wrapper {
  margin-bottom: 1rem;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.name {
  font-size: 1.5rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  opacity: 0.7;
  font-weight: 400;
}

.bio {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;

  span {
    white-space: nowrap;
  }
}

.social-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  color: var(--color-text);
  transition: all 0.2s;
  text-decoration: none;
}

.social-link:hover {
  transform: translateY(-3px);
}

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
}

.filter-btn {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1rem;
  padding: .75rem 1.25rem;
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

.loading,
.error {
  text-align: center;
  padding: 3rem;
  opacity: 0.7;
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

@media (max-width: 1024px) {
  .activity-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .activity-grid {
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
  justify-content: space-between
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
  gap: 0.5rem;
  align-items: center;

  span {
    opacity: 0.5;
  }

  img {
    border-radius: 50%;
    opacity: 0.75;
  }
}

:where(.i-simple-icons\:niconico) {
  transform: translateY(-1px);
}
</style>
