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
    display: flex;
    flex-direction: column;
    align-items: center;
}

.login__title {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.login__input {
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.login__button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.login__button:hover {
    background-color: #0056b3;
}
</style>