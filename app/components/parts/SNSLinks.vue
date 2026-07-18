<script setup lang="ts">
// フッターなど、目立たせたくない場所ではdimmedを指定する
const { dimmed } = defineProps<{
  dimmed?: boolean
}>()

const appConfig = useAppConfig()
const SNSLinks = appConfig.snsLinks.filter(link => !link.viewType)
const SNSOtherLinks = appConfig.snsLinks.filter(link => link.viewType === 'other')
const SNSOtherDetails = useTemplateRef<HTMLDetailsElement>('snsOtherDetails')

// 外側をクリックしたら閉じる
const closeSNSOtherLinks = (event: MouseEvent) => {
  const details = SNSOtherDetails.value
  const target = event.target

  if (details?.open && target instanceof Node && !details.contains(target)) {
    details.open = false
  }
}

onMounted(() => document.addEventListener('click', closeSNSOtherLinks))
onBeforeUnmount(() => document.removeEventListener('click', closeSNSOtherLinks))
</script>

<template>
  <div class="sns-links" :class="{ 'sns-links-dimmed': dimmed }">
    <a v-for="link in SNSLinks" :key="link.url" :href="link.url" target="_blank" rel="noopener noreferrer"
      class="sns-link" :title="link.name + ' / ' + link.description">
      <Icon :name="link.iconName" :size="link.iconSize" />
    </a>

    <details v-if="SNSOtherLinks.length" ref="snsOtherDetails" class="sns-other-links">
      <summary class="sns-other-summary" title="その他のリンク" aria-label="その他のリンク">
        <Icon name="mdi:dots-horizontal" :size="28" aria-hidden="true" />
      </summary>
      <div class="sns-other-menu">
        <a v-for="link in SNSOtherLinks" :key="link.url" :href="link.url" target="_blank" rel="noopener noreferrer"
          class="sns-other-link" :title="link.name + ' / ' + link.description">
          <Icon :name="link.iconName" :size="link.iconSize" />
          <span>{{ link.name }}</span>
        </a>
      </div>
    </details>
  </div>
</template>

<style scoped>
.sns-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.sns-link {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -0.5rem;
  padding: 0.5rem;
  color: var(--color-text);
  transition: all 0.2s ease;

  &:hover {
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

.sns-other-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  margin: -0.5rem;
  padding: 0.5rem;
  color: var(--color-text);
  cursor: pointer;
  opacity: 0.65;
  transition: opacity 0.2s ease;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover,
  .sns-other-links[open] & {
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

.sns-other-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--color-accent);
  }
}

.sns-links-dimmed {
  .sns-link {
    opacity: 0.5;

    &:hover {
      opacity: .75;
    }
  }

  .sns-other-menu {
    top: auto;
    bottom: calc(100% + 0.75rem);
  }
}
</style>
