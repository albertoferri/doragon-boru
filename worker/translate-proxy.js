// Cloudflare Worker — DeepL translation proxy
//
// Setup:
// 1. Go to workers.cloudflare.com → Create Worker → paste this file
// 2. Settings → Variables → Add Secret:  DEEPL_KEY = your DeepL API key
// 3. Deploy → copy the worker URL (e.g. https://deepl-proxy.yourname.workers.dev)
// 4. Add to .env.local:  VITE_DEEPL_PROXY_URL=https://deepl-proxy.yourname.workers.dev

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const body = await request.text()

    const deeplRes = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${env.DEEPL_KEY}`,
        'Content-Type': 'application/json',
      },
      body,
    })

    const data = await deeplRes.text()

    return new Response(data, {
      status: deeplRes.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  },
}
