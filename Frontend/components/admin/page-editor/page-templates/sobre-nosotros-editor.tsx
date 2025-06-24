"use client"

import { Save, Plus, Trash2, MoveUp, MoveDown } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSobreNosotrosEditor } from "@/hooks/use-sobre-nosotros-editor"
import { AlertMessage } from "@/components/alert"
import { ImageEditor } from "@/components/admin/page-editor/image-editor"

export function SobreNosotrosEditor() {
    const {
        data,
        isSaving,
        alert, // Obtenemos el estado del alert
        setAlert, // Obtenemos la función para limpiar el alert
        handleChange,
        handleSave,
        handleAddImage,
        handleRemoveImage,
        handleImageTitleChange,
        handleImageUrlChange,
        moveImage,
    } = useSobreNosotrosEditor()

    const isLoading = !data?.id

    return (
        <div className="space-y-6 relative"> {/* Contenedor relativo para overlay */}

            {(isLoading || isSaving) && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-md">
                    <svg
                        className="animate-spin h-10 w-10 text-teal-600"
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                </div>
            )}


            {alert && (
                <AlertMessage
                    type={alert.type}
                    title={alert.title}
                    message={alert.message}
                    onClose={() => setAlert(null)} // Permite cerrar la alerta
                />
            )}

            <section>
                <h2 className="text-xl font-medium text-gray-800 mb-2">Contenido principal</h2>
                <label
                    htmlFor="textoSobreNosotros"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Texto de Sobre Nosotros
                </label>
                <Textarea
                    id="textoSobreNosotros"
                    name="textoSobreNosotros"
                    value={data?.textoSobreNosotros || ""}
                    onChange={handleChange}
                    rows={10}
                    className="w-full"
                    disabled={isLoading || isSaving}
                />
            </section>

            <section className="border-t pt-6">
                <h2 className="text-xl font-medium text-gray-800 mb-4">Nuestra Galería</h2>

                <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-md font-medium text-gray-700">Imágenes</h3>
                        <Button
                            onClick={handleAddImage}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            disabled={isLoading || isSaving}
                        >
                            <Plus size={16} />
                            Agregar imagen
                        </Button>
                    </div>

                    {data?.imagenesGaleria.length === 0 ? ( // Usamos optional chaining para data
                        <div className="text-center py-8 border rounded-md bg-gray-50">
                            <p className="text-gray-500">No hay imágenes en la galería</p>
                            <Button
                                onClick={handleAddImage}
                                variant="outline"
                                size="sm"
                                className="mt-2 flex items-center gap-1 mx-auto"
                                disabled={isLoading || isSaving}
                            >
                                <Plus size={16} />
                                Agregar imagen
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data?.imagenesGaleria.map((imagen, index) => ( // Usamos optional chaining para data
                                <div key={imagen.id ?? index} className="border rounded-md p-4 relative">
                                    <div className="absolute top-2 right-2 flex space-x-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            disabled={index === 0 || isLoading || isSaving}
                                            onClick={() => moveImage(imagen.id, "up")}
                                            className="text-gray-500 hover:text-blue-500 h-7 w-7"
                                        >
                                            <MoveUp size={16} />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            disabled={index === data.imagenesGaleria.length - 1 || isLoading || isSaving}
                                            onClick={() => moveImage(imagen.id, "down")}
                                            className="text-gray-500 hover:text-blue-500 h-7 w-7"
                                        >
                                            <MoveDown size={16} />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            disabled={isLoading || isSaving}
                                            onClick={() => handleRemoveImage(imagen.id)}
                                            className="text-gray-500 hover:text-red-500 h-7 w-7"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">

                                        <div className="space-y-3 md:col-span-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Título (opcional)
                                                </label>
                                                <Input
                                                    value={imagen.descripcion || ""}
                                                    onChange={(e) => handleImageTitleChange(imagen.id, e.target.value)}
                                                    placeholder="Ej: Playa al atardecer"
                                                    disabled={isLoading || isSaving}
                                                />
                                            </div>
                                            <div>
                                                <ImageEditor
                                                  label="Imagen"
                                                  currentImageUrl={imagen.nombreImagen}
                                                  onImageChange={(newUrl) => handleImageUrlChange(imagen.id, newUrl)}
                                                  compact
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Button
                onClick={handleSave}
                className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
                disabled={isSaving || isLoading}
            >
                {isSaving ? (
                    <>
                        <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
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
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
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