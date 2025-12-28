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
        <a href="https://www.youtube.com/@kokonkr" target="_blank" class="social-card">
          <div class="social-icon">
            <Icon name="mdi:youtube" size="32" />
          </div>
          <div class="social-info">
            <h3 class="social-name">YouTube</h3>
            <p class="social-description">好きな音声合成キャラが喋ったり歌ったり(カバー)</p>
          </div>
        </a>
        <a href="https://www.nicovideo.jp/user/56264499" target="_blank" class="social-card">
          <div class="social-icon">
            <Icon name="simple-icons:niconico" size="28" />
          </div>
          <div class="social-info">
            <h3 class="social-name">ニコニコ動画</h3>
            <p class="social-description">一部YouTubeにはないトーク動画が上がってます</p>
          </div>
        </a>
        <a href="https://twitter.com/Tsut_ps" target="_blank" class="social-card">
          <div class="social-icon">
            <Icon name="mdi:twitter" size="28" />
          </div>
          <div class="social-info">
            <h3 class="social-name">Twitter</h3>
            <p class="social-description">サイト、動画更新、進捗、なんかできた副産物 etc.</p>
          </div>
        </a>
        <a href="https://misskey.io/@Tsut_ps" target="_blank" class="social-card">
          <div class="social-icon">
            <Icon name="simple-icons:misskey" size="28" />
          </div>
          <div class="social-info">
            <h3 class="social-name">Misskey</h3>
            <p class="social-description">Discord以外だったら、ここが一番活発</p>
          </div>
        </a>
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

.social-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-accent);
  transition: all 0.2s ease;
}

.social-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  background: var(--color-accent);
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: var(--color-accent);
}

.social-info {
  flex: 1;
  text-align: left;
}

.social-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--color-text);
}

.social-description {
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.7;
}
</style>