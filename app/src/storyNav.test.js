// Run: node src/storyNav.test.js
import { strict as assert } from 'node:assert'
import { step } from './storyNav.js'

const s = [{ items: [1, 2] }, { items: [1] }, { items: [1, 2, 3] }]

// forward within a user, then across users
assert.deepEqual(step(s, 0, 0, 1), { userIdx: 0, itemIdx: 1 })
assert.deepEqual(step(s, 0, 1, 1), { userIdx: 1, itemIdx: 0 })
assert.deepEqual(step(s, 1, 0, 1), { userIdx: 2, itemIdx: 0 })
// past the very last item -> close
assert.equal(step(s, 2, 2, 1), null)

// backward within a user, then to the previous user's LAST item
assert.deepEqual(step(s, 2, 1, -1), { userIdx: 2, itemIdx: 0 })
assert.deepEqual(step(s, 2, 0, -1), { userIdx: 1, itemIdx: 0 })
assert.deepEqual(step(s, 1, 0, -1), { userIdx: 0, itemIdx: 1 })
// at the very start -> stay
assert.deepEqual(step(s, 0, 0, -1), { userIdx: 0, itemIdx: 0 })

console.log('storyNav ok')
