import { useState, useEffect } from 'react'
import { translateText } from '../utils/translate'

// Returns the translated text.
// Shows the original immediately, then silently swaps to translated — no loading spinner needed.
export default function useTranslatedText(original) {
  const [text, setText] = useState('')

  useEffect(() => {
    setText('') // reset to empty so typewriter always starts fresh on the final text
    if (!original) return
    let cancelled = false
    translateText(original).then(result => {
      if (!cancelled) setText(result)
    })
    return () => { cancelled = true }
  }, [original])

  return text
}
