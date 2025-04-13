"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageEditor } from "../image-editor"
import { Button } from "@/components/ui/button"

import { updateFacilities, registerFacilities } from "@/lib/FacilidadData"
import { v4 as uuidv4 } from "uuid";
interface FacilidadesData {
  facilidades: Facilidad[]
}

export function FacilidadesEditor({ onChange }: { onChange?: (data: FacilidadesData) => void }) {

  const { facilidades } = useFacilidad();
  const [data, setData] = useState<FacilidadesData>({ facilidades: [] })
  const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        // Asegúrate de que 'facilidades' no sea undefined o vacío antes de actualizar el estado
        if (facilidades && facilidades.length > 0 && data.facilidades.length === 0) {
          setData({ facilidades });
        }
    }, [facilidades]);

const handleSave = async (index: number) => {
  setIsSaving(true);
  const facilidad = data.facilidades[index];

  try {
    // Si no tiene `id`, es una facilidad nueva
    if (!facilidad.id) {
      const newFacilidad = { ...facilidad };
      delete newFacilidad._uuid; // No enviar _uuid al backend
      const result = await registerFacilities(newFacilidad);

      alert("Facilidad registrada con éxito");
    } else {
      // Tiene un ID real de base de datos => actualizar
      await updateFacilities(facilidad);
      alert("Cambios guardados con éxito");
    }
  } catch (error) {
    console.error("Error al guardar cambios:", error);
    alert("Error al guardar cambios");
  }

  setIsSaving(false);
  window.location.reload();
};





const handleFacilidadChange = (index: number, field: keyof FacilidadBase, value: string) => {
    const newFacilidades = [...data.facilidades]
    newFacilidades[index] = { ...newFacilidades[index], [field]: value }

    const newData = { ...data, facilidades: newFacilidades }
    setData(newData)
  }

  const handleAddFacilidad = () => {
    const newFacilidad: Facilidad = {
      id: Date.now().toString(),
      nombre: "",
      descripcion: "",
      imagen: "/placeholder.svg?height=300&width=400",
    }

    const newData = {

          ...data,
          facilidades: [...data.facilidades, newFacilidad],
        };

    setData((prev) => ({
        ...prev,
        facilidades: [...prev.facilidades, newFacilidad],
      }));
    onChange(newData)

  }

  const handleRemoveFacilidad = (index: number) => {
    const newFacilidades = [...data.facilidades]
    newFacilidades.splice(index, 1)

    const newData = { ...data, facilidades: newFacilidades }
    setData(newData)
    onChange(newData)
  }

  const moveFacilidad = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === data.facilidades.length - 1)) {
      return
    }

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newFacilidades = [...data.facilidades]
    const temp = newFacilidades[index]
    newFacilidades[index] = newFacilidades[newIndex]
    newFacilidades[newIndex] = temp

    const newData = { ...data, facilidades: newFacilidades }
    setData(newData)
    onChange(newData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-gray-800">Facilidades del hotel</h2>
        <Button
          type="button"
          onClick={handleAddFacilidad}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus size={16} />
          Agregar facilidad
        </Button>
      </div>

      {data.facilidades.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">No hay facilidades agregadas</p>
          <Button
            type="button"
            onClick={handleAddFacilidad}
            variant="outline"
            size="sm"
            className="mt-2 flex items-center gap-1 mx-auto"
          >
            <Plus size={16} />
            Agregar facilidad
          </Button>
        </div>
      ) : (
        <div className="space-y-6">

          {data.facilidades.map((facilidad, index) => (
            <div key={facilidad.id || facilidad._uuid} className="border rounded-md p-4 relative">
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-500 hover:text-blue-500"
                  onClick={() => moveFacilidad(index, "up")}
                  disabled={index === 0}
                >
                  <MoveUp size={16} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-500 hover:text-blue-500"
                  onClick={() => moveFacilidad(index, "down")}
                  disabled={index === data.facilidades.length - 1}
                >
                  <MoveDown size={16} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-500 hover:text-red-500"
                  onClick={() => handleRemoveFacilidad(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la facilidad</label>
                  <Input
                    value={facilidad.titulo}
                    onChange={(e) => handleFacilidadChange(index, "titulo", e.target.value)}
                    className="w-full"
                    placeholder="Ej: Piscina Infinita, Restaurante, Spa..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <Textarea
                    value={facilidad.descripcion}
                    onChange={(e) => handleFacilidadChange(index, "descripcion", e.target.value)}
                    rows={4}
                    className="w-full"
                    placeholder="Describa los detalles y características de esta facilidad..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center h-[200px]">
                      <img
                        src={facilidad.nombreImagen || "/placeholder.svg"}
                        alt={facilidad.titulo}
                        className="max-w-full max-h-full object-cover"
                      />
                    </div>
                    <div>
                      <ImageEditor
                        compact

                        currentImageUrl={facilidad.nombreImagen}
                        onImageChange={(url) => handleFacilidadChange(index, "nombreImagen", url)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

