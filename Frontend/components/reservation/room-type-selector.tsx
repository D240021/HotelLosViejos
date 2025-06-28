"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { HabitacionBase } from "@/types/Habitacion"

interface RoomTypeSelectorProps {
  roomType: string
  onRoomTypeChange: (value: string) => void
  habitaciones: HabitacionBase[]
}

export function RoomTypeSelector({ roomType, onRoomTypeChange, habitaciones }: RoomTypeSelectorProps) {
  return (
    <div className="mb-6">
      <label htmlFor="room-type" className="block text-gray-700 mb-2">
        Tipo de Habitación
      </label>
      <Select value={roomType} onValueChange={onRoomTypeChange}>
        <SelectTrigger id="room-type" className="border-gray-200 bg-white">
          <SelectValue placeholder="Seleccione tipo de habitación" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {habitaciones.map((habitacion) => (
            <SelectItem
              key={habitacion.id.toString()}
              value={habitacion.id.toString()}
              className={habitacion.tipo === "ESTANDAR" ? "bg-teal-50" : ""}
            >
              #{habitacion.numero} -{" "}
              {habitacion.tipo === "ESTANDAR" ? "Habitación Standard" : "Suite Junior"} - $
              {habitacion.tarifaDiariaBase}/noche
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
