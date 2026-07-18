<script setup lang="ts">
const props = defineProps<{
  sections: { key: string, title: string }[]
}>()

const visible = ref(false)
// 画面中央付近に来ているセクションのkey (ハイライト表示)
const activeKey = ref<string | null>(null)

function handleScroll() {
  visible.value = window.scrollY > 400
}

// 直接keyまでスクロールする (画面中央に移動)
function scrollToSection(key: string) {
  document.getElementById(key)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

// 各セクションの実際の位置を比較し、画面中央に一番近いものをアクティブにする
// entry単体を信じると、丈の短いセクションで次のセクションと同時に帯へ入ってしまい
// どちらが優先されるか不安定になるため、判定のたびに比較し直す
function updateActiveSection() {
  const viewportCenter = window.innerHeight / 2
  let closestKey: string | null = null
  let closestDistance = Infinity

  for (const section of props.sections) {
    const el = document.getElementById(section.key)
    if (!el) continue

    const rect = el.getBoundingClientRect()
    // 画面外のセクションは対象にしない
    if (rect.bottom < 0 || rect.top > window.innerHeight) continue

    // 要素の中心と画面中央との距離を計算し、最も近いセクションをアクティブにする
    const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter)
    if (distance < closestDistance) {
      closestDistance = distance
      closestKey = section.key
    }
  }

  activeKey.value = closestKey
}

let observer: IntersectionObserver | undefined

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  // スクロール停止時にも必ず再計算する
  window.addEventListener('scrollend', updateActiveSection)

  // IntersectionObserverは「再計算すべきタイミング」の検知だけに使う
  // どのセクションがアクティブかの判定はupdateActiveSectionで位置比較する
  // scrollイベントのたびに毎回位置計算するより負荷が低い
  observer = new IntersectionObserver(() => updateActiveSection(), { rootMargin: '-40% 0px -40% 0px' })

  for (const section of props.sections) {
    const el = document.getElementById(section.key)
    if (el) observer.observe(el)
  }

  updateActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('scrollend', updateActiveSection)
  observer?.disconnect()
})
</script>

<template>
  <Transition name="fade">
    <nav v-if="visible" class="section-nav" aria-label="アクティビティ内ナビゲーション">
      <button v-for="section in sections" :key="section.key" class="section-nav-link"
        :class="{ 'section-nav-link-active': section.key === activeKey }"
        :aria-current="section.key === activeKey ? 'true' : undefined" @click="scrollToSection(section.key)">
        {{ section.title }}
      </button>
    </nav>
  </Transition>
</template>

<style scoped>
/* コンテンツ列の外側、十分に余白がある画面幅でのみ表示する */
.section-nav {
  position: fixed;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  z-index: 5;

  @media (max-width: 1500px) {
    display: none;
  }
}

.section-nav-link {
  /* buttonのデフォルトスタイルをリセット */
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  text-align: left;
  cursor: pointer;

  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.4;
  transition: opacity 0.25s ease, font-size 0.25s ease;
}

.section-nav-link:hover,
.section-nav-link:focus-visible {
  opacity: 1;
}

.section-nav-link-active {
  font-size: 1rem;
  opacity: 0.9;
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
