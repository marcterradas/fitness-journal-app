<template>
    <button class="button" @click="$emit('click')">
        <slot></slot>
    </button>
</template>

<style lang="css" scoped>
.button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: #fff;
    color: #000;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}
.button:hover {
    background-color: #eee;
}
</style>