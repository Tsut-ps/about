<script setup lang="ts">
import { snsAkaLinks, snsCardLinks } from '~/data/sns-links'

// 自己紹介の詳細の表示とプロフィール本体の移動を同じ状態で同期する
const isBioExpanded = ref(false)
</script>

<template>
  <section class="profile">
    <div class="profile-content" :class="{ 'is-bio-expanded': isBioExpanded }">
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
      <ProfileBio v-model:expanded="isBioExpanded" />

      <!-- SNSリンク -->
      <PartsSNSLinks class="social-mini-links" />

      <!-- SNSリンク(カード) -->
      <div class="social-links">
        <UiSNSCard v-for="link in snsCardLinks" :key="link.url" :url="link.url" :icon-name="link.iconName"
          :icon-size="link.iconSize" :name="link.name" :description="link.description" />
      </div>

      <!-- SNSリンク(その他のカード) -->
      <div class="social-links social-links-aka">
        <UiSNSCardAka v-for="link in snsAkaLinks" :key="link.url" :url="link.url" :icon-name="link.iconName"
          :icon-size="link.iconSize" :name="link.name" :description="link.description" />
      </div>
    </div>
    <PartsProfileBioDetails :visible="isBioExpanded" />
  </section>
</template>

<style scoped>
.profile {
  position: relative;
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
  transition: transform 300ms cubic-bezier(.2, .8, .2, 1);

  &.is-bio-expanded {
    /* 右側の自己紹介の詳細へ視線をつなげつつ、プロフィールの中央感は残す */
    transform: translateX(-64px);
  }
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

.social-mini-links {
  margin-bottom: 2rem;
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
