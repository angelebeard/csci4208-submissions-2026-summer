import GamePage from '../components/GamePage.jsx'
import ActionLink from '../components/ActionLink.jsx'

export default function Overworld() {
  return (
    <GamePage title="Overworld">
      <img src="/assets/overworld-map.gif" width="480" alt="Overworld map" />
      <h4>Where do you want to go?</h4>
      <ul>
        <li><ActionLink to="dungeon">Dungeon</ActionLink></li>
        <li><ActionLink to="forest">Forest</ActionLink></li>
        <li><ActionLink to="shoppe">Shoppe</ActionLink></li>
      </ul>
    </GamePage>
  )
}
