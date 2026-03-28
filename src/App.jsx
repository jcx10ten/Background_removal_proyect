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
    <div className="min-h-screen p-6" style={{ backgroundColor: '#e8eaff' }}>

      {/* Navbar */}
      <nav className="mb-5">
        <span className="text-xs font-bold tracking-widest" style={{ color: '#4E51F5' }}>
          BACKGROUND REMOVAL
        </span>
      </nav>

      {/* Card principal */}
<main
  className="rounded-2xl p-10 flex items-center gap-10 w-full overflow-hidden"
  style={{ backgroundColor: '#dde0ff', border: '1px solid #b0b8fa' }}
>

        {/* Texto izquierda */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-5xl font-bold" style={{ color: '#3a3a6e' }}>
            Remover el fondo
          </h1>
          <p className="text-base max-w-xs leading-relaxed" style={{ color: '#5c5c99' }}>
            Prueba pagina para quitar el fondo, se irán añadiendo más funciones en el futuro.
          </p>
          <p className="text-base font-medium" style={{ color: '#000000' }}>
            Espero te sirva mucho la pagina amoor
          </p>
        </div>

        {/* Zona derecha */}
        <div className="w-80 shrink-0">

          {!resultUrl && !loading && (
            <DropZone onFileSelected={handleFileSelected} />
          )}

          {loading && (
            <div className="text-center py-6">
              <p className="text-sm font-semibold mb-3 tracking-wide" style={{ color: '#4E51F5' }}>
                Procesando imagen... {progress}%
              </p>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#b0b8fa' }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, backgroundColor: '#4E51F5' }}
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-center text-sm">{error}</p>
          )}

          {resultUrl && !loading && (
            <div className="flex flex-col gap-4">
              <RetouchCanvas resultUrl={resultUrl} originalFile={currentFile} />
              <button
                className="w-full font-bold py-2 px-6 rounded-xl transition-all duration-200"
                style={{
                  border: '2px solid #4E51F5',
                  color: '#4E51F5',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = '#4E51F5'
                  e.target.style.color = 'white'
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = '#4E51F5'
                }}
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