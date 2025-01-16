import { useState } from 'react'
import reactLogo from './assets/react.svg'
import notLogo from './assets/notCircle.png'
import './App.css'
import SimCanvas from './components/SimCanvas'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={notLogo} className="logo" alt="Not logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>NAND simulator</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <div id='canvas-wrapper'>
        <SimCanvas />
      </div>
      <p className="read-the-docs">
        HTML5 Canvas + React
      </p>
    </>
  )
}

export default App
