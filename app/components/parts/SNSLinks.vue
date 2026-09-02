<script setup lang="ts">
import { snsIconLinks, snsOtherLinks } from '~/data/sns-links'

// フッターなど、目立たせたくない場所ではdimmedを指定する
const { dimmed } = defineProps<{
  dimmed?: boolean
}>()
</script>

<template>
  <div class="sns-links" :class="{ 'sns-links-dimmed': dimmed }">
    <ExtLink v-for="link in snsIconLinks" :key="link.url" :to="link.url" class="sns-link"
      :title="link.name + ' / ' + link.description">
      <Icon :name="link.iconName" :size="link.iconSize" />
    </ExtLink>

    <UiPopover v-if="snsOtherLinks.length" class="sns-other-popover" label="その他のリンク"
      :placement="dimmed ? 'top' : 'bottom'" trigger-variant="icon">
      <template #trigger>
        <Icon name="mdi:dots-horizontal" :size="28" aria-hidden="true" />
      </template>
      <ExtLink v-for="link in snsOtherLinks" :key="link.url" :to="link.url" class="sns-other-link"
        :title="link.name + ' / ' + link.description">
        <Icon :name="link.iconName" :size="link.iconSize" />
        <span>{{ link.name }}</span>
      </ExtLink>
    </UiPopover>
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
}

@media (max-width: 420px) {
  .sns-other-popover {
    --popover-panel-offset-x: -3rem;
  }
}
</style>
