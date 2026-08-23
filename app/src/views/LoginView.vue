<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import { validateAuth } from '@/authRules'

const router = useRouter()

// ponytail: mode ref instead of /login /signup /forgot routes. Split into routes
// when these screens need deep links or per-screen guards.
const mode = ref('login')
const form = reactive({ name: '', email: '', password: '', confirm: '' })
const errors = reactive({ name: '', email: '', password: '', confirm: '' })
const sent = ref(false)

const copy = {
  login: { title: 'Welcome back', subtitle: 'Log in to keep your streak alive.', submit: 'Log in' },
  signup: { title: 'Create account', subtitle: 'Start tracking your training today.', submit: 'Sign up' },
  forgot: { title: 'Reset password', subtitle: "We'll email you a reset link.", submit: 'Send reset link' },
}
const current = computed(() => copy[mode.value])

function setMode(next) {
  mode.value = next
  sent.value = false
  Object.keys(errors).forEach((k) => (errors[k] = ''))
}

function validate() {
  const next = validateAuth(mode.value, form)
  Object.keys(errors).forEach((k) => (errors[k] = next[k] || ''))
  return Object.keys(next).length === 0
}

// ponytail: no API yet. Swap the branch bodies for auth calls when the backend lands.
function submit() {
  if (!validate()) return
  if (mode.value === 'forgot') sent.value = true
  else router.push('/')
}

function social() {
  router.push('/')
}
</script>

<template>
  <div class="auth">
    <header class="auth__head">
      <h1 class="auth__title">{{ current.title }}</h1>
      <p class="auth__subtitle">{{ current.subtitle }}</p>
    </header>

    <p v-if="sent" class="auth__notice" role="status">
      If an account exists for <strong>{{ form.email }}</strong>, a reset link is on its way.
    </p>

    <form v-else class="auth__form" novalidate @submit.prevent="submit">
      <Input
        v-if="mode === 'signup'"
        id="auth-name"
        v-model="form.name"
        label="Name"
        placeholder="Alex Ryder"
        autocomplete="name"
        :error="errors.name"
      />

      <Input
        id="auth-email"
        v-model="form.email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autocomplete="email"
        :error="errors.email"
      />

      <Input
        v-if="mode !== 'forgot'"
        id="auth-password"
        v-model="form.password"
        type="password"
        label="Password"
        placeholder="••••••••"
        :autocomplete="mode === 'signup' ? 'new-password' : 'current-password'"
        :error="errors.password"
      />

      <Input
        v-if="mode === 'signup'"
        id="auth-confirm"
        v-model="form.confirm"
        type="password"
        label="Confirm password"
        placeholder="••••••••"
        autocomplete="new-password"
        :error="errors.confirm"
      />

      <button v-if="mode === 'login'" type="button" class="auth__link auth__link--right" @click="setMode('forgot')">
        Forgot password?
      </button>

      <Button type="submit" size="lg">{{ current.submit }}</Button>
    </form>

    <template v-if="mode !== 'forgot'">
      <div class="auth__divider"><span>or continue with</span></div>

      <div class="auth__social">
        <Button variant="secondary" size="lg" @click="social">
          <Icon name="google" /> Google
        </Button>
        <Button variant="secondary" size="lg" @click="social">
          <Icon name="apple" /> Apple
        </Button>
      </div>
    </template>

    <p class="auth__foot">
      <template v-if="mode === 'login'">
        No account?
        <button type="button" class="auth__link" @click="setMode('signup')">Sign up</button>
      </template>
      <template v-else>
        Already have an account?
        <button type="button" class="auth__link" @click="setMode('login')">Log in</button>
      </template>
    </p>
  </div>
</template>

<style scoped>
.auth {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  width: 100%;
  max-width: 24rem;
  margin: auto;
  padding: var(--space-8) 0;
}

.auth__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.auth__title {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  letter-spacing: -0.02em;
}

.auth__subtitle {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
}

.auth__notice {
  background: var(--color-accent-soft);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  font-size: var(--fs-sm);
  color: var(--color-text);
}

.auth__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.auth__form .btn,
.auth__social .btn {
  width: 100%;
}

.auth__divider {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text-dim);
  font-size: var(--fs-xs);
}

.auth__divider::before,
.auth__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.auth__social {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.auth__foot {
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
}

.auth__link {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: var(--color-accent);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  border-radius: var(--radius-sm);
}

.auth__link:hover { text-decoration: underline; }
.auth__link:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }

.auth__link--right {
  align-self: flex-end;
  margin-top: calc(var(--space-2) * -1);
  font-size: var(--fs-sm);
}
</style>
