<script setup lang="ts">
// フッターなど、目立たせたくない場所ではdimmedを指定する
const { dimmed } = defineProps<{
  dimmed?: boolean
}>()

const appConfig = useAppConfig()
const SNSLinks = appConfig.snsLinks.filter(link => !link.viewType)
const SNSOtherLinks = appConfig.snsLinks.filter(link => link.viewType === 'other')
const SNSOtherContainer = useTemplateRef<HTMLDivElement>('snsOtherContainer')
const isSNSOtherOpen = ref(false)

const closeSNSOtherLinks = () => isSNSOtherOpen.value = false
const toggleSNSOtherLinks = () => isSNSOtherOpen.value = !isSNSOtherOpen.value

// 外側をクリックしたら閉じる
const handleClickOutside = (event: MouseEvent) => {
  const container = SNSOtherContainer.value
  const target = event.target

  if (target instanceof Node && !container?.contains(target)) closeSNSOtherLinks()
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="sns-links" :class="{ 'sns-links-dimmed': dimmed }">
    <a v-for="link in SNSLinks" :key="link.url" :href="link.url" target="_blank" rel="noopener noreferrer"
      class="sns-link" :title="link.name + ' / ' + link.description">
      <Icon :name="link.iconName" :size="link.iconSize" />
    </a>

    <div v-if="SNSOtherLinks.length" ref="snsOtherContainer" class="sns-other-links">
      <button type="button" class="sns-other-summary" title="その他のリンク" aria-label="その他のリンク"
        :aria-expanded="isSNSOtherOpen" @click="toggleSNSOtherLinks">
        <Icon name="mdi:dots-horizontal" :size="28" aria-hidden="true" />
      </button>
      <Transition name="sns-other-menu">
        <div v-if="isSNSOtherOpen" class="sns-other-menu">
          <a v-for="link in SNSOtherLinks" :key="link.url" :href="link.url" target="_blank" rel="noopener noreferrer"
            class="sns-other-link" :title="link.name + ' / ' + link.description">
            <Icon :name="link.iconName" :size="link.iconSize" />
            <span>{{ link.name }}</span>
          </a>
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
  margin: -0.5rem;
  padding: 0.5rem;
  border: none;
  background: none;
  color: var(--color-text);
  cursor: pointer;
  opacity: 0.65;
  transition: all 0.2s ease;

  &:hover {
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

  .sns-other-menu-enter-from,
  .sns-other-menu-leave-to {
    transform: translate(-50%, 0.5rem);
  }
}
</style>
