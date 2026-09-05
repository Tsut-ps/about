<script setup lang="ts">
const { data: activities } = await useFetch('/api/activities')

interface ActivitySectionBase {
  key: string
  title: string
  englishLabel: string
  platforms: string[]
}

type ActivitySection = ActivitySectionBase & (
  | { rows: number, textOnly?: false }
  | { itemLimit: number, textOnly: true }
)

const sections: ActivitySection[] = [
  {
    key: 'video',
    title: '音声合成動画',
    englishLabel: '-Software Singer & Talking-',
    platforms: ['youtube', 'nicovideo'],
    rows: 2,
  },
  {
    key: 'shorts',
    title: 'ショート',
    englishLabel: '#Shorts',
    platforms: ['youtube-shorts', 'nicovideo-shorts'],
    rows: 1,
  },
  {
    key: 'diary',
    title: '日記',
    englishLabel: '-Diary-',
    platforms: ['blog'],
    rows: 1,
  },
  {
    key: 'notes',
    title: '書き散らし',
    englishLabel: '-Notes-',
    platforms: ['scrapbox', 'note'],
    itemLimit: 6,
    textOnly: true,
  },
  {
    key: 'dev',
    title: '開発',
    englishLabel: '-Development-',
    platforms: ['github'],
    rows: 2,
  },
]

// 横動画版がある場合は、ショートではなく動画側にまとめて表示する
const horizontalVideoPlatforms = new Set(['youtube', 'nicovideo'])

// activities.valueを自動追跡 (0件のセクションは非表示にする)
const sectionItems = computed(() => {
  // useFetchはDateをstringにシリアライズするため、素の取得値の型を推論する
  type Item = NonNullable<typeof activities.value>[number]

  const data = activities.value
  if (!data) return [] as (ActivitySection & { items: Item[], minItems: number })[]

  return sections.map((section) => {
    const maxItems = section.textOnly ? section.itemLimit : section.rows * (section.key === 'shorts' ? 5 : 4)
    const minItems = section.textOnly ? maxItems : maxItems - section.rows

    const items = data.filter((item) => {
      // 現在のフィルター対象プラットフォームを持つ活動だけ表示候補にする
      const matches = item.links.some(link => section.platforms.includes(link.platform))
      if (!matches) return false

      // 開発カードはサムネイルを取得できた活動だけ表示する
      if (section.key === 'dev' && !item.links.some(link => link.thumbnail)) return false

      // ショートセクションで、横動画版リンクも持つ場合は動画側だけに表示
      if (section.key === 'shorts' && item.links.some(link => horizontalVideoPlatforms.has(link.platform))) {
        return false
      }

      return true
    }).slice(0, maxItems)

    return { ...section, minItems, items }
  }).filter(section => section.items.length > 0)
})

let dragged = false
const dragX = { start: 0, previous: 0 }

function startGridDrag(event: PointerEvent) {
  dragged = false
  if (event.pointerType !== 'mouse' || event.button !== 0) return

  const grid = event.currentTarget as HTMLElement
  // 横スクロール不要なPC表示などでは、通常のクリックやホバーにドラッグ処理が干渉しないようにする
  if (grid.scrollWidth <= grid.clientWidth) return

  // クリック対象を変えず、グリッド外でもドラッグを継続できるようにする
  const target = event.target as Element
  target.setPointerCapture(event.pointerId)
  dragX.start = dragX.previous = event.clientX
}

function moveGridDrag(event: PointerEvent) {
  const grid = event.currentTarget as HTMLElement
  const target = event.target as Element
  // ホバーや別の場所から始まった操作でスクロールしないよう、捕捉中のマウスの左ドラッグだけに限定する
  if (event.pointerType !== 'mouse' || event.buttons !== 1 || !target.hasPointerCapture(event.pointerId)) return

  // 小さな手ぶれでリンクのクリックを無効にしないよう、5pxまではクリックとして扱う
  dragged ||= Math.abs(event.clientX - dragX.start) > 5
  if (!dragged) return

  event.preventDefault()
  // movementXは環境によって単位が異なるため、CSSピクセル基準のclientXから移動量を求める
  grid.scrollLeft -= event.clientX - dragX.previous
  dragX.previous = event.clientX
}
</script>

<template>
  <section class="activities">
    <PartsSectionNav :sections="sectionItems" />

    <div class="activities-content">

      <!-- アクティビティヘッダー -->
      <div class="activities-title-wrap">
        <h2 class="activities-title">New!</h2>
        <div class="scroll-hint">
          <Icon name="mdi:chevron-down" :size="24" />
        </div>
      </div>

      <!-- アクティビティ -->
      <div v-for="(section, index) in sectionItems" :id="section.key" :key="section.key" class="activity-section"
        :class="{ 'activity-section-alt': index % 2 === 0 }">
        <h3 class="section-title">
          <span class="section-title-ja">{{ section.title }}</span>
          <span class="section-title-en">{{ section.englishLabel }}</span>
        </h3>

        <ul v-if="section.textOnly" class="activity-list">
          <li v-for="item in section.items" :key="item.id">
            <UiActivityTimelineItem :item="item" />
          </li>
        </ul>

        <div v-else class="activity-grid" :class="{ 'activity-grid-shorts': section.key === 'shorts' }"
          @pointerdown="startGridDrag" @pointermove="moveGridDrag" @pointercancel="dragged = false"
          @click.capture="dragged && $event.detail > 0 && ($event.preventDefault(), dragged = false)"
          @dragstart.prevent>
          <div v-for="(item, itemIndex) in section.items" :key="item.id" class="activity-card"
            :class="{ 'activity-card-wide': itemIndex >= section.minItems }">
            <UiActivityCard :item="item" :prefer-short="section.key === 'shorts'"
              :hide-platform-icons="section.key === 'diary'" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.activities {
  position: relative;
  margin: 1rem 0 6rem;
}

.activities-content {
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 1900px) {
    max-width: 1600px;
  }
}

.activities-title-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  margin: 0 auto;
  padding: 0 1rem;
}

.activities-title {
  font-size: 3rem;
  margin: 0 0 1.5rem;
  padding-inline: 0.3em;
  opacity: 0.9;
  font-weight: 500;
  font-family: 'Caveat', cursive;
}

.scroll-hint {
  margin: 0 0 3rem;
  opacity: 0.5;
  animation: scrollBounce 1.6s ease-in-out infinite;
}

@keyframes scrollBounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(8px);
  }
}

.activity-section {
  position: relative;
  padding: 4rem 1rem;
  animation: fadeIn 0.4s ease forwards;
}

/* コンテンツ幅の制約を超えて、画面幅いっぱいに帯として背景を広げる。
   box-shadowのvmax spread + clip-pathは境界に継ぎ目が出ることがあるため、
   疑似要素をvw基準で画面幅いっぱいに広げる方式にする */
.activity-section-alt::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 100vw;
  transform: translateX(-50%);
  background: var(--color-accent);
  opacity: 0.3;
  z-index: -1;
}

.section-title {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.3rem 0.6rem;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 3rem;
  opacity: 0.85;
}

.section-title-en {
  font-size: 1.6rem;
  font-weight: 400;
  opacity: 0.2;
  font-family: 'Caveat', cursive;
  white-space: nowrap;
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 2rem;
  row-gap: 3rem;

  @media (min-width: 1900px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 800px) {
    grid-template-columns: none;
    grid-auto-flow: column;
    grid-auto-columns: min(78vw, 320px);
    gap: 1rem;
    margin-inline: -1rem;
    padding: 0.25rem 1rem 1rem;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @media (pointer: fine) {
      cursor: grab;

      &:active {
        cursor: grabbing;
        user-select: none;
      }

      .activity-card,
      :deep(a) {
        cursor: inherit;
      }
    }
  }
}

.activity-grid-shorts {
  grid-template-columns: repeat(4, 1fr);

  @media (min-width: 1900px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: 800px) {
    grid-template-columns: none;
    grid-auto-columns: min(48vw, 220px);
  }
}

.activity-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease;

  &.activity-card-wide {
    display: none;

    @media (max-width: 800px), (min-width: 1900px) {
      display: flex;
    }
  }

  &:has(:focus-visible) {
    transform: translateY(-4px);

    /* クリップ範囲(card-thumbnailのoverflow: hidden)は保ったまま、画像だけ拡大する */
    & :deep(.card-thumbnail img) {
      transform: scale(1.04);
    }
  }

  &:active {
    transition-duration: 0.06s;
    transform: translateY(-2px);

    & :deep(.card-thumbnail img) {
      transform: scale(1.04);
    }
  }

  /* タッチ端末でhover状態を残さないよう、hover可能な端末だけに限定する */
  @media (hover: hover) {
    &:hover:not(:active) {
      transform: translateY(-4px);

      & :deep(.card-thumbnail img) {
        transform: scale(1.04);
      }
    }
  }
}

.activity-list {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;

  /* タイムライン表示の連結線 */
  &::before {
    content: '';
    position: absolute;
    top: 1.75rem;
    bottom: 1.75rem;
    left: 1rem;
    width: 1px;
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(-50%);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
