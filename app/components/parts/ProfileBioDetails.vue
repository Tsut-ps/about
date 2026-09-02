<script setup lang="ts">
import { profile } from '~/data/profile'

defineProps<{
  visible: boolean
}>()

const voicesVisible = ref(false)
</script>

<template>
  <Transition name="fade">
    <aside v-if="visible" id="bio-details" class="profile-bio-details" aria-labelledby="bio-details-title">
      <h2 id="bio-details-title" class="profile-bio-details-heading">About</h2>
      <p>おはよ<span class="secondary-text">朝昼晩深夜ぜんぶのあいさつにしている</span></p>

      <section class="tip-section">
        <h3>Info</h3>
        <dl class="detail-list">
          <div v-for="item in profile.info" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.values.join('\u3000') }}</dd>
          </div>
        </dl>
      </section>

      <section class="tip-section">
        <button v-if="!voicesVisible" class="show-voices-button" type="button" aria-label="音声合成キャラクターを表示"
          @click="voicesVisible = true">▼</button>
        <template v-else>
          <h3>いる</h3>
          <ul class="voice-list">
            <li v-for="voice in profile.voices" :key="voice.name">
              <span>{{ voice.name }}</span>
              <span class="secondary-text">{{ voice.tools }}</span>
            </li>
          </ul>
        </template>
      </section>
    </aside>
  </Transition>
</template>

<style scoped>
.profile-bio-details {
  position: absolute;
  top: 190px;
  /* プロフィールの最大幅600pxの右端から24px空ける。 */
  left: calc(50% + 324px);
  z-index: 5;
  /* 画面右端に32pxを残し、広い画面でも読み幅を520pxに抑える。 */
  width: min(520px, calc(50vw - 356px));
  text-align: left;
  opacity: .7;
  transition: opacity 200ms ease;

  @media (max-width: 1500px) {
    display: none;
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.tip-section {
  margin-top: 2rem;

  h3 {
    margin: 0 0 .75rem;
    font-size: 1.1rem;
  }
}

.show-voices-button {
  display: block;
  width: 2rem;
  height: 2rem;
  padding: 0;
  margin: 0 auto;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
  opacity: .25;
  transform: translate(-32px, -8px);
}

.profile-bio-details-heading {
  margin: 0 0 1.5rem;
  font-family: 'Caveat', cursive;
  font-size: 3rem;
  font-weight: 500;
  opacity: .18;
}

.detail-list {
  margin: 0;

  >div {
    display: grid;
    grid-template-columns: 5.5rem minmax(0, 1fr);
    gap: .75rem;
    margin-top: .5rem;
  }

  dd {
    margin: 0;
    line-height: 1.6;
  }
}

.voice-list {
  display: flex;
  flex-wrap: wrap;
  gap: .35rem 1rem;
  padding: 0;
  margin: .75rem 0 0;
  list-style: none;
  line-height: 1.5;

  li {
    white-space: nowrap;
  }
}

.secondary-text {
  font-size: .8rem;
  margin-left: .5rem;
  opacity: .6;
}
</style>
