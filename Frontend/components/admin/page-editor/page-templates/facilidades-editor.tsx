"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageEditor } from "../image-editor";
import { MoveUp, MoveDown, Trash2, Save, Plus } from "lucide-react";
import { FullPageLoader } from "@/components/ui/full-page-loader"
import { useFacilidadesEditor } from "@/hooks/use-facilidades-editor";
import { AlertMessage } from  "@/components/alert"

export function FacilidadesEditor({ onChange }: { onChange?: (data: any) => void }) {
    const {
    facilidades,
    isSaving,
    handleChange,
    handleAdd,
    handleRemove,
    handleReorder,
    handleSave,
    showConfirmDelete,
    setShowConfirmDelete,
    confirmDelete,
    alert,
    setAlert,
} = useFacilidadesEditor(onChange);

// Mostrar loader si los datos aún no están listos
if (!facilidades || facilidades.length === 0) {
  return <FullPageLoader />
}

    return (
        <div className="space-y-6">
            {/* Mensaje de feedback unificado */}
            {alert && (
                <AlertMessage
                    type={alert.type}
                    title={alert.title}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium text-gray-800">Facilidades del hotel</h2>
                <Button
                    onClick={handleAdd}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    disabled={isSaving}
                >
                    <Plus size={16} />
                    Agregar facilidad
                </Button>
            </div>

            {/* Facilidades vacías */}
            {facilidades.length === 0 ? (
                <div className="text-center py-8 border rounded-md bg-gray-50">
                    <p className="text-gray-500">No hay facilidades agregadas</p>
                    <Button
                        onClick={handleAdd}
                        variant="outline"
                        size="sm"
                        className="mt-2 flex items-center gap-1 mx-auto"
                        disabled={isSaving}
                    >
                        <Plus size={16} />
                        Agregar facilidad
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {facilidades.map((facilidad, i) => {
                        // Usamos el ID numérico si existe, o el ID temporal (Date.now() o _uuid si lo gestionas) para la key
                        // Aquí, si tu FacilidadBase no tiene _uuid, podrías necesitar añadirlo o usar i para las nuevas.
                        // Para la compatibilidad con el id temporal de Date.now(), haremos un cast para usarlo como key.
                       const key = (facilidad as any)._uuid || (typeof facilidad.id === 'number' ? facilidad.id : `temp-${i}`);

                        return (
                            <div key={key} className="border rounded-md p-4 relative">
                                {/* Acciones arriba */}
                                <div className="absolute top-2 right-2 flex space-x-1">
                                    <Button
                                        onClick={() => handleReorder(i, "up")}
                                        disabled={i === 0 || isSaving}
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <MoveUp size={16} />
                                    </Button>
                                    <Button
                                        onClick={() => handleReorder(i, "down")}
                                        disabled={i === facilidades.length - 1 || isSaving}
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <MoveDown size={16} />
                                    </Button>
                                    <Button
                                        onClick={() => handleRemove(i)}
                                        variant="ghost"
                                        size="icon"
                                        disabled={isSaving}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>

                                {/* Campos */}
                                <div className="space-y-4 pt-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                        <Input
                                            value={facilidad.titulo ?? ""}
                                              onChange={(e) => handleChange(i, "titulo", e.target.value)}
                                            placeholder="Ej: Spa, Piscina..."
                                            disabled={isSaving}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                        <Textarea
                                            value={facilidad.descripcion ?? ""}
                                              onChange={(e) => handleChange(i, "descripcion", e.target.value)}  rows={4}
                                            placeholder="Describa esta facilidad"
                                            disabled={isSaving}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                                        <div className="">

                                            <div>
                                               <ImageEditor
                                                 compact
                                                 currentImageUrl={facilidad.nombreImagen ?? "/placeholder.svg?height=300&width=400"}
                                                 onImageChange={(url) => handleChange(i, "nombreImagen", url)}
                                                 disabled={isSaving}
                                               />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {facilidades.length > 0 && (
                <div className="mt-8 text-center">
                    <Button
                        type="button"
                        onClick={handleSave} // Llama a handleSave sin argumentos
                        disabled={isSaving}
                        className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2 text-white mx-auto px-8 py-2"
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
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        className="opacity-25"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291..."
                                        className="opacity-75"
                                    />
                                </svg>
                                Guardando todas las facilidades...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Guardar
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* Confirmación de eliminación */}
            {showConfirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded p-6 shadow-md text-center max-w-sm mx-auto">
                        <h2 className="text-lg font-semibold mb-4">
                            ¿Estás seguro que deseas eliminar esta facilidad?
                        </h2>
                        <div className="flex justify-center gap-4">
                            <Button
                                onClick={() => setShowConfirmDelete(false)}
                                variant="outline"
                            >
                                Cancelar
                            </Button>
                            <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}