import { createContext, useContext, useState } from 'react'

const startingPlayer = { gp: 0, hp: 3, ap: 1, keys: 0 }
const GameContext = createContext()

export function GameProvider({ children }) {
  const [page, setPage] = useState('home')
  const [player, setPlayer] = useState(startingPlayer)

  function goTo(nextPage) {
    setPage(nextPage)
  }

  function updatePlayer(changes) {
    setPlayer((current) => ({ ...current, ...changes }))
  }

  function startGame() {
    setPlayer(startingPlayer)
    setPage('intro')
  }

  function acceptQuest() {
    setPlayer((current) => ({ ...current, gp: current.gp + 5 }))
  }

  return (
    <GameContext.Provider value={{ page, player, goTo, updatePlayer, startGame, acceptQuest }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  return useContext(GameContext)
}
