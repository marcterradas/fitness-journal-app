<template>
    <div class="profile">
        <SectionTitle>Profile</SectionTitle>
        <UserProfile 
            name="Marc"
            username="marc_fitness"
            avatarUrl="https://i.pravatar.cc/300?u=marc"
            :workoutCount="42"
            :followerCount="128"
            :followingCount="85"
        />
    </div>
</template>

<script setup>
import SectionTitle from '@/components/SectionTitle.vue';
import UserProfile from '@/components/UserProfile.vue';
</script>

<style scoped>
</style>