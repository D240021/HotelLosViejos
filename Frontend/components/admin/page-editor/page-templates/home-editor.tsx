"use client"

import { Save } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ImageEditor } from "@/components/admin/page-editor/image-editor"
import { useHomeEditor } from "@/hooks/use-home-editor"
import { Spinner } from "@/components/ui/spinner"
import { AlertMessage } from "@/components/alert"
import { FullPageLoader } from "@/components/ui/full-page-loader"

export function HomeEditor() {
  const { data, isSaving, alert, setAlert, handleChange, handleImageChange, handleSave } = useHomeEditor()

  if (!data) return <FullPageLoader />

  return (
    <div className="space-y-6">
      {alert && (
        <AlertMessage
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

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
            <Spinner size={16} color="text-white" className="-ml-1 mr-2" />
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
