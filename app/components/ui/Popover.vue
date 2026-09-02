<script setup lang="ts">
const {
  label,
  placement = 'bottom',
  triggerVariant = 'text',
} = defineProps<{
  label: string
  placement?: 'top' | 'bottom'
  triggerVariant?: 'icon' | 'text'
}>()

const container = useTemplateRef<HTMLDivElement>('container')
const panelId = useId()
const isOpen = ref(false)

function handleClickOutside(event: MouseEvent) {
  const target = event.target
  if (target instanceof Node && !container.value?.contains(target)) isOpen.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div ref="container" class="popover">
    <button type="button" class="popover-trigger" :class="`popover-trigger-${triggerVariant}`"
      :title="triggerVariant === 'icon' ? label : undefined" :aria-label="label" :aria-controls="panelId"
      :aria-expanded="isOpen" @click="isOpen = !isOpen">
      <slot name="trigger" />
    </button>

    <Transition name="popover-panel">
      <div v-if="isOpen" :id="panelId" class="popover-panel" :class="`popover-panel-${placement}`" role="group"
        :aria-label="label">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.popover {
  position: relative;
  display: inline-flex;
}

.popover-trigger {
  border: 0;
  background: none;
  color: var(--color-text);
  font: inherit;
  cursor: pointer;
}

.popover-trigger-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -0.5rem;
  padding: 0.5rem;
  opacity: 0.65;
  transition: opacity 0.2s ease, transform 0.2s ease;

  &:hover,
  &:focus-visible,
  &[aria-expanded='true'] {
    opacity: 1;
  }

  &:active {
    transition-duration: 0.06s;
    transform: translateY(2px);
  }
}

.popover-trigger-text {
  padding: 0;
  opacity: 0.35;
  transition: opacity 0.2s ease;

  &:hover,
  &:focus-visible,
  &[aria-expanded='true'] {
    opacity: 0.7;
  }
}

.popover-panel {
  position: absolute;
  left: 50%;
  z-index: 20;
  width: calc(100vw - 1rem);
  max-width: max-content;
  padding: 0.5rem;
  border: 1px solid var(--color-accent);
  border-radius: 8px;
  background: var(--color-bg);
  box-shadow: 0 8px 16px rgb(0 0 0 / 20%);
  transform: translateX(-50%);
  translate: var(--popover-panel-offset-x, 0);
}

.popover-panel-top {
  bottom: calc(100% + 0.75rem);

  &.popover-panel-enter-from,
  &.popover-panel-leave-to {
    opacity: 0;
    transform: translate(-50%, 0.5rem);
  }
}

.popover-panel-bottom {
  top: calc(100% + 0.75rem);

  &.popover-panel-enter-from,
  &.popover-panel-leave-to {
    opacity: 0;
    transform: translate(-50%, -0.5rem);
  }
}

.popover-panel-enter-active,
.popover-panel-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
</style>
