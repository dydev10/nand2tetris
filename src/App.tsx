import { useState } from 'react'
import reactLogo from './assets/react.svg'
import notLogo from './assets/notCircle.png'
import './App.css'
import ConnectedCanvas from './components/ConnectedCanvas'

function App() {
  return (
    <>
      <div>
        <img src={notLogo} className="logo" alt="Not logo" />
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>NAND simulator</h1>
      <div id='canvas-wrapper'>
        <ConnectedCanvas />
      </div>
      <p className="read-the-docs">
        HTML5 Canvas + React
      </p>
    </>
  )
}

export default App
