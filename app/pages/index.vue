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
          <!-- SNSアイコンはここに -->
        </div>
      </div>
    </section>

    <section class="activities">
      <!-- Activityセクションはここに -->
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
  margin-bottom: 4rem;
}

.activities {
  min-height: 100vh;
  padding: 4rem 2rem;
}
</style>
