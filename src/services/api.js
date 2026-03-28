import axios from 'axios'

const BASE_URL = 'https://dragonball-api.com/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

export const getCharacters = async (page = 1, limit = 10) => {
  const res = await api.get(`/characters?page=${page}&limit=${limit}`)
  return res.data
}

export const getAllCharacters = async () => {
  const res = await api.get('/characters?limit=100')
  return res.data
}

export const getCharacterById = async (id) => {
  const res = await api.get(`/characters/${id}`)
  return res.data
}

export const getPlanets = async () => {
  const res = await api.get('/planets?limit=100')
  return res.data
}

export const getPlanetById = async (id) => {
  const res = await api.get(`/planets/${id}`)
  return res.data
}

export const getDestroyedPlanets = async () => {
  const data = await getPlanets()
  const items = data.items || data
  return items.filter(p => p.isDestroyed)
}
