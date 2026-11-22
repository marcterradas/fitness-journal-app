import { useEffect, useRef, useState } from 'react'

// Message + show(msg) that auto-clears after 2s. Render it with <Toast message={...} />.
export function useToast() {
  const [message, setMessage] = useState('')
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  function show(m) {
    clearTimeout(timer.current)
    setMessage(m)
    timer.current = setTimeout(() => setMessage(''), 2000)
  }
  return [message, show]
}
