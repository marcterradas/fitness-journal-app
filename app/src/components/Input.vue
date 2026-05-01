<script setup>
const props = defineProps({
  id: { type: String, default: '' },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  label: { type: String, default: '' },
})
const emits = defineEmits(['update:modelValue'])

const modelValue = defineModel({
  get() { return props.modelValue },
  set(value) { emits('update:modelValue', value) },
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
  gap: var(--space-1);
  width: 100%;
}

.form-input__label {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
}

.form-input__field {
  font-size: var(--fs-md);
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--t-fast) var(--ease), box-shadow var(--t-fast) var(--ease);
  caret-color: var(--color-accent);
  outline: none;
}

.form-input__field::placeholder {
  color: var(--color-text-dim);
}

.form-input__field:focus {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-glow);
}

.form-input__field[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
