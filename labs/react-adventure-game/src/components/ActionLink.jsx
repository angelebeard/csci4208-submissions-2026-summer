import { useGame } from '../GameContext.jsx'

export default function ActionLink({ to, children, beforeNavigate }) {
  const { goTo } = useGame()

  function navigate(event) {
    event.preventDefault()
    beforeNavigate?.()
    goTo(to)
  }

  return <a href={`#${to}`} onClick={navigate}>{children}</a>
}
