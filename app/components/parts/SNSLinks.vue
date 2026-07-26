<script setup lang="ts">
import { snsLinks as allSnsLinks } from '~/data/sns-links'

// フッターなど、目立たせたくない場所ではdimmedを指定する
const { dimmed } = defineProps<{
  dimmed?: boolean
}>()

const snsLinks = allSnsLinks.filter(link => !link.viewType)
const snsOtherLinks = allSnsLinks.filter(link => link.viewType === 'other')
const snsOtherContainer = useTemplateRef<HTMLDivElement>('snsOtherContainer')
const isOtherMenuOpen = ref(false)

// 外側をクリックしたら閉じる
const handleClickOutside = (event: MouseEvent) => {
  if (!isOtherMenuOpen.value) return

  const container = snsOtherContainer.value
  const target = event.target

  if (target instanceof Node && !container?.contains(target)) isOtherMenuOpen.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="sns-links" :class="{ 'sns-links-dimmed': dimmed }">
    <ExtLink v-for="link in snsLinks" :key="link.url" :to="link.url" class="sns-link"
      :title="link.name + ' / ' + link.description">
      <Icon :name="link.iconName" :size="link.iconSize" />
    </ExtLink>

    <div v-if="snsOtherLinks.length" ref="snsOtherContainer" class="sns-other-links">
      <button type="button" class="sns-other-button" title="その他のリンク" aria-label="その他のリンク"
        :aria-expanded="isOtherMenuOpen" @click="isOtherMenuOpen = !isOtherMenuOpen">
        <Icon name="mdi:dots-horizontal" :size="28" aria-hidden="true" />
      </button>
      <Transition name="sns-other-menu">
        <div v-if="isOtherMenuOpen" class="sns-other-menu">
          <ExtLink v-for="link in snsOtherLinks" :key="link.url" :to="link.url" class="sns-other-link"
            :title="link.name + ' / ' + link.description">
            <Icon :name="link.iconName" :size="link.iconSize" />
            <span>{{ link.name }}</span>
          </ExtLink>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.sns-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.sns-link,
.sns-other-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -0.5rem;
  padding: 0.5rem;
  color: var(--color-text);
}

.sns-link {
  transition: transform 0.2s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-4px);
  }

  &:active {
    transition-duration: 0.06s;
    transform: translateY(-2px);
  }
}

.sns-other-links {
  display: flex;
  align-items: center;
  position: relative;
}

.sns-other-button {
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0.65;
  transition: opacity 0.2s ease, transform 0.2s ease;

  &:hover,
  &:focus-visible {
    opacity: 1;
  }

  &:active {
    transition-duration: 0.06s;
    transform: translateY(2px);
  }

  &[aria-expanded='true'] {
    opacity: 1;
  }
}

.sns-other-menu {
  position: absolute;
  top: calc(100% + 0.75rem);
  left: 50%;
  z-index: 20;
  min-width: max-content;
  padding: 0.5rem;
  border: 1px solid var(--color-accent);
  border-radius: 8px;
  background: var(--color-bg);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: translateX(-50%);
}

.sns-other-menu-enter-active,
.sns-other-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.sns-other-menu-enter-from,
.sns-other-menu-leave-to {
  opacity: 0;
  transform: translate(-50%, -0.5rem);
}

.sns-other-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover,
  &:focus-visible {
    background: var(--color-accent);
  }
}

.sns-links-dimmed {
  .sns-link {
    opacity: 0.5;

    &:hover,
    &:focus-visible {
      opacity: 0.75;
    }
  }

  .sns-other-menu {
    top: auto;
    bottom: calc(100% + 0.75rem);
  }

  .sns-other-menu-enter-from,
  .sns-other-menu-leave-to {
    transform: translate(-50%, 0.5rem);
  }
}
</style>
