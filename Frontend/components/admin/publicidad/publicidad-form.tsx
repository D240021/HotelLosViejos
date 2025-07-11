"use client"

import type React from "react"
import { usePublicidadForm } from "@/hooks/use-publicidad-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, X, Upload, ExternalLink } from "lucide-react"
import type { PublicidadBase } from "@/types/Publicidad"


interface PublicidadFormProps {
  publicidad: PublicidadBase | null
  onSave: (publicidad: PublicidadBase) => void
  onCancel: () => void
}

export function PublicidadForm({ publicidad, onSave, onCancel }: PublicidadFormProps) {
  const {
    formData,
    previewUrl,
    handleChange,
    handleApplyImage,
  } = usePublicidadForm(publicidad)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título de la publicidad</Label>
            <Input
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ej: Oferta Especial Verano"
              required
            />
          </div>

          <div>
            <Label htmlFor="linkDestino">Link Destino</Label>
            <div className="flex">
              <Input
                id="linkDestino"
                name="linkDestino"
                value={formData.enlace}
                onChange={handleChange}
                placeholder="https://ejemplo.com/oferta"
                className="flex-1"
                required
              />
              <Button
                type="button"
                variant="outline"
                className="ml-2"
                onClick={() => window.open(formData.enlace, "_blank")}
                disabled={!formData.enlace}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Columna derecha - Imagen */}
        <div className="space-y-4">
          <Label>Imagen Actual</Label>

          <div className="border rounded-md p-4 bg-gray-50">
            <div className="mb-4 bg-white border rounded-md overflow-hidden">
              <img src={previewUrl || "/placeholder.svg"} alt="Vista previa" className="w-full h-48 object-contain" />
            </div>

            <div className="space-y-3">
              <Label htmlFor="imagenUrl">URL de la imagen</Label>
              <div className="flex gap-2">
                <Input
                  id="imagenUrl"
                  name="imagenUrl"
                  value={formData.imagen}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleApplyImage} className="flex items-center gap-1">
                  <Upload className="h-4 w-4" />
                  Browse
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="flex items-center gap-2">
          <X className="h-4 w-4" />
          Cancelar
        </Button>
        <Button type="submit" className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2">
          <Save className="h-4 w-4" />
          Aceptar
        </Button>
      </div>
    </form>
  )
}
