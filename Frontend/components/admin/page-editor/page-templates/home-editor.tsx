"use client"

import { Save } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ImageEditor } from "../image-editor"
import { useHomeEditor } from "@/hooks/use-home-editor"

export function HomeEditor() {
  const {
    data,
    isSaving,
    handleChange,
    handleImageChange,
    handleSave,
  } = useHomeEditor()

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-700">Sección Bienvenida</h3>

        <div>
          <label htmlFor="textoBienvenida" className="block text-sm font-medium text-gray-700 mb-1">
            Texto de bienvenida
          </label>
          <Textarea
            id="textoBienvenida"
            name="textoBienvenida"
            value={data.textoBienvenida}
            onChange={handleChange}
            rows={8}
            className="w-full"
          />
        </div>

        <ImageEditor
          label="Imagen de la piscina"
          currentImageUrl={data.nombreImagenBienvenida || ""}
          onImageChange={(url) => handleImageChange("nombreImagenBienvenida", url)}
        />
      </div>

      <Button
        onClick={handleSave}
        className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291..."
              />
            </svg>
            Guardando...
          </>
        ) : (
          <>
            <Save size={16} />
            Guardar cambios
          </>
        )}
      </Button>
    </div>
  )
}
