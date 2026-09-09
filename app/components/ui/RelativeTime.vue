<script setup lang="ts">
const { datetime } = defineProps<{ datetime: string | Date }>()

const absoluteDate = computed(() => new Date(datetime).toLocaleDateString('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Tokyo',
}))
</script>

<template>
  <NuxtTime :datetime="datetime" relative locale="ja-JP" :title="absoluteDate" />
</template>
