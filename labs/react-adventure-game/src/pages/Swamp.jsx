import { useState } from 'react'
import GamePage from '../components/GamePage.jsx'
import ActionLink from '../components/ActionLink.jsx'
import DeathScreen from '../components/DeathScreen.jsx'

export default function Swamp() {
  const [dead, setDead] = useState(false)

  if (dead) {
    return <DeathScreen image="/assets/gator.jpg">A giant alligator eats you.</DeathScreen>
  }

  return (
    <GamePage title="Swamp">
      <img src="/assets/swamp-hut.jpg" width="480" alt="Witch hut in the swamp" />
      <p>You come across a creepy witch hut in the swamp.</p>
      <ul>
        <li><ActionLink to="hut">Go into the hut</ActionLink></li>
        <li><button onClick={() => setDead(true)}>Search outside the hut</button></li>
      </ul>
      <ActionLink to="overworld">Exit</ActionLink>
    </GamePage>
  )
}
