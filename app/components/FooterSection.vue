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
      <ExtLink to="https://github.com/Tsut-ps/about">GitHub</ExtLink> ({{ buildDate }})
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
