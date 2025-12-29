<template>
  <header class="header-wrapper">
    <video src="/256kkn.mp4" alt="かわいいヘッダー画像" class="header" autoplay loop muted playsinline @contextmenu.prevent />
  </header>
</template>

<style scoped>
.header-wrapper {
  margin-bottom: -5em;
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
</style>