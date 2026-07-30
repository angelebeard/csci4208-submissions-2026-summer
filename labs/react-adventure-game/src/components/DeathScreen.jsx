import ActionLink from './ActionLink.jsx'

export default function DeathScreen({ image, children }) {
  return (
    <main>
      <h1>You Die</h1>
      <img src={image} width="480" alt="Game over" />
      <p>{children}</p>
      <ActionLink to="home"><h4>Game Over</h4></ActionLink>
      <audio src="/assets/scream.mp3" autoPlay />
    </main>
  )
}
