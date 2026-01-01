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
    <div class="form-input">
        <label v-if="label" :for="id" class="form-input__label">{{ label }}</label>
        <input
            :id="id"
            :type="type"
            :placeholder="placeholder"
            v-model="modelValue"
            class="form-input__field"
        />
    </div>
</template>

<style scoped>
.form-input {
    display: flex;
    flex-direction: column;
}

.form-input__field {
    font-size: 1rem;
    padding: 0.5rem 1rem;
}
</style>