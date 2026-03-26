<script setup lang="ts">
import type { SNSLink } from '~/types/sns'
const { url, iconName, iconSize, name, description } = defineProps<SNSLink>()
</script>

<template>
  <a :href="url" target="_blank" class="social-aka-card">
    <Icon :name="iconName" :size="iconSize / 28 * 24" />
    <h3 class="social-aka-name">{{ name }}<span class="social-aka-description">({{ description }})</span></h3>
    <Icon name="mdi:arrow-right" :size="24" />
  </a>
</template>

<style>
.social-aka-card {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: .5rem;
  transition: all 0.2s ease;
  opacity: 0.5;

  &:hover {
    transform: translateY(-4px);
  }
}

.social-aka-name {
  font-size: .8rem;
  font-weight: 600;
  margin: 0 0 0.15rem 0;
  color: var(--color-text);
}

.social-aka-description {
  font-size: .8rem;
  margin: 0 0 0 0.5rem;
  opacity: 0.7;
}
</style>