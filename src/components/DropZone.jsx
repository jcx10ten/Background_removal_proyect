function DropZone({ onFileSelected }) {

  const handleClick = () => {
    document.getElementById('file-input').click()
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) onFileSelected(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) onFileSelected(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div
      className="w-full h-64 flex items-center justify-center text-center rounded-2xl cursor-pointer transition-opacity duration-200 hover:opacity-80"
      style={{
        backgroundColor: '#c8ceff',
        border: '3px solid #824EF5',
      }}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <p
        className="text-xs font-bold tracking-widest"
        style={{ color: '#4E51F5' }}
      >
        INSERTA AQUÍ LA IMAGEN<br />A QUITAR EL FONDO
      </p>

      <input
        id="file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}

export default DropZone