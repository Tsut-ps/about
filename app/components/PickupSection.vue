<template>
  <section class="pickup" @contextmenu.prevent @dragstart.prevent>
    <ExtLink class="pickup-link" to="https://github.com/Tsut-ps/EmoLabMaker-ae" aria-label="EmoLabMaker の GitHub ページを開く">
      <div class="pickup-card">
        <div class="pickup-visual">
          <img class="pickup-desktop" src="/banner/EmoLabMaker_L.webp" alt="EmoLabMaker 表情レイヤーを制御、口パクレイヤーを作成する、After Effectsスクリプト" width="700" height="400">
          <img class="pickup-desktop" src="/banner/EmoLabMaker_R.webp" alt="" width="480" height="400">
          <img class="pickup-mobile" src="/banner/EmoLabMaker_SP.webp" alt="EmoLabMaker 表情レイヤーを制御、口パクレイヤーを作成する、After Effectsスクリプト" width="600" height="400">
        </div>

        <div class="pickup-badges">
          <span class="pickup-badges-label">β版配布先</span>
          <div class="pickup-badges-list">
            <img class="pickup-badge" src="/logo/GitHub_Button.webp" alt="GitHub" width="128" height="32">
          </div>
        </div>
      </div>

      <img class="pickup-free-badge" src="/banner/Free_Badge.webp" alt="Free! 無料!" width="160" height="160">
    </ExtLink>
  </section>
</template>

<style scoped>
.pickup {
  position: relative;
  container-type: inline-size;
  width: 100%;
  margin-bottom: 4rem;
}

.pickup-link {
  position: relative;
  display: block;
  transition: transform 0.2s ease;

  &:focus-visible {
    transform: translateY(-4px);

    .pickup-visual {
      transform: scale(1.02);
    }
  }

  &:active {
    transition-duration: 0.06s;
    transform: translateY(-2px);

    .pickup-visual {
      transform: scale(1.02);
    }
  }

  @media (hover: hover) {
    &:hover:not(:active) {
      transform: translateY(-4px);

      .pickup-visual {
        transform: scale(1.02);
      }
    }
  }
}

.pickup-card {
  position: relative;
  width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: 16px;
  background: #1b1b1b;
}

.pickup-visual {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  transform-origin: center center;
  transition: transform 0.3s ease;
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

.pickup-badge {
  width: auto;
  height: 2.8rem;
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

  .pickup-badge {
    height: 2.2rem;
  }
}
</style>
