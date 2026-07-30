import GamePage from '../components/GamePage.jsx'
import ActionLink from '../components/ActionLink.jsx'

export default function Dragon() {
  return (
    <GamePage title="Dragon's Lair" showInventory={false}>
      <img src="/assets/dragon-fire.gif" width="480" alt="Red dragon" />
      <p>You step into the dungeon to find a Red Dragon. It roars and breathes fire toward you. You draw your sword.</p>
      <h4>To be continued...</h4>
      <ActionLink to="home">Start Over</ActionLink>
    </GamePage>
  )
}
