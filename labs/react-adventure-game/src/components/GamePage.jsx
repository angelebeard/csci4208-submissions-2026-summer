import Inventory from './Inventory.jsx'

export default function GamePage({ title, children, showInventory = true }) {
  return (
    <main>
      <h1>{title}</h1>
      <hr />
      {children}
      {showInventory && <><hr /><Inventory /></>}
    </main>
  )
}
