<script setup lang="ts">
import { profile } from '~/data/profile'

const { buildDate } = useAppConfig()
const copiedContact = ref<string | null>(null)

let copyResetTimer: ReturnType<typeof setTimeout> | undefined

async function copyContact(value: string) {
  await navigator.clipboard.writeText(value)
  copiedContact.value = value

  clearTimeout(copyResetTimer)
  copyResetTimer = setTimeout(() => copiedContact.value = null, 2000)
}

onBeforeUnmount(() => clearTimeout(copyResetTimer))
</script>

<template>
  <footer class="footer-section">
    <PartsSNSLinks dimmed class="footer-sns" />

    <div class="footer-menu">
      <ExtLink class="footer-menu-link" to="https://note.com/tsutps/n/nf56ab5c50060">二次創作ガイドライン</ExtLink>
      <UiPopover class="legal-popover" label="サイトポリシー" placement="top" trigger-variant="text">
        <template #trigger>サイトポリシー</template>
        <div class="legal-content">
          <h2>YouTube API サービスの利用</h2>
          <p>
            本サイトは、公開動画の表示にYouTube API サービスを利用していますが、本APIを通じて閲覧者情報を取得・利用しません。
            本APIにおける情報の取扱いは、
            <ExtLink to="https://policies.google.com/privacy">Googleプライバシーポリシー</ExtLink>
            をご確認ください。本サイトの利用により、
            <ExtLink to="https://www.youtube.com/t/terms">YouTube利用規約</ExtLink>
            に同意したものとみなされます。
          </p>
        </div>
      </UiPopover>
      <UiPopover class="contact-popover" label="連絡先" placement="top" trigger-variant="text">
        <template #trigger>連絡先</template>
        <div class="contact-content">
          <dl class="contact-list">
            <div v-for="contact in profile.contacts" :key="contact.label">
              <dt>{{ contact.label }}</dt>
              <dd>
                <ExtLink v-if="'url' in contact" :to="contact.url">{{ contact.value }}</ExtLink>
                <button v-else type="button" class="contact-copy" :aria-label="`${contact.label}をコピー`"
                  @click="copyContact(contact.value)">
                  {{ contact.value }}
                  <Icon :name="copiedContact === contact.value ? 'mdi:check' : 'mdi:content-copy'" size="14"
                    class="contact-copy-icon" aria-hidden="true" />
                </button>
              </dd>
            </div>
          </dl>
          <p class="contact-note">{{ profile.contactNote }}</p>
        </div>
      </UiPopover>
    </div>

    <p class="footer-copyright">© Tsut-ps. Deployed with
      <ExtLink to="https://github.com/Tsut-ps/about">GitHub</ExtLink> (<UiRelativeTime :datetime="buildDate" />)
    </p>
  </footer>
</template>

<style scoped>
.footer-section {
  padding: 3rem 1rem;
  color: var(--color-text);
  text-align: center;
}

.footer-menu {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

@media (max-width: 480px) {
  .legal-popover,
  .contact-popover {
    position: static;
  }
}

.footer-menu-link {
  opacity: 0.35;
  transition: opacity 0.2s ease;

  &:hover,
  &:focus-visible {
    opacity: 0.7;
  }
}

.contact-content {
  padding: 0.5rem;
  text-align: left;
}

.legal-content {
  width: min(30rem, calc(100vw - 3rem));
  padding: 0.5rem;
  text-align: left;

  h2 {
    margin: 0 0 0.5rem;
    font-size: 1rem;

    &:not(:first-child) {
      margin-top: 1.25rem;
    }
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.7;

    +p {
      margin-top: 0.75rem;
    }
  }

  a {
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
}

.contact-list {
  margin: 0;

  >div {
    display: grid;
    grid-template-columns: 5.5rem auto;
    gap: 0.75rem;

    +div {
      margin-top: 0.5rem;
    }
  }

  dd {
    margin: 0;
  }
}

.contact-note {
  margin: 1rem 0 0;
  font-size: 0.8rem;
  opacity: 0.6;
}

.contact-copy {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    opacity: 0.7;
  }
}

.contact-copy-icon {
  transform: translateY(1px);
}

.footer-copyright {
  font-size: 0.85rem;
  opacity: 0.35;
}

.footer-sns {
  margin-bottom: 1.5rem;
}
</style>
