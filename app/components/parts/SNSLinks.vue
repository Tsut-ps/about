<script setup lang="ts">
// フッターなど、目立たせたくない場所ではdimmedを指定する
const { dimmed } = defineProps<{
  dimmed?: boolean
}>()

const appConfig = useAppConfig()
const SNSLinks = appConfig.snsLinks.filter(link => !link.viewType)
</script>

<template>
  <div class="sns-links" :class="{ 'sns-links-dimmed': dimmed }">
    <a v-for="link in SNSLinks" :key="link.url" :href="link.url" target="_blank" class="sns-link"
      :title="link.name + ' / ' + link.description">
      <Icon :name="link.iconName" :size="link.iconSize" />
    </a>
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

.sns-links-dimmed .sns-link {
  opacity: 0.5;

  &:hover {
    opacity: .75;
  }
}
</style>
