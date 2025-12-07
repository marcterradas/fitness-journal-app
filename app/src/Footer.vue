<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer>
    <nav>
      <ul>
        <li>
          <RouterLink to="/">Home</RouterLink>
        </li>
        <li>
          <RouterLink to="/journal">Journal</RouterLink>
        </li>
        <li>
          <RouterLink to="/stats">Stats</RouterLink>
        </li>
        <li>
          <RouterLink to="/social">Social</RouterLink>
        </li>
        <li>
          <RouterLink to="/profile">Profile</RouterLink>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<style scoped>
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--pico-background-color);
  border-top: 1px solid var(--pico-muted-border-color);
  padding: 0.5rem 1rem;
  z-index: 99;
}

nav ul {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 0;
  padding: 0;
}

nav li {
  list-style: none;
  padding: 0;
}
</style>