import { useState } from 'react'
import { useGame } from '../GameContext.jsx'
import GamePage from '../components/GamePage.jsx'
import ActionLink from '../components/ActionLink.jsx'

export default function Goblin() {
  const { player, updatePlayer } = useGame()
  const [goblinHP, setGoblinHP] = useState(3)
  const [message, setMessage] = useState("Goblin ambush! You're threatened by a goblin!")

  const won = goblinHP <= 0
  const dead = player.hp <= 0

  function attack() {
    const nextGoblinHP = goblinHP - player.ap
    setGoblinHP(nextGoblinHP)

    if (nextGoblinHP <= 0) {
      updatePlayer({ gp: player.gp + 3 })
      setMessage('You defeated the goblin and find 3 gold!')
      return
    }

    const nextHP = player.hp - 2
    updatePlayer({ hp: nextHP })

    if (nextHP <= 0) {
      setMessage('You Died.')
      return
    }

    setMessage(`You hit for ${player.ap} damage, it has ${nextGoblinHP} HP left. You take 2 damage.`)
  }

  return (
    <GamePage title="Hills">
      <img src={won ? '/assets/treasure.gif' : '/assets/goblin.gif'} width="480" alt={won ? 'Treasure' : 'Goblin'} />
      <p>{message}</p>
      {dead ? (
        <ActionLink to="home">Game Over</ActionLink>
      ) : won ? (
        <ActionLink to="forest">Go back</ActionLink>
      ) : (
        <><button onClick={attack}>Fight</button> <ActionLink to="forest">Retreat</ActionLink></>
      )}
    </GamePage>
  )
}
