// DeepL translation utility (ES → IT)
//
// Dev:  calls through Vite proxy (/deepl) — API key sent in Authorization header
// Prod: calls Cloudflare Worker (VITE_DEEPL_PROXY_URL) — Worker handles auth internally,
//       API key is never included in the production bundle
//
// Results are cached in localStorage — each text is only translated once.

export async function translateText(text, sourceLang = 'ES', targetLang = 'IT') {
  if (!text?.trim()) return text

  const url = import.meta.env.DEV
    ? '/deepl/v2/translate'
    : import.meta.env.VITE_DEEPL_PROXY_URL

  if (!url) return text

  const cacheKey = `deepl|${sourceLang}|${targetLang}|${text}`
  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached) return cached
  } catch { /* ignore */ }

  try {
    const headers = { 'Content-Type': 'application/json' }

    // In dev, authenticate directly through the Vite proxy
    if (import.meta.env.DEV) {
      const key = import.meta.env.VITE_DEEPL_API_KEY
      if (!key) return text
      headers['Authorization'] = `DeepL-Auth-Key ${key}`
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text: [text], source_lang: sourceLang, target_lang: targetLang }),
    })

    if (!res.ok) return text

    const data = await res.json()
    const result = data?.translations?.[0]?.text
    if (!result) return text

    try { localStorage.setItem(cacheKey, result) } catch { /* storage full */ }

    return result
  } catch {
    return text
  }
}
