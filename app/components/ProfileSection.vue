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
</style>