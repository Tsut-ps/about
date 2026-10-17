<template>
  <NuxtRouteAnnouncer />
  <HeaderSection />
  <main>
    <ProfileSection />
    <ActivitiesSection />
  </main>
  <FooterSection />
  <UiBackToTopButton />
</template>

<style>
:root {
  /* 基本色 */
  --color-bg: #1b202c;
  --color-accent: #323b52;
  --color-text: #f1f1f1;

  /* 面 */
  --color-surface: #222838;
  --color-header-bg: #edbd98;

  /* 文字の濃淡 */
  --color-text-muted: color-mix(in srgb, var(--color-text) 50%, transparent);
  --color-text-hover: color-mix(in srgb, var(--color-text) 85%, transparent);

  /* 線・ホバー・フォーカス */
  --color-border: color-mix(in srgb, var(--color-text) 12%, transparent);
  --color-border-hover: color-mix(in srgb, var(--color-text) 25%, transparent);
  --color-hover-bg: color-mix(in srgb, var(--color-text) 5%, transparent);
  --color-focus-ring: color-mix(in srgb, var(--color-text) 70%, transparent);

  /* 影 */
  --color-shadow: rgb(0 0 0 / 20%);

  /* ActivityCard の代替背景 */
  --color-gradient-start: color-mix(in srgb, var(--color-surface) 80%, transparent);
  --color-gradient-end: color-mix(in srgb, var(--color-bg) 80%, transparent);
}

* {
  box-sizing: border-box;
}

a {
  color: var(--color-text);
  text-decoration: none;
}

body {
  margin: 0;
  /* activity-section-altの全幅背景(100vw)がスクロールバー分はみ出すのを防ぐ */
  overflow-x: hidden;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: 'Zen Maru Gothic', sans-serif;

}

button,
input,
textarea,
select {
  font-family: inherit;
}

:where(.i-simple-icons\:niconico) {
  transform: translateY(-1px);
}
</style>
