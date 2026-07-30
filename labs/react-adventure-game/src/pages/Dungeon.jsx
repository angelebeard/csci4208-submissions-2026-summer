import { useState } from 'react'
import { useGame } from '../GameContext.jsx'
import GamePage from '../components/GamePage.jsx'
import ActionLink from '../components/ActionLink.jsx'
import DeathScreen from '../components/DeathScreen.jsx'

export default function Dungeon() {
  const [word, setWord] = useState('')
  const [dead, setDead] = useState(false)
  const { goTo } = useGame()

  if (dead) {
    return (
      <DeathScreen image="/assets/death-spell.gif">
        You misspoke the magic word and your soul is ripped from your body!
      </DeathScreen>
    )
  }

  function submit(event) {
    event.preventDefault()
    word === 'open' ? goTo('dragon') : setDead(true)
  }

  return (
    <GamePage title="Dungeon Entrance">
      <p>There is a magical seal preventing you from entering the dungeon. You must dispel it.</p>
      <img src="/assets/magic-seal.gif" width="480" alt="Magical seal" />
      <form onSubmit={submit}>
        <label htmlFor="magic-word">Enter the magic word: </label>
        <input
          id="magic-word"
          value={word}
          onChange={(event) => setWord(event.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <ActionLink to="overworld">Exit</ActionLink>
    </GamePage>
  )
}
