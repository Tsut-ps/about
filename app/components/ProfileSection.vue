<script setup lang="ts">
const appConfig = useAppConfig()
const SNSLinks = appConfig.snsLinks.filter(link => link.viewType !== 'card')
const SNSCardLinks = appConfig.snsLinks.filter(link => link.viewType === 'card')
</script>

<template>
  <section class="profile">
    <div class="header-wrapper">
      <video src="/256kkn.mp4" alt="かわいいヘッダー画像" class="header" autoplay loop muted playsinline @contextmenu.prevent />
    </div>

    <div class="profile-content">
      <!-- プロフィール画像 -->
      <div class="avatar-wrapper">
        <img src="/kknkr.png" alt="狐紺くろのプロフィール画像" class="avatar" width="100" height="100">
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
      <div class="social-mini-links">
        <a v-for="link in SNSLinks" :key="link.url" :href="link.url" target="_blank" class="social-mini-link"
          :title="link.name + ' / ' + link.description">
          <Icon :name="link.iconName" :size="link.iconSize" />
        </a>
      </div>

      <!-- SNSリンク(カード) -->
      <div class="social-links">
        <UiSNSCard v-for="link in SNSCardLinks" :key="link.url" :url="link.url" :icon-name="link.iconName"
          :icon-size="link.iconSize" :name="link.name" :description="link.description" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.header-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  height: min(240px, 35vw);
  background-color: #edbd98;
}

.header {
  width: 100%;
  max-width: 1200px;
  height: 100%;
  object-fit: cover;
  object-position: center 33%;
}

.profile-content {
  margin: -2rem 2rem 3rem;
  text-align: center;
  max-width: 600px;
  z-index: 10;
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

.social-mini-links {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.social-mini-link {
  margin: -0.5rem;
  padding: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
}

.social-links {
  display: grid;
  gap: 1rem;
}
</style>