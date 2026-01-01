<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToHome() {
  router.push('/')
}

function goToSearch() {
  router.push('/search')
}

function goToJournal() {
  router.push('/journal')
}

function goToProfile() {
  router.push('/profile')
}
</script>

<template>
  <footer class="footer">
    <nav class="footer__nav">
      <div class="footer__list">
        <button class="footer__item" @click="goToHome">
            <img src="/house.svg" alt="Home" width="20" height="20" />
        </button>
        <button class="footer__item" @click="goToSearch">
            <img src="/search.svg" alt="Search" width="20" height="20" />
        </button>
        <button class="footer__item" @click="goToJournal">
            <img src="/book.svg" alt="Journal" width="20" height="20" />
        </button>
        <button class="footer__item" @click="goToProfile">
            <img src="/user.svg" alt="Profile" width="20" height="20" />
        </button>
      </div>
    </nav>
  </footer>
</template>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--pico-background-color);
  border-top: 1px solid var(--pico-muted-border-color);
  padding: 0.5rem 1rem;
}

.footer__list {
  display: flex;
  justify-content: space-around;
  margin: 0;
  padding: 0;
  width: 100%;
}

.footer__item {
  background: none;
  border: none;
  cursor: pointer;
}

.footer__link {
  text-decoration: none;
  padding: 0.5rem;
}
</style>