import { useState } from 'react'
import './App.css'
import DropZone from './components/DropZone'
import RetouchCanvas from './components/RetouchCanvas'
import { useBackgroundRemoval } from './hooks/useBackgroundRemoval'

function App() {
  const { processImage, resultUrl, loading, progress, error } = useBackgroundRemoval()
  const [currentFile, setCurrentFile] = useState(null)

  const handleFileSelected = (file) => {
    setCurrentFile(file)
    processImage(file)
  }

  return (
    <div className="page">

      <nav className="navbar">
        <span>BACKGROUND REMOVAL</span>
      </nav>

      <main className="main-card">

        <div className="hero-text">
          <h1>Prueba pagina</h1>
          <p>Prueba pagina para quitar el fondo, se irán añadiendo más funciones en el futuro.</p>
        </div>

        <div className="dropzone-wrapper">

          {/* Si no hay resultado todavía, muestra el DropZone */}
          {!resultUrl && !loading && (
            <DropZone onFileSelected={handleFileSelected} />
          )}

          {/* Mientras procesa, muestra el progreso */}
          {loading && (
            <div className="progress-container">
              <p>Procesando imagen... {progress}%</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Si hay error */}
          {error && <p className="error-msg">{error}</p>}

          {/* Si hay resultado, muestra el canvas de retoque */}
          {resultUrl && !loading && (
            <div className="result-container">
              <RetouchCanvas resultUrl={resultUrl} originalFile={currentFile} />
              <button
                className="btn-reset"
                onClick={() => window.location.reload()}
              >
                Procesar otra imagen
              </button>
            </div>
          )}

        </div>

      </main>

    </div>
  )
}

export default App