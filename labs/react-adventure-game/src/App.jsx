import { useGame } from './GameContext.jsx'
import Home from './pages/Home.jsx'
import Intro from './pages/Intro.jsx'
import Overworld from './pages/Overworld.jsx'
import Forest from './pages/Forest.jsx'
import Swamp from './pages/Swamp.jsx'
import Hut from './pages/Hut.jsx'
import HutInside from './pages/HutInside.jsx'
import Shoppe from './pages/Shoppe.jsx'
import Goblin from './pages/Goblin.jsx'
import Dungeon from './pages/Dungeon.jsx'
import Dragon from './pages/Dragon.jsx'

const pages = {
  home: Home,
  intro: Intro,
  overworld: Overworld,
  forest: Forest,
  swamp: Swamp,
  hut: Hut,
  'hut-inside': HutInside,
  shoppe: Shoppe,
  goblin: Goblin,
  dungeon: Dungeon,
  dragon: Dragon,
}

export default function App() {
  const { page } = useGame()
  const Page = pages[page] ?? Home

  return <Page />
}
