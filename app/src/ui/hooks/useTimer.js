import { useEffect, useState } from 'react'

// Countdown timer (old composables/useTimer.js). The interval lives in an effect keyed on
// isActive, so React clears it on stop/unmount (Vue's onUnmounted → effect cleanup).
export function useTimer(defaultDuration = 60) {
  const [timeRemaining, setTimeRemaining] = useState(defaultDuration)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (!isActive) return
    const id = setInterval(() => setTimeRemaining(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [isActive])

  // Auto-stop at zero.
  useEffect(() => {
    if (isActive && timeRemaining <= 0) setIsActive(false)
  }, [isActive, timeRemaining])

  const mm = String(Math.floor(timeRemaining / 60)).padStart(2, '0')
  const ss = String(timeRemaining % 60).padStart(2, '0')

  const start = (duration) => {
    if (duration !== undefined) setTimeRemaining(duration)
    setIsActive(true)
  }
  const stop = () => setIsActive(false)
  const reset = (duration = defaultDuration) => {
    setIsActive(false)
    setTimeRemaining(duration)
  }
  const toggle = () => setIsActive(a => !a)

  return {
    timeRemaining,
    isActive,
    formattedTime: `${mm}:${ss}`,
    progress: ((defaultDuration - timeRemaining) / defaultDuration) * 100,
    start,
    stop,
    reset,
    toggle,
  }
}
