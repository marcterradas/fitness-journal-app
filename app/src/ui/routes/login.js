import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Button, Icon, Input, Row, Screen, Text } from '@/ui/components'
import { validateAuth } from '@/domain/authRules'
import { colors, radius, space } from '@/ui/theme'

const COPY = {
  login: { title: 'Welcome back', subtitle: 'Log in to keep your streak alive.', submit: 'Log in' },
  signup: { title: 'Create account', subtitle: 'Start tracking your training today.', submit: 'Sign up' },
  forgot: { title: 'Reset password', subtitle: "We'll email you a reset link.", submit: 'Send reset link' },
}

export default function LoginScreen() {
  // ponytail: mode state instead of /login /signup /forgot routes. Split when they need deep links.
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const copy = COPY[mode]

  const field = key => ({ value: form[key], onChangeText: v => setForm(f => ({ ...f, [key]: v })), error: errors[key] })

  function switchMode(next) {
    setMode(next)
    setSent(false)
    setErrors({})
  }

  // ponytail: no API yet. Swap branch bodies for auth calls when the backend lands.
  function submit() {
    const next = validateAuth(mode, form)
    setErrors(next)
    if (Object.keys(next).length) return
    if (mode === 'forgot') setSent(true)
    else router.replace('/')
  }

  return (
    <Screen edges={['top', 'bottom']} style={st.auth}>
      <View style={{ gap: space[1] }}>
        <Text variant="h1">{copy.title}</Text>
        <Text variant="muted">{copy.subtitle}</Text>
      </View>

      {sent ? (
        <Text variant="small" style={st.notice} accessibilityRole="alert">
          If an account exists for <Text variant="small" weight="bold">{form.email}</Text>, a reset link is on its way.
        </Text>
      ) : (
        <View style={{ gap: space[4] }}>
          {mode === 'signup' && <Input label="Name" placeholder="Alex Ryder" autoComplete="name" {...field('name')} />}
          <Input
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
            keyboardType="email-address"
            autoCapitalize="none"
            {...field('email')}
          />
          {mode !== 'forgot' && (
            <Input
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              {...field('password')}
            />
          )}
          {mode === 'signup' && (
            <Input label="Confirm password" placeholder="••••••••" secureTextEntry autoComplete="new-password" {...field('confirm')} />
          )}
          {mode === 'login' && (
            <Pressable style={{ alignSelf: 'flex-end', marginTop: -space[2] }} onPress={() => switchMode('forgot')}>
              <Text variant="link">Forgot password?</Text>
            </Pressable>
          )}
          <Button size="lg" onPress={submit}>{copy.submit}</Button>
        </View>
      )}

      {mode !== 'forgot' && (
        <>
          <Row gap={3}>
            <View style={st.line} />
            <Text variant="dim">or continue with</Text>
            <View style={st.line} />
          </Row>
          <Row gap={3}>
            <Button variant="secondary" size="lg" style={{ flex: 1 }} onPress={() => router.replace('/')}>
              <Icon name="google" />
              <Text variant="h3" weight="semibold">Google</Text>
            </Button>
            <Button variant="secondary" size="lg" style={{ flex: 1 }} onPress={() => router.replace('/')}>
              <Icon name="apple" />
              <Text variant="h3" weight="semibold">Apple</Text>
            </Button>
          </Row>
        </>
      )}

      <Row gap={1} justify="center">
        <Text variant="muted">{mode === 'login' ? 'No account?' : 'Already have an account?'}</Text>
        <Pressable onPress={() => switchMode(mode === 'login' ? 'signup' : 'login')}>
          <Text variant="link">{mode === 'login' ? 'Sign up' : 'Log in'}</Text>
        </Pressable>
      </Row>
    </Screen>
  )
}

const st = StyleSheet.create({
  auth: { maxWidth: 384, gap: space[5], paddingVertical: space[8], flexGrow: 1, justifyContent: 'center' },
  notice: { backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accent, borderRadius: radius.md, padding: space[4], overflow: 'hidden' },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
})
