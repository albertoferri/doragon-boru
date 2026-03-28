import { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favCharacters, setFavCharacters] = useLocalStorage('fav_characters', [])
  const [favPlanets, setFavPlanets] = useLocalStorage('fav_planets', [])

  const toggleFavCharacter = (char) => {
    setFavCharacters(prev =>
      prev.find(c => c.id === char.id)
        ? prev.filter(c => c.id !== char.id)
        : [...prev, char]
    )
  }

  const toggleFavPlanet = (planet) => {
    setFavPlanets(prev =>
      prev.find(p => p.id === planet.id)
        ? prev.filter(p => p.id !== planet.id)
        : [...prev, planet]
    )
  }

  const isFavCharacter = (id) => favCharacters.some(c => c.id === id)
  const isFavPlanet = (id) => favPlanets.some(p => p.id === id)

  return (
    <FavoritesContext.Provider value={{
      favCharacters, favPlanets,
      toggleFavCharacter, toggleFavPlanet,
      isFavCharacter, isFavPlanet
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)
