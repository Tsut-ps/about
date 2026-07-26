<script setup lang="ts">
const { buildDate } = useAppConfig()
</script>

<template>
  <footer class="footer-section">
    <PartsSNSLinks dimmed class="footer-links" />
    <p class="footer-copyright">© Tsut-ps. Deployed with
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

.footer-copyright {
  font-size: 0.85rem;
  opacity: 0.35;
}

.footer-links {
  margin-bottom: 1.5rem;
}
</style>
