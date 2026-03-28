import { useState } from "react"
import { removeBackground } from "@imgly/background-removal"

export function useBackgroundRemoval() {
  const [resultUrl, setResultUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const processImage = async (file) => {
    setLoading(true)
    setError(null)
    setResultUrl(null)

    try {
      const blob = await removeBackground(file, {
        model: "large",
        output: {
          quality: 1,        // calidad máxima del PNG resultante
          format: "image/png",
        },
        progress: (key, current, total) => {
          const pct = Math.round((current / total) * 100)
          setProgress(pct)
        },
      })

      const url = URL.createObjectURL(blob)
      setResultUrl(url)
    } catch (err) {
      setError("Ocurrió un error procesando la imagen.")
      console.error(err)
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  return { processImage, resultUrl, loading, progress, error }
}
