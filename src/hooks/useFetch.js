import { useState, useEffect, useCallback } from 'react'

export default function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Returns a cancel function so the effect can ignore stale responses
  const execute = useCallback(() => {
    setLoading(true)
    setError(null)
    let cancelled = false

    fetchFn()
      .then(result => { if (!cancelled) setData(result) })
      .catch(err  => { if (!cancelled) setError(err.message || 'An error occurred') })
      .finally(()  => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => execute(), [execute])

  return { data, loading, error, refetch: execute }
}
