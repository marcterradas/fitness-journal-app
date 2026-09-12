<script setup>
import { computed } from 'vue'
import { currentUser } from '@/mock/user'

// Anywhere a person's name or @handle is shown, this makes it open their profile.
const props = defineProps({
  // a user object carrying `username`, or the handle itself ('ava_fit' / '@ava_fit')
  user: { type: [Object, String], required: true },
})

const handle = computed(() =>
  (typeof props.user === 'string' ? props.user : props.user?.username || '').replace(/^@/, '')
)
// My own handle goes to the editable profile, not the read-only athlete view.
const to = computed(() => (handle.value === currentUser.username ? '/profile' : `/u/${handle.value}`))
</script>

<template>
  <!-- Mock people without a handle (notifications, chats) render as plain text -->
  <router-link v-if="handle" :to="to" class="ulink" @click.stop><slot>@{{ handle }}</slot></router-link>
  <span v-else class="ulink"><slot /></span>
</template>

<style scoped>
.ulink { color: inherit; text-decoration: none; }
a.ulink:hover { text-decoration: underline; }
</style>
