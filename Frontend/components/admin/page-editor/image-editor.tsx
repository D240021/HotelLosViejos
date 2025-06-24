"use client"

import { Input } from "@/components/ui/input"
import { ChangeEvent, useState, useEffect } from "react"

interface ImageEditorProps {
  label?: string
  currentImageUrl: string
  onImageChange: (newImageUrl: string) => void
  compact?: boolean
}

// 🔧 Configura tu Cloudinary aquí:
const CLOUD_NAME = "dp5hyblex"
const UPLOAD_PRESET = "HotelLosviejos"

export function ImageEditor({
  label = "Imagen",
  currentImageUrl,
  onImageChange,
  compact = false,
}: ImageEditorProps) {
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl)

  // Actualizar preview cuando cambie currentImageUrl externo
  useEffect(() => {
    setPreviewUrl(currentImageUrl)
  }, [currentImageUrl])

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", UPLOAD_PRESET)

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Error al subir a Cloudinary")

      const data = await res.json()
      setPreviewUrl(data.secure_url)
      onImageChange(data.secure_url)
    } catch (err) {
      console.error("Error al subir imagen:", err)
    }

    setLoading(false)
  }

  return (
    <div className="pt-2">
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Previsualización</h3>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={label}
              className="w-full h-40 object-cover rounded-md border"
            />
          ) : (
            <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 border">
              Sin imagen
            </div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Subir imagen</h3>
          <Input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
          {loading && <p className="text-sm text-gray-500 mt-2">Subiendo imagen...</p>}
        </div>
      </div>
    </div>
  )
}
