"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageEditor } from "../image-editor"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react"
import { useFacilidad } from "@/hooks/use-facilidades"
import { FacilidadBase } from "@/types/Facilidad"

interface Facilidad {
  id: string
  nombre: string
  descripcion: string
  imagen: string
}

interface FacilidadesData {
  facilidades: Facilidad[]
}

interface FacilidadesEditorProps {
  initialData: FacilidadesData
  onChange: (data: FacilidadesData) => void
}

export function FacilidadesEditor({ initialData, onChange }: FacilidadesEditorProps) {

  const {facilidades} = useFacilidad();

  const [data, setData] = useState<FacilidadBase[]>(facilidades);

  const handleFacilidadChange = (index: number, field: keyof Facilidad, value: string) => {
    const newFacilidades = [...data]
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
      facilidades: [...facilidades, newFacilidad],
    }

    setData(newData)
  }

  const handleRemoveFacilidad = (index: number) => {
    const newFacilidades = [...facilidades]
    newFacilidades.splice(index, 1)

    const newData = { ...data, facilidades: newFacilidades }
    setData(newData)
  }

  const moveFacilidad = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === facilidades.length - 1)) {
      return
    }

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newFacilidades = [...facilidades]
    const temp = newFacilidades[index]
    newFacilidades[index] = newFacilidades[newIndex]
    newFacilidades[newIndex] = temp

    const newData = { ...data, facilidades: newFacilidades }
    setData(newData)
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

      {facilidades.length === 0 ? (
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
          {facilidades.map((facilidad, index) => (
            <div key={facilidad.id} className="border rounded-md p-4 relative">
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
                  disabled={index === facilidades.length - 1}
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
                    onChange={(e) => handleFacilidadChange(index, "nombre", e.target.value)}
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
                        currentImageUrl={facilidad.nombreImagen || "/placeholder.svg"}
                        onImageChange={(url) => handleFacilidadChange(index, "imagen", url)}
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

