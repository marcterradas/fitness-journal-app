// Run: node src/authRules.test.js
import { strict as assert } from 'node:assert'
import { validateAuth } from './authRules.js'

const ok = { name: 'Al', email: 'a@b.co', password: 'longenough', confirm: 'longenough' }

assert.deepEqual(validateAuth('login', ok), {})
assert.deepEqual(validateAuth('signup', ok), {})
assert.deepEqual(validateAuth('forgot', { email: 'a@b.co' }), {})

assert.ok(validateAuth('login', { ...ok, email: 'nope' }).email)
assert.ok(validateAuth('login', { ...ok, password: '' }).password)
assert.ok(validateAuth('signup', { ...ok, name: '  ' }).name)
assert.ok(validateAuth('signup', { ...ok, password: 'short', confirm: 'short' }).password)
assert.ok(validateAuth('signup', { ...ok, confirm: 'mismatch' }).confirm)
// forgot ignores password fields entirely
assert.deepEqual(validateAuth('forgot', { email: 'a@b.co', password: '' }), {})

console.log('authRules ok')
