import { useCallback, useEffect, useRef, useState } from 'react'

export default function useToast() {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const show = useCallback((message, type = 'success') => {
    clearTimeout(timer.current)
    setToast({ message, type })
    timer.current = setTimeout(() => setToast(null), 4000)
  }, [])

  const clear = useCallback(() => {
    clearTimeout(timer.current)
    setToast(null)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return { toast, show, clear }
}
