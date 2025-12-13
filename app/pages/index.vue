<template>
  <div class="container">
    <section class="profile">
      <div class="profile-content">
        <!-- プロフィール画像 -->
        <div class="avatar-wrapper">
          <img src="/kknkr.png" alt="狐紺くろのプロフィール画像" class="avatar">
        </div>

        <!-- 名前 -->
        <h1 class="name">狐紺くろ</h1>

        <!-- 自己紹介 -->
        <p class="bio">
          音声合成キャラに歌ってもらったり、解説記事を作ったり、プログラムを書いたりしています。
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

        <!-- スクロール矢印 -->
        <div class="scroll-indicator">
          <Icon name="mdi:chevron-down" size="32" />
        </div>
      </div>
    </section>

    <section class="activities">
      <div class="activities-content">
        <div class="filter-container">
          <button class="filter-btn active">All</button>
          <button class="filter-btn">YouTube</button>
          <button class="filter-btn">ニコニコ動画</button>
          <button class="filter-btn">個人ブログ</button>
          <button class="filter-btn">note</button>
          <button class="filter-btn">Cosense</button>
        </div>

        <!-- アクティビティグリッド -->
        <div class="activity-grid">
          <!-- アクティビティカードがここに表示されます -->
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
}

.profile {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.profile-content {
  text-align: center;
  max-width: 600px;
}

.avatar-wrapper {
  margin-bottom: 2rem;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.name {
  font-size: 2.5rem;
  margin: 0 0 0.5rem;
  font-weight: 700;
}

.title {
  font-size: 1.25rem;
  margin: 0 0 1.5rem;
  opacity: 0.7;
}

.bio {
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 2rem;
  opacity: 0.9;
}

.social-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
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
  transform: translateY(-2px);
  background-color: #2a2b34;
}

.scroll-indicator {
  margin-top: 2rem;
  opacity: 0.5;
  animation: bounce 2s infinite;
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(8px);
  }
}

/* Activities Section */
.activities {
  min-height: 100vh;
  padding: 4rem 2rem;
}

.activities-content {
  max-width: 1200px;
  margin: 0 auto;
}

.filter-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(241, 241, 241, 0.1);
}

.filter-btn {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
  position: relative;
}

.filter-btn:hover {
  opacity: 0.8;
}

.filter-btn.active {
  opacity: 1;
}

.filter-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1rem;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--color-text);
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}
</style>
