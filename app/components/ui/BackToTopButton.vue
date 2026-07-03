<script setup lang="ts">
const visible = ref(false)

function handleScroll() {
  visible.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Transition name="fade">
    <button v-if="visible" class="back-to-top" aria-label="ページ上部に戻る" @click="scrollToTop">
      <Icon name="material-symbols:keyboard-arrow-up-rounded" :size="32" />
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border: none;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-text);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.back-to-top:hover {
  transform: translateY(-4px);
}

.back-to-top:active {
  transition-duration: 0.06s;
  transform: translateY(-2px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
