import GamePage from '../components/GamePage.jsx'
import ActionLink from '../components/ActionLink.jsx'
import { useGame } from '../GameContext.jsx'

export default function Intro() {
  const { acceptQuest } = useGame()

  return (
    <GamePage title="Story Introduction">
      <img src="/assets/intro.gif" width="360" alt="Village elder" />
      <p>
        Welcome, traveler! Our land is plagued by a great evil.
        Please save us. Here, take 5 gold as a deposit.
      </p>
      <h4>
        <ActionLink to="overworld" beforeNavigate={acceptQuest}>
          Adventure out of town
        </ActionLink>
      </h4>
    </GamePage>
  )
}
