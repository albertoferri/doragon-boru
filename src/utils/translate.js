// DeepL translation utility (ES → IT)
// Dev: calls through Vite proxy (/deepl) to avoid CORS
// Prod: needs VITE_DEEPL_PROXY_URL pointing to a Cloudflare Worker
// Cache in localStorage — second visit is always instant

const DEV_URL = '/deepl/v2/translate'
const PROD_URL = import.meta.env.VITE_DEEPL_PROXY_URL

const DEEPL_URL = import.meta.env.DEV ? DEV_URL : PROD_URL

export async function translateText(text, sourceLang = 'ES', targetLang = 'IT') {
  if (!text?.trim()) return text
  if (!DEEPL_URL) return text

  const key = import.meta.env.VITE_DEEPL_API_KEY
  if (!key) return text

  const cacheKey = `deepl|${sourceLang}|${targetLang}|${text}`

  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached) return cached
  } catch { /* ignore */ }

  try {
    const res = await fetch(DEEPL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: [text], source_lang: sourceLang, target_lang: targetLang }),
    })

    if (!res.ok) return text

    const data = await res.json()
    const result = data?.translations?.[0]?.text
    if (!result) return text

    try { localStorage.setItem(cacheKey, result) } catch { /* storage full */ }

    return result
  } catch {
    return text // network error: show original
  }
}
