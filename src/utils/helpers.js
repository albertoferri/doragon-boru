export const parseKi = (kiStr) => {
  if (!kiStr || kiStr === 'Unknown') return 0
  if (kiStr === 'Infinite') return 1e15

  const lower = kiStr.toLowerCase()

  let multiplier = 1
  if (lower.includes('quadrillion')) multiplier = 1e15
  else if (lower.includes('trillion')) multiplier = 1e12
  else if (lower.includes('billion')) multiplier = 1e9
  else if (lower.includes('million')) multiplier = 1e6
  else if (lower.includes('thousand')) multiplier = 1e3

  // Remove EN commas, then check for European dot-as-thousand-separator
  let cleaned = kiStr.replace(/,/g, '')
  const dots = (cleaned.match(/\./g) || []).length
  if (dots > 1) cleaned = cleaned.replace(/\./g, '')

  const num = parseFloat(cleaned)
  if (isNaN(num)) return 0
  return num * multiplier
}

// Deterministic "hidden" power for characters with unknown ki
// so each character has a unique value instead of all being 1000
export const hiddenPower = (id) => {
  let h = 0
  const s = String(id)
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffffffff
  return 500 + Math.abs(h % 9500)
}

export const formatKi = (ki) => {
  if (!ki || ki === 'Unknown') return 'Unknown'
  return ki
}

export const getRaceColor = (race) => {
  const map = {
    'Saiyan': 'text-yellow-400',
    'Human': 'text-blue-400',
    'Namekian': 'text-green-400',
    'Frieza Race': 'text-purple-400',
    'Android': 'text-cyan-400',
    'Majin': 'text-pink-400',
    'God': 'text-amber-300',
    'Angel': 'text-white',
  }
  return map[race] || 'text-neutral-400'
}

export const getRaceBadgeStyle = (race) => {
  const map = {
    'Saiyan': 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
    'Human': 'bg-blue-900/40 text-blue-400 border-blue-800',
    'Namekian': 'bg-green-900/40 text-green-400 border-green-800',
    'Frieza Race': 'bg-purple-900/40 text-purple-400 border-purple-800',
    'Android': 'bg-cyan-900/40 text-cyan-400 border-cyan-800',
    'Majin': 'bg-pink-900/40 text-pink-400 border-pink-800',
    'God': 'bg-amber-900/40 text-amber-300 border-amber-700',
    'Angel': 'bg-neutral-700/40 text-white border-neutral-600',
  }
  return map[race] || 'bg-neutral-700/40 text-neutral-400 border-neutral-600'
}

export const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)
