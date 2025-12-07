<template>
    <div class="login">
        <h1 class="login__title">Login view</h1>
        <input type="text" class="login__input" placeholder="Username" />
        <input type="password" class="login__input" placeholder="Password" />
        <button class="login__button" @click="goToHome">Login</button>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToHome() {
  router.push('/')
}
</script>
<style scoped>
.login {
    padding: 2rem;
}
</style>