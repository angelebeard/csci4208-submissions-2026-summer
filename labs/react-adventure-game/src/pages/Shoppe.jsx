import { useGame } from '../GameContext.jsx'
import GamePage from '../components/GamePage.jsx'
import ActionLink from '../components/ActionLink.jsx'

export default function Shoppe() {
  const { player, updatePlayer } = useGame()

  function buy(cost, changes) {
    if (player.gp >= cost) {
      updatePlayer({ gp: player.gp - cost, ...changes })
    }
  }

  return (
    <GamePage title="Shoppe">
      <img src="/assets/shop.gif" width="480" alt="Shopkeeper" />
      <h4>What can I get you?</h4>
      <button onClick={() => buy(1, { hp: player.hp + 1 })}>Health 💜<br /><i>1 gp</i></button>
      <button onClick={() => buy(5, { ap: player.ap + 1 })}>Attack 🗡<br /><i>5 gp</i></button>
      <button onClick={() => buy(10, { keys: player.keys + 1 })}>Key 🔑<br /><i>10 gp</i></button>
      <ActionLink to="overworld">Exit</ActionLink>
    </GamePage>
  )
}
