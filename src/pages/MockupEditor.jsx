import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MockupEditor() {
  const canvasRef = useRef(null)
  const navigate = useNavigate()
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [designUrl, setDesignUrl] = useState(null)
  const [design, setDesign] = useState({ x: 150, y: 150, width: 200, height: 200 })

  // Referencias para el drag
  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  // Referencias para las imágenes (para redibujar sin recargar)
  const templateImgRef = useRef(null)
  const designImgRef = useRef(null)

  const templates = [
    { id: 1, name: 'Ash Grey', src: '/mockups/ASH_GREY.png' },
    { id: 2, name: 'Dark Mustard', src: '/mockups/DARK_MUSTARD.png' },
    { id: 3, name: 'Navy', src: '/mockups/NAVY.png' },
    { id: 4, name: 'Orange', src: '/mockups/ORANGE.png' },
    { id: 5, name: 'White', src: '/mockups/WHITE.png' },
  ]

  const handleDesignUpload = (e) => {
    const file = e.target.files[0]
    if (file) setDesignUrl(URL.createObjectURL(file))
  }

  // Función que dibuja el canvas (plantilla + diseño)
  const draw = (currentDesign) => {
    if (!templateImgRef.current || !designImgRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(templateImgRef.current, 0, 0)

    ctx.globalCompositeOperation = 'multiply'
    ctx.globalAlpha = 0.9
    ctx.drawImage(
      designImgRef.current,
      currentDesign.x,
      currentDesign.y,
      currentDesign.width,
      currentDesign.height
    )
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
  }

  // Carga las imágenes cuando cambian
  useEffect(() => {
    if (!selectedTemplate || !designUrl) return
    const canvas = canvasRef.current
    const templateImg = new Image()

    templateImg.src = selectedTemplate
    templateImg.onload = () => {
      canvas.width = templateImg.width
      canvas.height = templateImg.height
      templateImgRef.current = templateImg

      const designImg = new Image()
      designImg.src = designUrl
      designImg.onload = () => {
        designImgRef.current = designImg
        draw(design)
      }
    }
  }, [selectedTemplate, designUrl])

  // Redibuja cuando cambia el tamaño
  useEffect(() => {
    draw(design)
  }, [design])

  // Convierte coordenadas del mouse a coordenadas del canvas real
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  // Detecta si el click fue dentro del diseño
  const isInsideDesign = (coords) => {
    return (
      coords.x >= design.x &&
      coords.x <= design.x + design.width &&
      coords.y >= design.y &&
      coords.y <= design.y + design.height
    )
  }

  const handleMouseDown = (e) => {
    const coords = getCanvasCoords(e)
    if (isInsideDesign(coords)) {
      isDragging.current = true
      dragOffset.current = {
        x: coords.x - design.x,
        y: coords.y - design.y,
      }
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging.current) return
    const coords = getCanvasCoords(e)
    const newDesign = {
      ...design,
      x: coords.x - dragOffset.current.x,
      y: coords.y - dragOffset.current.y,
    }
    setDesign(newDesign)
    draw(newDesign)
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#e8eaff' }}>

      {/* Navbar */}
      <nav className="mb-5 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="text-sm font-bold tracking-widest"
          style={{ color: '#4E51F5' }}
        >
          ← VOLVER
        </button>
        <span className="text-sm font-bold tracking-widest" style={{ color: '#4E51F5' }}>
          MOCKUP EDITOR
        </span>
      </nav>

      <div
        className="rounded-2xl p-10 flex gap-10"
        style={{ backgroundColor: '#dde0ff', border: '1px solid #b0b8fa' }}
      >

        {/* Panel izquierdo */}
        <div className="flex flex-col gap-6 w-72 shrink-0">

          {/* Subir diseño */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold tracking-widest" style={{ color: '#4E51F5' }}>
              TU DISEÑO
            </p>
            <label
              className="flex items-center justify-center h-24 rounded-xl cursor-pointer font-bold text-xs tracking-widest transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#c8ceff', border: '2px solid #824EF5', color: '#4E51F5' }}
            >
              SUBIR DISEÑO (PNG)
              <input type="file" accept="image/*" className="hidden" onChange={handleDesignUpload} />
            </label>
            {designUrl && (
              <img
                src={designUrl}
                alt="diseño"
                className="w-full h-24 object-contain rounded-xl"
                style={{ backgroundColor: '#c8ceff' }}
              />
            )}
          </div>

          {/* Plantillas */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold tracking-widest" style={{ color: '#4E51F5' }}>
              PLANTILLAS
            </p>
            <div className="flex flex-wrap gap-2">
              {templates.map(t => (
                <img
                  key={t.id}
                  src={t.src}
                  alt={t.name}
                  onClick={() => setSelectedTemplate(t.src)}
                  className="w-20 h-20 object-contain rounded-xl cursor-pointer border-2 transition-all"
                  style={{
                    borderColor: selectedTemplate === t.src ? '#824EF5' : '#b0b8fa',
                    backgroundColor: '#e8eaff'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Tamaño del diseño */}
          {selectedTemplate && designUrl && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold tracking-widest" style={{ color: '#4E51F5' }}>
                TAMAÑO
              </p>
              <label className="text-xs font-semibold flex flex-col gap-1" style={{ color: '#5c5c99' }}>
                {design.width}px
                <input
                  type="range"
                  min="50"
                  max="600"
                  value={design.width}
                  onChange={(e) => setDesign(d => ({
                    ...d,
                    width: Number(e.target.value),
                    height: Number(e.target.value)
                  }))}
                  style={{ accentColor: '#824EF5' }}
                />
              </label>
            </div>
          )}

          {/* Descargar */}
          {selectedTemplate && designUrl && (
            <button
              className="w-full font-bold py-2 px-6 rounded-xl transition-all duration-200"
              style={{ backgroundColor: '#4E51F5', color: 'white' }}
              onMouseEnter={e => e.target.style.backgroundColor = '#824EF5'}
              onMouseLeave={e => e.target.style.backgroundColor = '#4E51F5'}
              onClick={() => {
                canvasRef.current.toBlob((blob) => {
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'mockup.png'
                  a.click()
                }, 'image/png')
              }}
            >
              Descargar mockup
            </button>
          )}

        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-start justify-center">
          {!selectedTemplate ? (
            <div
              className="w-full h-96 rounded-2xl flex items-center justify-center text-xs font-bold tracking-widest"
              style={{ backgroundColor: '#c8ceff', border: '2px solid #824EF5', color: '#4E51F5' }}
            >
              SELECCIONA UNA PLANTILLA
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className="w-full rounded-2xl border-2"
              style={{
                borderColor: '#b0b8fa',
                cursor: isDragging.current ? 'grabbing' : 'grab'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          )}
        </div>

      </div>
    </div>
  )
}

export default MockupEditor