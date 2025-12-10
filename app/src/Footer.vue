<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="footer">
    <nav class="footer__nav">
      <ul class="footer__list">
        <li class="footer__item">
          <RouterLink to="/" class="footer__link">
            <img src="/house.svg" alt="Home" width="20" height="20" />
          </RouterLink>
        </li>
        <li class="footer__item">
          <RouterLink to="/journal" class="footer__link">
            <img src="/book.svg" alt="Journal" width="20" height="20" />
          </RouterLink>
        </li>
        <li class="footer__item">
          <RouterLink to="/stats" class="footer__link">
            <img src="/chart.svg" alt="Stats" width="20" height="20" />
          </RouterLink>
        </li>
        <li class="footer__item">
          <RouterLink to="/social" class="footer__link">
            <img src="/users.svg" alt="Social" width="20" height="20" />
          </RouterLink>
        </li>
        <li class="footer__item">
          <RouterLink to="/profile" class="footer__link">
            <img src="/user.svg" alt="Profile" width="20" height="20" />
          </RouterLink>
        </li>
      </ul>
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
  list-style: none;
}

.footer__link {
  text-decoration: none;
  padding: 0.5rem;
}
</style>