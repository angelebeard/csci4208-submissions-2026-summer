import { useState } from 'react'
import { useGame } from '../GameContext.jsx'
import GamePage from '../components/GamePage.jsx'
import ActionLink from '../components/ActionLink.jsx'

export default function Hut() {
  const { player, updatePlayer, goTo } = useGame()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  function useDoor() {
    if (open) {
      goTo('hut-inside')
    } else if (player.keys > 0) {
      updatePlayer({ keys: player.keys - 1 })
      setOpen(true)
      setMessage('The door unlocked, but the key broke apart.')
    } else {
      setMessage('The door is locked.')
    }
  }

  return (
    <GamePage title="Witch's Hut">
      <button className="image-button" onClick={useDoor}>
        <img
          src={open ? '/assets/Open-Door.gif' : '/assets/Locked-Door.gif'}
          width="240"
          alt={open ? 'Open door' : 'Locked door'}
        />
      </button>
      <p>{message}</p>
      <ActionLink to="swamp">Exit</ActionLink>
    </GamePage>
  )
}
