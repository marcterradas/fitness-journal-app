<script setup>
const props = defineProps({
    id: {
        type: String,
        required: false,
        default: ''
    },
    modelValue: {
        type: [String, Number],
        default: ''
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
    width: 100%;
}

.form-input__label {
    color: #bdbdbd;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
}

.form-input__field {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    background-color: #111214; /* dark surface */
    color: #e9eef8; /* light text */
    border: 1px solid #2b2b2b;
    border-radius: 8px;
    transition: border-color 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease;
    caret-color: #90caf9;
}

.form-input__field::placeholder {
    color: #7a7a7a;
    opacity: 1;
}

.form-input__field:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 4px rgba(25, 118, 210, 0.12);
    background-color: #0f1113;
}

.form-input__field[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>