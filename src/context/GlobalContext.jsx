import { createContext, useContext, useState } from 'react'

const GlobalContext = createContext(null)

export function GlobalProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRace, setSelectedRace] = useState('')
  const [kiRange, setKiRange] = useState([0, Infinity])

  return (
    <GlobalContext.Provider value={{
      searchQuery, setSearchQuery,
      selectedRace, setSelectedRace,
      kiRange, setKiRange,
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => useContext(GlobalContext)
