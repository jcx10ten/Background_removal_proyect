import { useState } from 'react'
import './App.css'
import DropZone from './components/DropZone'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <nav className="navbar">
          <span>BACKGROUND REMOVAL</span>
        </nav>

        <main className="main-card">

        <div className="hero-text">
          <h1>Prueba pagina</h1>
          <p>Prueba pagina para quitar el fondo, se irán añadiendo más funciones en el futuro.</p>
        </div>

        <div className="dropzone-wrapper">
          <DropZone />
        </div>

      </main>



      </div>
  )
}

export default App
