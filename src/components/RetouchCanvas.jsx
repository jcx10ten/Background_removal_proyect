import { useEffect, useRef, useState } from "react"
import './RetouchCanvas.css'

function RetouchCanvas({ resultUrl, originalFile }) {
  const canvasRef = useRef(null)
  const originalImageRef = useRef(null) // guarda imagen original para restaurar
  const isDrawing = useRef(false)
  const [tool, setTool] = useState("erase") // "erase" o "restore"
  const [brushSize, setBrushSize] = useState(20)

  useEffect(() => {
    if (!resultUrl) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const resultImg = new Image()
    resultImg.src = resultUrl
    resultImg.onload = () => {
      canvas.width = resultImg.width
      canvas.height = resultImg.height
      ctx.drawImage(resultImg, 0, 0)
    }

    // También cargamos la imagen original para poder restaurar
    const originalImg = new Image()
    const originalUrl = URL.createObjectURL(originalFile)
    originalImg.src = originalUrl
    originalImg.onload = () => {
      originalImageRef.current = originalImg
    }
  }, [resultUrl])

  const paint = (e) => {
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()

    // Ajusta coordenadas al tamaño real del canvas
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    ctx.beginPath()

    if (tool === "erase") {
      // Borra píxeles → los pone transparentes
      ctx.globalCompositeOperation = "destination-out"
      ctx.arc(x, y, brushSize, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(0,0,0,1)"
      ctx.fill()
    } else {
      // Restaura píxeles de la imagen original
      ctx.globalCompositeOperation = "source-over"
      ctx.save()
      ctx.beginPath()
      ctx.arc(x, y, brushSize, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(originalImageRef.current, 0, 0, canvas.width, canvas.height)
      ctx.restore()
    }
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "sin-fondo-retocado.png"
      a.click()
    }, "image/png")
  }

  return (
  <div className="retouch-wrapper">

    <div className="retouch-controls">
      <button
        className={tool === "erase" ? "active" : ""}
        onClick={() => setTool("erase")}
      >
        Borrar
      </button>
      <button
        className={tool === "restore" ? "active" : ""}
        onClick={() => setTool("restore")}
      >
        Restaurar
      </button>
      <label>
        Tamaño pincel: {brushSize}px
        <input
          type="range"
          min="5"
          max="80"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
        />
      </label>
      <button onClick={handleDownload}>Descargar</button>
    </div>

    <canvas
      ref={canvasRef}
      className={`retouch-canvas ${tool}`}
      onMouseDown={() => (isDrawing.current = true)}
      onMouseUp={() => (isDrawing.current = false)}
      onMouseLeave={() => (isDrawing.current = false)}
      onMouseMove={paint}
    />

  </div>
)
}

export default RetouchCanvas