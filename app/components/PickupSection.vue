<template>
  <section class="pickup" @contextmenu.prevent @dragstart.prevent>
    <div class="pickup-card">
      <NuxtPicture class="pickup-desktop" src="/banner/EmoLabMaker_L.png" alt="" width="700" height="400"
        sizes="700px" />
      <NuxtPicture class="pickup-desktop" src="/banner/EmoLabMaker_R.png" alt="" width="480" height="400"
        sizes="480px" />
      <NuxtPicture class="pickup-mobile" src="/banner/EmoLabMaker_S.png" alt="" width="600" height="400"
        sizes="600px" />

      <div class="pickup-badges">
        <span class="pickup-badges-label">↙ β版配布先</span>
        <div class="pickup-badges-list">
          <ExtLink class="pickup-badge-link" to="https://github.com/Tsut-ps/EmoLabMaker-ae">
            <NuxtPicture src="/logo/GitHub_Button.png" alt="GitHub" width="128" height="32" sizes="128px" />
          </ExtLink>
        </div>
      </div>
    </div>
    <NuxtPicture class="pickup-free-badge" src="/banner/Free_Badge.png" alt="Free! 無料!" width="160" height="160"
      sizes="160px" />
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

.pickup :deep(img) {
  display: block;
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

.pickup-badges-list :deep(img) {
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
  display: contents;
}

.pickup-desktop :deep(img) {
  width: auto;
  height: min(400px, 32cqw);
}

.pickup-mobile {
  display: none;
}

.pickup-mobile :deep(img),
.pickup-free-badge :deep(img) {
  width: 100%;
  height: auto;
}

.pickup-mobile :deep(img) {
  max-width: 600px;
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
    display: contents;
  }
}

@container (max-width: 400px) {
  .pickup-badges {
    gap: 0.5rem;
  }

  .pickup-badges-list {
    gap: 1.1rem;
  }

  .pickup-badges-list :deep(img) {
    height: 2.2rem;
  }
}
</style>
