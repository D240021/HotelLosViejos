"use client"

import { Save, Plus, Trash2, MoveUp, MoveDown } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { FullPageLoader } from "@/components/ui/full-page-loader"
import { AlertMessage } from "@/components/alert"
import { ImageEditor } from "@/components/admin/page-editor/image-editor"
import { useSobreNosotrosEditor } from "@/hooks/use-sobre-nosotros-editor"

export function SobreNosotrosEditor() {
  const {
    data,
    isSaving,
    alert,
    setAlert,
    handleChange,
    handleSave,
    handleAddImage,
    handleRemoveImage,
    handleImageTitleChange,
    handleImageUrlChange,
    moveImage,
  } = useSobreNosotrosEditor()

  if (!data?.id) {
    return <FullPageLoader />
  }

  return (
    <div className="space-y-6">
      {/* 2. Mensajes de alerta */}
      {alert && (
        <AlertMessage
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <section>
        <h2 className="text-xl font-medium text-gray-800 mb-2">Contenido principal</h2>
        <label htmlFor="textoSobreNosotros" className="block text-sm font-medium text-gray-700 mb-1">
          Texto de Sobre Nosotros
        </label>
        <Textarea
          id="textoSobreNosotros"
          name="textoSobreNosotros"
          value={data.textoSobreNosotros}
          onChange={handleChange}
          rows={10}
          className="w-full"
          disabled={isSaving}
        />
      </section>

      <section className="border-t pt-6">
        <h2 className="text-xl font-medium text-gray-800 mb-4">Nuestra Galería</h2>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-medium text-gray-700">Imágenes</h3>
          <Button
            onClick={handleAddImage}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            disabled={isSaving}
          >
            <Plus size={16} />
            Agregar imagen
          </Button>
        </div>

        {data.imagenesGaleria.length === 0 ? (
          <div className="text-center py-8 border rounded-md bg-gray-50">
            <p className="text-gray-500">No hay imágenes en la galería</p>
            <Button
              onClick={handleAddImage}
              variant="outline"
              size="sm"
              className="mt-2 flex items-center gap-1 mx-auto"
              disabled={isSaving}
            >
              <Plus size={16} />
              Agregar imagen
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {data.imagenesGaleria.map((img, idx) => (
              <div key={img.id ?? idx} className="border rounded-md p-4 relative">
                {/* Acciones */}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveImage(img.id, "up")}
                    disabled={idx === 0 || isSaving}
                  >
                    <MoveUp size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveImage(img.id, "down")}
                    disabled={idx === data.imagenesGaleria.length - 1 || isSaving}
                  >
                    <MoveDown size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveImage(img.id)}
                    disabled={isSaving}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                {/* Campos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-3 md:col-span-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título (opcional)</label>
                      <Input
                        value={img.descripcion}
                        onChange={e => handleImageTitleChange(img.id, e.target.value)}
                        placeholder="Ej: Playa al atardecer"
                        disabled={isSaving}
                      />
                    </div>
                    <ImageEditor
                      label="Imagen"
                      currentImageUrl={img.nombreImagen}
                      onImageChange={url => handleImageUrlChange(img.id, url)}
                      compact
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
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
