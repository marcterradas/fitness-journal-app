<template>
    <div class="login-view">
        <SectionTitle>Login</SectionTitle>
        <Input type="text" placeholder="Username" />
        <Input type="password" placeholder="Password" />
        <Button @click="goToHome">Login</Button>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import SectionTitle from '@/components/SectionTitle.vue';
import Input from '@/components/Input.vue';
import Button from '@/components/Button.vue';

const router = useRouter()

function goToHome() {
  router.push('/')
}
</script>
<style scoped>
.login-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}
</style>