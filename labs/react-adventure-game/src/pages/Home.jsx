import { useGame } from '../GameContext.jsx'

export default function Home() {
  const { startGame } = useGame()

  return (
    <main>
      <h1>React Adventure Game</h1>
      <hr />
      <p>Beware, Here be monsters!</p>
      <img src="/assets/game-title.gif" width="480" alt="Adventure Game" />
      <p><button onClick={startGame}>Start</button></p>
      <hr />
      <h4>Story &amp; Code by Ted</h4>
    </main>
  )
}
