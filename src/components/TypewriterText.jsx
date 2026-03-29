import { useState, useEffect, useMemo } from 'react'

/**
 * Typewriter / terminal effect.
 *
 * Simple usage:
 *   <TypewriterText text="Hello world" />
 *
 * Multi-color usage (segments must be a stable reference — define outside component):
 *   const SEGS = [{ text: 'Doragon ', className: '' }, { text: 'Boru', className: 'text-blue-400' }]
 *   <TypewriterText segments={SEGS} />
 */
export default function TypewriterText({ text, segments, speed = 45, delay = 0, className, style }) {
  const flat = useMemo(() => {
    if (segments) {
      return segments.flatMap(seg =>
        [...seg.text].map(c => ({ c, cls: seg.className || '' }))
      )
    }
    return [...(text || '')].map(c => ({ c, cls: '' }))
  // segments must be a stable reference (defined outside the component)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, segments])

  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(0)
    let i = 0
    const t0 = setTimeout(() => {
      const iv = setInterval(() => {
        i += 1
        setCount(i)
        if (i >= flat.length) clearInterval(iv)
      }, speed)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(t0)
  }, [flat, speed, delay])

  // Group consecutive same-class chars into chunks to minimise DOM nodes
  const chunks = []
  let buf = '', bufCls = null
  for (let i = 0; i < count; i++) {
    const { c, cls } = flat[i]
    if (cls === bufCls) {
      buf += c
    } else {
      if (buf) chunks.push({ text: buf, cls: bufCls })
      buf = c
      bufCls = cls
    }
  }
  if (buf) chunks.push({ text: buf, cls: bufCls })

  return (
    <span className={className} style={style}>
      {chunks.map((chunk, i) =>
        chunk.cls
          ? <span key={i} className={chunk.cls}>{chunk.text}</span>
          : chunk.text
      )}
    </span>
  )
}
