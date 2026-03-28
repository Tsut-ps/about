<script setup lang="ts">
const appConfig = useAppConfig()
const SNSLinks = appConfig.snsLinks.filter(link => !link.viewType)
const SNSCardLinks = appConfig.snsLinks.filter(link => link.viewType === 'card')
const SNSCardLinksAka = appConfig.snsLinks.filter(link => link.viewType === 'card-aka')
</script>

<template>
  <section class="profile">
    <div class="profile-content">
      <!-- プロフィール画像 -->
      <div class="avatar-wrapper">
        <span class="orbit orbit-left" aria-hidden="true">♪</span>
        <img src="/kknkr.png" alt="狐紺くろのプロフィール画像" class="avatar" width="100" height="100">
        <span class="orbit orbit-right" aria-hidden="true">★</span>
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

      <!-- SNSリンク(その他のカード) -->
      <div class="social-links social-links-aka">
        <UiSNSCardAka v-for="link in SNSCardLinksAka" :key="link.url" :url="link.url" :icon-name="link.iconName"
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

.profile-content {
  margin: 3rem 2rem;
  text-align: center;
  max-width: 600px;
  z-index: 10;
}

.avatar-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.orbit {
  position: absolute;
  font-size: 1.25rem;
  opacity: 0.7;
  animation: orbitBounce 2.8s ease-in-out infinite;
}

.orbit-left {
  left: -2.1rem;
  top: 60%;
  transform: translateY(-50%);
}

.orbit-right {
  right: -2rem;
  top: 65%;
  transform: translateY(-50%);
  animation-delay: 1.4s;
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

  &:active {
    transition-duration: 0.06s;
    transform: translateY(-2px);
  }
}

.social-links {
  margin: 1rem 0;
  display: grid;
  gap: 1rem;
}

.social-links-aka {
  gap: .5rem;
}

@keyframes orbitBounce {

  0%,
  100% {
    transform: translateY(-50%) rotate(0deg);
  }

  50% {
    transform: translateY(calc(-50% - 6px)) rotate(8deg);
  }
}
</style>