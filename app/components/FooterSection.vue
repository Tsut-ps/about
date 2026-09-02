<script setup lang="ts">
const { buildDate } = useAppConfig()
</script>

<template>
  <footer class="footer-section">
    <PartsSNSLinks dimmed class="footer-links" />
    <p class="footer-text">
      <ExtLink to="https://note.com/tsutps/n/nf56ab5c50060">二次創作ガイドライン</ExtLink>
    </p>
    <p class="footer-text">© Tsut-ps. Deployed with
      <ExtLink to="https://github.com/Tsut-ps/about">GitHub</ExtLink> ({{ buildDate }})
    </p>
  </footer>
</template>

<style scoped>
.footer-section {
  padding: 3rem 1rem;
  color: var(--color-text);
  text-align: center;
}

.footer-text {
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--color-text) 35%, transparent);

  a {
    color: var(--color-text);
    opacity: 0.35;
    transition: opacity 0.2s ease;

    &:hover,
    &:focus-visible {
      opacity: 0.7;
    }
  }
}

.footer-links {
  margin-bottom: 1.5rem;
}
</style>
