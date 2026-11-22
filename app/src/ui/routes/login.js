import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Button, Icon, Input, Screen } from '@/ui/components/ui'
import { validateAuth } from '@/domain/authRules'
import { colors, fs, fw, radius, space } from '@/ui/theme'

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
        <Text style={st.title}>{copy.title}</Text>
        <Text style={st.subtitle}>{copy.subtitle}</Text>
      </View>

      {sent ? (
        <Text style={st.notice} accessibilityRole="alert">
          If an account exists for <Text style={{ fontWeight: fw.bold }}>{form.email}</Text>, a reset link is on its way.
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
              <Text style={st.link}>Forgot password?</Text>
            </Pressable>
          )}
          <Button size="lg" onPress={submit}>{copy.submit}</Button>
        </View>
      )}

      {mode !== 'forgot' && (
        <>
          <View style={st.divider}>
            <View style={st.line} />
            <Text style={st.dividerText}>or continue with</Text>
            <View style={st.line} />
          </View>
          <View style={st.social}>
            <Button variant="secondary" size="lg" style={{ flex: 1 }} onPress={() => router.replace('/')}>
              <Icon name="google" />
              <Text style={st.socialText}>Google</Text>
            </Button>
            <Button variant="secondary" size="lg" style={{ flex: 1 }} onPress={() => router.replace('/')}>
              <Icon name="apple" />
              <Text style={st.socialText}>Apple</Text>
            </Button>
          </View>
        </>
      )}

      <View style={st.foot}>
        <Text style={st.footText}>{mode === 'login' ? 'No account?' : 'Already have an account?'}</Text>
        <Pressable onPress={() => switchMode(mode === 'login' ? 'signup' : 'login')}>
          <Text style={st.link}>{mode === 'login' ? 'Sign up' : 'Log in'}</Text>
        </Pressable>
      </View>
    </Screen>
  )
}

const st = StyleSheet.create({
  auth: { maxWidth: 384, gap: space[5], paddingVertical: space[8], flexGrow: 1, justifyContent: 'center' },
  title: { color: colors.text, fontSize: fs.xxl, fontWeight: fw.bold, letterSpacing: -0.5 },
  subtitle: { color: colors.textMuted, fontSize: fs.sm },
  notice: { backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accent, borderRadius: radius.md, padding: space[4], fontSize: fs.sm, color: colors.text, overflow: 'hidden' },
  link: { color: colors.accent, fontWeight: fw.semibold, fontSize: fs.sm },
  divider: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textDim, fontSize: fs.xs },
  social: { flexDirection: 'row', gap: space[3] },
  socialText: { color: colors.text, fontSize: fs.lg, fontWeight: fw.semibold },
  foot: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: space[1] },
  footText: { color: colors.textMuted, fontSize: fs.sm },
})
