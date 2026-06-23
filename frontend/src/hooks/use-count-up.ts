"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

/** Анимирует число от предыдущего значения к новому (ease-out, ~600мс).
 *  При первом рендере анимирует от 0. Не анимирует, если значение не
 *  изменилось (например, React Query вернул тот же счёт при рефетче). */
export function useCountUp(value: number, durationMs = 600): number {
  const reducedMotion = useReducedMotion()
  const [display, setDisplay] = useState(0)
  const fromRef = useRef(0)

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value)
      fromRef.current = value
      return
    }
    const from = fromRef.current
    const to = value
    if (from === to) return

    const start = performance.now()
    let frame: number

    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(Math.round(from + (to - from) * eased))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, durationMs, reducedMotion])

  return display
}
