<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <main>
      <NuxtPage />
    </main>
  </NuxtLayout>
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

body {
  margin: 0;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: 'Noto Sans JP', sans-serif;
}

:where(.i-simple-icons\:niconico) {
  transform: translateY(-1px);
}
</style>
