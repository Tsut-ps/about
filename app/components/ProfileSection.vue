<script setup lang="ts">
const SNSLinks = [
  {
    url: 'https://www.youtube.com/@kokonkr',
    iconName: 'mdi:youtube',
    iconSize: 32,
    name: 'YouTube',
    description: '好きな音声合成キャラが喋ったり歌ったり(カバー)'
  },
  {
    url: 'https://www.nicovideo.jp/user/56264499',
    iconName: 'simple-icons:niconico',
    iconSize: 28,
    name: 'ニコニコ動画',
    description: '一部YouTubeにはないトーク動画が上がってます'
  },
  {
    url: 'https://twitter.com/Tsut_ps',
    iconName: 'mdi:twitter',
    iconSize: 28,
    name: 'Twitter',
    description: 'サイト、動画更新、進捗、なんかできた副産物 etc.'
  },
  {
    url: 'https://misskey.io/@Tsut_ps',
    iconName: 'simple-icons:misskey',
    iconSize: 28,
    name: 'Misskey',
    description: 'Discord以外だったら、ここが一番活発'
  }
]
</script>

<template>
  <section class="profile">
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
      <div class="social-links">
        <UiSNSCard v-for="link in SNSLinks" :key="link.url" :url="link.url" :icon-name="link.iconName"
          :icon-size="link.iconSize" :name="link.name" :description="link.description" />
      </div>
    </div>
  </section>
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(256px, 1fr));
  gap: 1rem;
}
</style>