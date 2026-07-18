<script setup lang="ts">
import type { SNSLink } from '~/types/sns'
const { url, iconName, iconSize, name, description } = defineProps<SNSLink>()
</script>

<template>
  <ExtLink :to="url" class="social-card">
    <div class="social-icon">
      <Icon :name="iconName" :size="iconSize" />
    </div>
    <div class="social-info">
      <h3 class="social-name">{{ name }}</h3>
      <p class="social-description">{{ description }}</p>
    </div>
    <div class="social-arrow">
      <Icon name="mdi:chevron-right" :size="28" />
    </div>
  </ExtLink>
</template>

<style>
.social-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-accent);
  transition: all 0.2s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    background: var(--color-accent);
  }

  &:active {
    transition-duration: 0.06s;
    transform: translateY(-2px);
  }
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: var(--color-accent);
}

.social-info {
  flex: 1;
  text-align: left;
}

.social-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--color-text);
}

.social-description {
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.7;
}

.social-arrow {
  display: flex;
  align-items: center;
  margin-left: auto;
  color: var(--color-text);
  opacity: 0.5;
}
</style>
