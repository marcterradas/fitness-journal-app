<template>
    <div>
        <h1 class="login__title">Login view</h1>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button @click="goToHome">Login</button>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToHome() {
  router.push('/')
}
</script>