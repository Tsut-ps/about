<template>
  <section class="pickup" @contextmenu.prevent @dragstart.prevent>
    <div class="pickup-card">
      <img class="pickup-desktop" src="/banner/EmoLabMaker_L.webp" alt="EmoLabMaker 表情レイヤーを制御、口パクレイヤーを作成する、After Effectsスクリプト" width="700" height="400">
      <img class="pickup-desktop" src="/banner/EmoLabMaker_R.webp" alt="" width="480" height="400">
      <img class="pickup-mobile" src="/banner/EmoLabMaker_SP.webp" alt="EmoLabMaker 表情レイヤーを制御、口パクレイヤーを作成する、After Effectsスクリプト" width="600" height="400">

      <div class="pickup-badges">
        <span class="pickup-badges-label">β版配布先</span>
        <div class="pickup-badges-list">
          <ExtLink class="pickup-badge-link" to="https://github.com/Tsut-ps/EmoLabMaker-ae">
            <img src="/logo/GitHub_Button.webp" alt="GitHub" width="128" height="32">
          </ExtLink>
        </div>
      </div>
    </div>

    <img class="pickup-free-badge" src="/banner/Free_Badge.webp" alt="Free! 無料!" width="160" height="160">
  </section>
</template>

<style scoped>
.pickup {
  position: relative;
  container-type: inline-size;
  width: 100%;
  margin-bottom: 4rem;
}

.pickup-card {
  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: 16px;
  background: #1b1b1b;
}

.pickup-badges {
  position: absolute;
  right: 2rem;
  bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  color: #fff;
}

.pickup-badges-label {
  font-weight: 700;
}

.pickup-badges-list {
  display: flex;
  gap: 1.4rem;
}

.pickup-badge-link img {
  width: auto;
  height: 2.8rem;
}

.pickup-badge-link {
  display: flex;
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

.pickup-desktop {
  width: auto;
  height: min(400px, 32cqw);
}

.pickup-mobile {
  display: none;
  width: 100%;
  max-width: 600px;
  height: auto;
}

.pickup-free-badge {
  position: absolute;
  top: -2rem;
  right: 2rem;
  width: min(10rem, 14cqw);
  height: auto;
}

@container (max-width: 800px) {

  .pickup-desktop,
  .pickup-free-badge {
    display: none;
  }

  .pickup-mobile {
    display: block;
  }
}

@container (max-width: 400px) {
  .pickup-badges {
    gap: 0.5rem;
  }

  .pickup-badges-list {
    gap: 1.1rem;
  }

  .pickup-badge-link img {
    height: 2.2rem;
  }
}
</style>
