// What makes the mock behave like a remote server: async with a little latency, and
// responses are copies, so screens can't mutate the "database" by accident.
// ponytail: fixed 120 ms, no failures. Add random errors here to test error states.
const LATENCY_MS = 120

export const respond = value =>
  new Promise(resolve => setTimeout(() => resolve(value === undefined ? undefined : JSON.parse(JSON.stringify(value))), LATENCY_MS))

let seq = 1
export const newId = prefix => `${prefix}_${Date.now().toString(36)}${seq++}`
