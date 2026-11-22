import { useEffect, useRef, useState } from 'react'

export default function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShow(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${show ? 'show' : ''} ${className}`}>
      {children}
    </div>
  )
}
