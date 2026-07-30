import GamePage from '../components/GamePage.jsx'
import ActionLink from '../components/ActionLink.jsx'

export default function Forest() {
  return (
    <GamePage title="Forest">
      <img src="/assets/forest.gif" width="480" alt="Forest" />
      <p>You wander into the forest. To the left is a winding path up the hills, to the right is a path into the swamps.</p>
      <h4>What do you do?</h4>
      <ul>
        <li><ActionLink to="goblin">Go left into the Hills</ActionLink></li>
        <li><ActionLink to="swamp">Go right into the Swamp</ActionLink></li>
      </ul>
      <p><ActionLink to="overworld">Exit</ActionLink></p>
    </GamePage>
  )
}
