import GamePage from '../components/GamePage.jsx'
import ActionLink from '../components/ActionLink.jsx'

export default function HutInside() {
  return (
    <GamePage title="Witch's Hut">
      <img src="/assets/witchhut-inside.png" width="480" alt="Inside the witch's hut" />
      <p>You step into the hut and see a magical tome on the desk. You walk toward the book and look at it.</p>
      <video src="/assets/Runic-Video.mp4" autoPlay muted loop width="480" />
      <p>It's opened to a magical spell, and the glyphs glow in sequence. What could it mean?</p>
      <ActionLink to="hut">Exit</ActionLink>
    </GamePage>
  )
}
