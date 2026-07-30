import { useGame } from '../GameContext.jsx'

export default function Inventory() {
  const { player } = useGame()

  return (
    <section className="inventory">
      Inventory:
      <hr />
      <table>
        <thead><tr><th>💰</th><th>💜</th><th>🗡</th><th>🔑</th></tr></thead>
        <tbody>
          <tr><td>{player.gp}</td><td>{player.hp}</td><td>{player.ap}</td><td>{player.keys}</td></tr>
        </tbody>
      </table>
    </section>
  )
}
