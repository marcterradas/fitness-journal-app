<script setup>
const props = defineProps({
    id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'text'
    },
    placeholder: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
})
const emits = defineEmits(['update:modelValue'])

const modelValue = defineModel({
    get() {
        return props.modelValue
    },
    set(value) {
        emits('update:modelValue', value)
    }
})
</script>

<template>
    <div class="input-container">
        <label v-if="label" :for="id" class="input-label">{{ label }}</label>
        <input
            :id="id"
            :type="type"
            :placeholder="placeholder"
            v-model="modelValue"
            class="input-field"
        />
    </div>
</template>

<style scoped>
.input-container {
    display: flex;
    flex-direction: column;
}

.input-field {
    font-size: 1rem;
    padding: 0.5rem 1rem;
}
</style>