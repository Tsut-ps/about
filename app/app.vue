<template>
  <NuxtRouteAnnouncer />
  <HeaderSection />
  <main>
    <ProfileSection />
    <ActivitiesSection />
  </main>
  <FooterSection />
</template>

<style>
:root {
  --color-bg: #1b202c;
  --color-accent: #323b52;
  --color-text: #f1f1f1;
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
