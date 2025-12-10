f<template>
  <header class="navbar">
      <button class="navbar__icon-button" aria-label="Messages" title="Messages" type="button">
        <img class="navbar__icon" src="/message.svg" alt="Messages" width="20" height="20" />
      </button>

      <button class="navbar__icon-button" aria-label="Notifications" title="Notifications" type="button">
        <img class="navbar__icon" src="/bell.svg" alt="Notifications" width="20" height="20" />
      </button>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 1px solid var(--pico-muted-border-color);
}

.navbar__brand {
   text-decoration: none;
}

.navbar__icon-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

.navbar__icon {
  display: block;
}
</style>