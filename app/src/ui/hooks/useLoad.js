import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'

// Runs `load()` (API calls + domain derivations) every time the screen gains focus, so data
// changed on another screen is fresh when you come back. Call `reload()` after a mutation.
// `load` must be stable: define it at module level, not as an inline arrow.
// ponytail: no cache/dedupe/retry. Upgrade path: TanStack Query when the API is real.
export function useLoad(load) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const reload = useCallback(() => load().then(setData, setError), [load])
  useFocusEffect(useCallback(() => { reload() }, [reload]))
  return { data, error, reload }
}
