<script setup lang="ts">
import { profile } from '~/data/profile'

const expanded = defineModel<boolean>('expanded', { required: true })
const enabled = ref(false)
const trigger = useTemplateRef<HTMLElement>('trigger')

let mediaQuery: MediaQueryList | undefined
let observer: IntersectionObserver | undefined

/** プロフィール補足の開閉状態を切り替える */
function toggleExpanded() {
  expanded.value = !expanded.value
}

/** 画面幅と操作可否を同期し、表示対象外になった自己紹介の詳細を閉じる */
function updateAvailability(event: MediaQueryListEvent | MediaQueryList) {
  enabled.value = event.matches
  if (!enabled.value) expanded.value = false
}

onMounted(() => {
  // CSSで自己紹介の詳細を隠す幅では、見えない開閉ボタンも操作不可にする
  mediaQuery = window.matchMedia('(min-width: 1501px)')
  updateAvailability(mediaQuery)
  mediaQuery.addEventListener('change', updateAvailability)

  // 自己紹介が画面上端を十分に越えたら、詳細を閉じる
  observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) expanded.value = false
  }, { rootMargin: '25% 0px 0px' })
  if (trigger.value) observer.observe(trigger.value)
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', updateAvailability)
  observer?.disconnect()
})
</script>

<template>
  <button ref="trigger" class="bio" type="button" :title="enabled ? 'もっとみる' : undefined" aria-controls="bio-details"
    :aria-expanded="expanded" :disabled="!enabled" @click="toggleExpanded">
    <span v-for="text in profile.bio" :key="text">{{ text }}</span>
  </button>
</template>

<style scoped>
.bio {
  padding: .4rem .7rem;
  margin-bottom: 2rem;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font-size: 1rem;
  line-height: 1.6;
  cursor: help;
  opacity: .9;
  transition: background-color 180ms ease, opacity 180ms ease;

  span {
    white-space: nowrap;
  }

  &:hover:not(:disabled),
  &:focus-visible {
    background-color: #222838;
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid rgb(255 255 255 / 70%);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: default;
  }
}
</style>
