import './DropZone.css'

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
    e.preventDefault() // necesario para que onDrop funcione
  }

  return (
    <div
      className="dropzone"
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <p>INSERTA AQUÍ LA IMAGEN<br />A QUITAR EL FONDO</p>

      <input
        id="file-input"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  )
}

export default DropZone